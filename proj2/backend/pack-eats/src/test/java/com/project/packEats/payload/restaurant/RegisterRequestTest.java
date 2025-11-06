package com.project.packEats.payload.restaurant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestTest {

    private RegisterRequest registerRequest;

    @BeforeEach
    void setup() {
        registerRequest = new RegisterRequest();
    }

    @Test
    void testSetAndGetFullName() {
        registerRequest.setFullName("John Doe");
        assertEquals("John Doe", registerRequest.getFullName());
    }

    @Test
    void testSetAndGetEmail() {
        registerRequest.setEmail("john@example.com");
        assertEquals("john@example.com", registerRequest.getEmail());
    }

    @Test
    void testSetAndGetPassword() {
        registerRequest.setPassword("password123");
        assertEquals("password123", registerRequest.getPassword());
    }

    @Test
    void testSetAndGetRole() {
        registerRequest.setRole("restaurant_owner");
        assertEquals("restaurant_owner", registerRequest.getRole());
    }

    @Test
    void testSetAndGetPhone() {
        registerRequest.setPhone("1234567890");
        assertEquals("1234567890", registerRequest.getPhone());
    }
}
