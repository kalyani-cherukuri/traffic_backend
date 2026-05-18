package com.example.traffic_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Violation type ID is required")
    private Long violationTypeId;

    @NotBlank(message = "Violation location is required")
    private String violationLocation;
}