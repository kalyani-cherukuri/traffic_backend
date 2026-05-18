package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.UserRequest;
import com.example.traffic_backend.entity.User;
import com.example.traffic_backend.enums.Role;
import com.example.traffic_backend.exception.ResourceNotFoundException;
import com.example.traffic_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.
PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public User createUser(UserRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {

            throw new ResourceNotFoundException(
                    "Email already exists"
            );
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

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    public List<User> getUsersByRole(Role role) {

        return userRepository.findByRole(role);
    }
}