package com.example.traffic_backend.controller;

import com.example.traffic_backend.dto.UserRequest;
import com.example.traffic_backend.entity.User;
import com.example.traffic_backend.enums.Role;
import com.example.traffic_backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@Valid
            @RequestBody UserRequest request
    ) {

        return ResponseEntity.ok(
                userService.createUser(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(required = false)
            Role role
    ) {

        if(role != null) {

            return ResponseEntity.ok(
                    userService.getUsersByRole(role)
            );
        }

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }
}