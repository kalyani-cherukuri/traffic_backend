package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.VehicleRequest;
import com.example.traffic_backend.entity.User;
import com.example.traffic_backend.entity.Vehicle;
import com.example.traffic_backend.exception.ResourceNotFoundException;
import com.example.traffic_backend.repository.UserRepository;
import com.example.traffic_backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    private final UserRepository userRepository;

    public Vehicle registerVehicle(
            VehicleRequest request,
            Authentication authentication
    ) {

        if(vehicleRepository.existsByVehicleNumber(
                request.getVehicleNumber())) {

            throw new ResourceNotFoundException(
                    "Vehicle already exists"
            );
        }

        User owner = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow();

        Vehicle vehicle = Vehicle.builder()
                .vehicleNumber(request.getVehicleNumber())
                .vehicleType(request.getVehicleType())
                .registrationDate(LocalDate.now())
                .owner(owner)
                .build();

        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {

        return vehicleRepository.findAll();
    }

    public List<Vehicle> getMyVehicles(
            Authentication authentication
    ) {

        User owner = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow();

        return vehicleRepository.findByOwner(owner);
    }
}
