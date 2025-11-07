package com.project.packEats.payload.restaurant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    private LoginRequest loginRequest;

    @BeforeEach
    void setup() {
        loginRequest = new LoginRequest();
    }

    @Test
    void testSetAndGetEmail() {
        loginRequest.setEmail("test@example.com");
        assertEquals("test@example.com", loginRequest.getEmail());
    }

    @Test
    void testSetAndGetPassword() {
        loginRequest.setPassword("password123");
        assertEquals("password123", loginRequest.getPassword());
    }
}
