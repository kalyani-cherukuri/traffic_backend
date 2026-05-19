package com.example.traffic_backend.controller;

import com.example.traffic_backend.dto.PaymentRequest;
import com.example.traffic_backend.entity.PaymentTransaction;
import com.example.traffic_backend.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentTransaction> payFine(@Valid
            @RequestBody PaymentRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                paymentService.payFine(
                        request,
                        authentication
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<PaymentTransaction>>
    getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPayments()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentTransaction>>
    getMyPayments(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                paymentService.getMyPayments(
                        authentication
                )
        );
    }
}