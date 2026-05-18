package com.example.traffic_backend.controller;

import com.example.traffic_backend.dto.VehicleRequest;
import com.example.traffic_backend.entity.Vehicle;
import com.example.traffic_backend.service.VehicleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<Vehicle> registerVehicle(
            @Valid @RequestBody VehicleRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                vehicleService.registerVehicle(
                        request,
                        authentication
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {

        return ResponseEntity.ok(
                vehicleService.getAllVehicles()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Vehicle>> getMyVehicles(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                vehicleService.getMyVehicles(
                        authentication
                )
        );
    }
}