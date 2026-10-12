package com.shopper.repository;

import com.shopper.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductIdOrderByDateDesc(Long productId);

    List<StockMovement> findByDateBetweenOrderByDateDesc(LocalDateTime start, LocalDateTime end);

    List<StockMovement> findByType(StockMovement.MovementType type);
}
