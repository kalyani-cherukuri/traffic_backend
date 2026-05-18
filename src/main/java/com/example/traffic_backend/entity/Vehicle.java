package com.example.traffic_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String vehicleNumber;

    private String vehicleType;

    private LocalDate registrationDate;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}