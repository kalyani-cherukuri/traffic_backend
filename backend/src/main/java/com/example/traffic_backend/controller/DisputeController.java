package com.example.traffic_backend.controller;

import com.example.traffic_backend.dto.DisputeRequest;
import com.example.traffic_backend.dto.ResolveDisputeRequest;
import com.example.traffic_backend.entity.Dispute;
import com.example.traffic_backend.service.DisputeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping
    public ResponseEntity<Dispute> raiseDispute(@Valid
            @RequestBody DisputeRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                disputeService.raiseDispute(
                        request,
                        authentication
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Dispute>> getAllDisputes() {

        return ResponseEntity.ok(
                disputeService.getAllDisputes()
        );
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Dispute> resolveDispute(
            @PathVariable Long id,
            @Valid @RequestBody ResolveDisputeRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                disputeService.resolveDispute(
                        id,
                        request,
                        authentication
                )
        );
    }
}