package com.project.packEats.payload.driver;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class DriverRegistrationResponseTest {

    @Test
    public void testNoArgsConstructorAndSetters() {
        DriverRegistrationResponse response = new DriverRegistrationResponse();

        UUID id = UUID.randomUUID();
        response.setId(id);
        response.setFullName("John Doe");
        response.setEmail("john@example.com");
        response.setPhone("1234567890");
        response.setLicenseNumber("LIC12345");
        response.setVehicleType("Car");
        response.setEcoEnabled(true);
        response.setStatus("SUCCESS");
        response.setMessage("Driver registered successfully");

        assertEquals(id, response.getId());
        assertEquals("John Doe", response.getFullName());
        assertEquals("john@example.com", response.getEmail());
        assertEquals("1234567890", response.getPhone());
        assertEquals("LIC12345", response.getLicenseNumber());
        assertEquals("Car", response.getVehicleType());
        assertTrue(response.getEcoEnabled());
        assertEquals("SUCCESS", response.getStatus());
        assertEquals("Driver registered successfully", response.getMessage());
    }

    @Test
    public void testAllArgsConstructor() {
        UUID id = UUID.randomUUID();
        DriverRegistrationResponse response = new DriverRegistrationResponse(
                id,
                "Jane Smith",
                "jane@example.com",
                "0987654321",
                "LIC67890",
                "Bike",
                false,
                "FAILED",
                "Email already exists"
        );

        assertEquals(id, response.getId());
        assertEquals("Jane Smith", response.getFullName());
        assertEquals("jane@example.com", response.getEmail());
        assertEquals("0987654321", response.getPhone());
        assertEquals("LIC67890", response.getLicenseNumber());
        assertEquals("Bike", response.getVehicleType());
        assertFalse(response.getEcoEnabled());
        assertEquals("FAILED", response.getStatus());
        assertEquals("Email already exists", response.getMessage());
    }
}
