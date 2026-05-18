package com.example.traffic_backend.repository;

import com.example.traffic_backend.entity.PaymentTransaction;
import com.example.traffic_backend.entity.ViolationTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentTransactionRepository
        extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction>
    findByViolationTicket(ViolationTicket ticket);
}