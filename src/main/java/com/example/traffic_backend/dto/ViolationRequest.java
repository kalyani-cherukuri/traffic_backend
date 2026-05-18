package com.example.traffic_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViolationRequest {

    private String violationName;

    private String description;

    private Double baseFineAmount;
}
