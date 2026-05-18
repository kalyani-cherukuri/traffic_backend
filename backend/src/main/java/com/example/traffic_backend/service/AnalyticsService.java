package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.*;
import com.example.traffic_backend.repository.
ViolationTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ViolationTicketRepository ticketRepository;

    public Double getTotalFineCollected() {

        return ticketRepository
                .getTotalFineCollected();
    }

    public Long getTotalUnpaidTickets() {

        return ticketRepository
                .getTotalUnpaidTickets();
    }

    public MostCommonViolationDTO
    getMostCommonViolation() {

        return ticketRepository
                .getMostCommonViolation()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public List<TicketStatusSummaryDTO>
    getTicketStatusSummary() {

        return ticketRepository
                .getTicketStatusSummary();
    }

    public List<RevenueByViolationDTO>
    getRevenueByViolation() {

        return ticketRepository
                .getRevenueByViolation();
    }
}