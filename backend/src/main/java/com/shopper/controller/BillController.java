package com.shopper.controller;

import com.shopper.model.Bill;
import com.shopper.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public Bill getBill(@PathVariable Long id) {
        return billService.getBillById(id);
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        return ResponseEntity.status(HttpStatus.CREATED).body(billService.createBill(bill));
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
                "todaysBills", billService.countTodaysBills(),
                "todaysRevenue", billService.getTodaysRevenue()
        );
    }
}
