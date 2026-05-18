package com.example.traffic_backend.controller;

import com.example.traffic_backend.dto.TicketRequest;
import com.example.traffic_backend.entity.ViolationTicket;
import com.example.traffic_backend.service.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<ViolationTicket> issueTicket(
            @Valid @RequestBody TicketRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ticketService.issueTicket(
                        request,
                        authentication
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<ViolationTicket>> getAllTickets() {

        return ResponseEntity.ok(
                ticketService.getAllTickets()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViolationTicket> getTicket(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ticketService.getTicketById(id)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<ViolationTicket>> getMyTickets(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ticketService.getMyTickets(
                        authentication
                )
        );
    }
}