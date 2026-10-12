package com.shopper.service;

import com.shopper.model.Bill;
import com.shopper.model.BillItem;
import com.shopper.model.Product;
import com.shopper.model.StockMovement;
import com.shopper.repository.BillRepository;
import com.shopper.repository.ProductRepository;
import com.shopper.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BillService {

    private final BillRepository billRepository;
    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
    }

    public Bill createBill(Bill bill) {
        // Generate bill number: BILL-YYYYMMDD-XXXX
        String dateStr = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        long count = billRepository.count() + 1;
        bill.setBillNumber(String.format("BILL-%s-%04d", dateStr, count));

        // Link items to bill, calculate subtotals, deduct stock
        BigDecimal subtotal = BigDecimal.ZERO;
        for (BillItem item : bill.getItems()) {
            item.setBill(bill);

            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            item.setUnitPrice(product.getPrice());
            item.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            subtotal = subtotal.add(item.getSubtotal());

            // Deduct stock
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);

            // Record stock movement
            StockMovement movement = StockMovement.builder()
                    .product(product)
                    .type(StockMovement.MovementType.OUT)
                    .quantity(item.getQuantity())
                    .note("Sale - " + bill.getBillNumber())
                    .build();
            stockMovementRepository.save(movement);
        }

        bill.setSubtotal(subtotal);
        BigDecimal discountAmt = bill.getDiscountAmount() != null ? bill.getDiscountAmount() : BigDecimal.ZERO;
        bill.setTotalAmount(subtotal.subtract(discountAmt));

        return billRepository.save(bill);
    }


    public long countTodaysBills() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return billRepository.countTodaysBills(start, end);
    }

    public BigDecimal getTodaysRevenue() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        BigDecimal revenue = billRepository.todaysRevenue(
                start, end, Bill.BillStatus.PAID
        );
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

}
