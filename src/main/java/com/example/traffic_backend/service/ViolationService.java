package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.ViolationRequest;
import com.example.traffic_backend.entity.ViolationType;
import com.example.traffic_backend.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ViolationService {

    private final ViolationTypeRepository violationTypeRepository;

    public ViolationType createViolation(
            ViolationRequest request
    ) {

        ViolationType violation = ViolationType.builder()
                .violationName(request.getViolationName())
                .description(request.getDescription())
                .baseFineAmount(request.getBaseFineAmount())
                .createdAt(LocalDateTime.now())
                .build();

        return violationTypeRepository.save(violation);
    }

    public List<ViolationType> getAllViolations() {

        return violationTypeRepository.findAll();
    }
}