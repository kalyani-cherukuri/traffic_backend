package com.example.traffic_backend.repository;

import com.example.traffic_backend.entity.Vehicle;
import com.example.traffic_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository
        extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByOwner(User owner);

    boolean existsByVehicleNumber(String vehicleNumber);
}