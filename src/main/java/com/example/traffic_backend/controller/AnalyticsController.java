package com.example.traffic_backend.controller;

import com.example.traffic_backend.dto.*;
import com.example.traffic_backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/total-fines")
    public ResponseEntity<Double>
    getTotalFineCollected() {

        return ResponseEntity.ok(
                analyticsService.getTotalFineCollected()
        );
    }

    @GetMapping("/unpaid-tickets")
    public ResponseEntity<Long>
    getUnpaidTickets() {

        return ResponseEntity.ok(
                analyticsService.getTotalUnpaidTickets()
        );
    }

    @GetMapping("/most-common-violation")
    public ResponseEntity<MostCommonViolationDTO>
    getMostCommonViolation() {

        return ResponseEntity.ok(
                analyticsService.getMostCommonViolation()
        );
    }

    @GetMapping("/ticket-status-summary")
    public ResponseEntity<List<TicketStatusSummaryDTO>>
    getTicketStatusSummary() {

        return ResponseEntity.ok(
                analyticsService.getTicketStatusSummary()
        );
    }

    @GetMapping("/revenue-by-violation")
    public ResponseEntity<List<RevenueByViolationDTO>>
    getRevenueByViolation() {

        return ResponseEntity.ok(
                analyticsService.getRevenueByViolation()
        );
    }
}