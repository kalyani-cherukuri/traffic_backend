package com.example.traffic_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RevenueByViolationDTO {

    private String violationName;

    private Double totalRevenue;
}