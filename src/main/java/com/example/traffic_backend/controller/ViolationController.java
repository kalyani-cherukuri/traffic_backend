package com.example.traffic_backend.controller;

import com.example.traffic_backend.dto.ViolationRequest;
import com.example.traffic_backend.entity.ViolationType;
import com.example.traffic_backend.service.ViolationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/violations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ViolationController {

    private final ViolationService violationService;

    @PostMapping
    public ResponseEntity<ViolationType> createViolation(
            @Valid @RequestBody ViolationRequest request
    ) {

        return ResponseEntity.ok(
                violationService.createViolation(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<ViolationType>> getAllViolations() {

        return ResponseEntity.ok(
                violationService.getAllViolations()
        );
    }
}