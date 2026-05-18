package com.example.traffic_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResolveDisputeRequest {

    private String status;

    private String resolutionRemark;
}