package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.*;
import com.example.traffic_backend.entity.User;
import com.example.traffic_backend.repository.UserRepository;
import com.example.traffic_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.
AuthenticationManager;
import org.springframework.security.authentication.
UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.
PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String token =
                jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getRole(),
                user.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(
                request.getEmail()
        ).orElseThrow();

        String token =
                jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getRole(),
                user.getEmail()
        );
    }
}