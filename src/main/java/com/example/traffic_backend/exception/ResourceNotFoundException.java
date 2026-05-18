package com.example.traffic_backend.exception;

public class ResourceNotFoundException
        extends RuntimeException {

    public ResourceNotFoundException(String message) {

        super(message);
    }
}