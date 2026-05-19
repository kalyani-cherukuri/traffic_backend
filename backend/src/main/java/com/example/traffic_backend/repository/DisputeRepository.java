package com.example.traffic_backend.repository;

import com.example.traffic_backend.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeRepository
        extends JpaRepository<Dispute, Long> {
}