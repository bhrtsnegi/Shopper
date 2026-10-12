package com.shopper.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private LocalDateTime date;

    private String referenceId; // e.g., bill number
    private String note;

    @PrePersist
    protected void onCreate() {
        if (date == null) date = LocalDateTime.now();
    }

    public enum MovementType {
        IN,   // stock added / purchase
        OUT,  // stock deducted / sale
        ADJUSTMENT
    }
}
