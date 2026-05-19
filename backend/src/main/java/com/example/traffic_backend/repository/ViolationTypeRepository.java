package com.example.traffic_backend.repository;

import com.example.traffic_backend.entity.ViolationType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationTypeRepository
        extends JpaRepository<ViolationType, Long> {
}