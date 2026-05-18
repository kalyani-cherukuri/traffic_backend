package com.example.traffic_backend.dto;

import com.example.traffic_backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {

    private String name;

    private String email;

    private String password;

    private String phoneNumber;

    private Role role;
}