package com.shopper.service;

import com.shopper.model.Product;
import com.shopper.model.StockMovement;
import com.shopper.repository.ProductRepository;
import com.shopper.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    public List<StockMovement> getAllMovements() {
        return stockMovementRepository.findAll();
    }

    public List<StockMovement> getMovementsForProduct(Long productId) {
        return stockMovementRepository.findByProductIdOrderByDateDesc(productId);
    }

    public StockMovement addStockMovement(StockMovement movement) {
        Product product = productRepository.findById(movement.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (movement.getType() == StockMovement.MovementType.IN) {
            product.setQuantity(product.getQuantity() + movement.getQuantity());
        } else if (movement.getType() == StockMovement.MovementType.OUT) {
            if (product.getQuantity() < movement.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }
            product.setQuantity(product.getQuantity() - movement.getQuantity());
        } else {
            // ADJUSTMENT — set absolute
            product.setQuantity(movement.getQuantity());
        }

        productRepository.save(product);
        return stockMovementRepository.save(movement);
    }
}
