package com.shopper.controller;

import com.shopper.model.StockMovement;
import com.shopper.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/movements")
    public List<StockMovement> getAllMovements() {
        return stockService.getAllMovements();
    }

    @GetMapping("/movements/product/{productId}")
    public List<StockMovement> getMovementsForProduct(@PathVariable Long productId) {
        return stockService.getMovementsForProduct(productId);
    }

    @PostMapping("/movements")
    public ResponseEntity<StockMovement> addMovement(@RequestBody StockMovement movement) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockService.addStockMovement(movement));
    }
}
