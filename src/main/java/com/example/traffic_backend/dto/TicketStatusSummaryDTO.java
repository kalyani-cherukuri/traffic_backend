package com.example.traffic_backend.dto;

import com.example.traffic_backend.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketStatusSummaryDTO {

    private TicketStatus status;

    private Long count;
}