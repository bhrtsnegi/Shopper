package com.shopper.repository;

import com.shopper.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    Optional<Bill> findByBillNumber(String billNumber);

    List<Bill> findByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<Bill> findByStatus(Bill.BillStatus status);

    @Query("""
        SELECT COUNT(b)
        FROM Bill b
        WHERE b.createdAt >= :start
          AND b.createdAt < :end
        """)
    long countTodaysBills(
            @org.springframework.data.repository.query.Param("start")
            LocalDateTime start,
            @org.springframework.data.repository.query.Param("end")
            LocalDateTime end
    );


    @Query("""
    SELECT COALESCE(SUM(b.totalAmount), 0)
    FROM Bill b
    WHERE b.createdAt >= :start
      AND b.createdAt < :end
      AND b.status = :status
    """)
    java.math.BigDecimal todaysRevenue(
            @org.springframework.data.repository.query.Param("start")
            java.time.LocalDateTime start,
            @org.springframework.data.repository.query.Param("end")
            java.time.LocalDateTime end,
            @org.springframework.data.repository.query.Param("status")
            Bill.BillStatus status
    );

}