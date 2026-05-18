package com.example.traffic_backend.dto;

import com.example.traffic_backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private Role role;

    private String email;
}