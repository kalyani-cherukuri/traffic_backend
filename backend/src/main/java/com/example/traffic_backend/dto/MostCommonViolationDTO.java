package com.example.traffic_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MostCommonViolationDTO {

    private String violationName;

    private Long count;
}