package com.project.packEats.payload.driver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class DriverRegistrationRequestTest {

    @Test
    public void testNoArgsConstructorAndSetters() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();

        request.setFullName("John Doe");
        request.setEmail("john@example.com");
        request.setPhone("1234567890");
        request.setPassword("securePassword");
        request.setLicenseNumber("LIC12345");
        request.setVehicleType("Car");
        request.setEcoEnabled(true);

        assertEquals("John Doe", request.getFullName());
        assertEquals("john@example.com", request.getEmail());
        assertEquals("1234567890", request.getPhone());
        assertEquals("securePassword", request.getPassword());
        assertEquals("LIC12345", request.getLicenseNumber());
        assertEquals("Car", request.getVehicleType());
        assertTrue(request.getEcoEnabled());
    }

    @Test
    public void testEcoEnabledFalse() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();
        request.setEcoEnabled(false);

        assertFalse(request.getEcoEnabled());
    }

    @Test
    public void testAllSettersAndGettersConsistency() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();

        request.setFullName("Jane Smith");
        request.setEmail("jane@example.com");
        request.setPhone("0987654321");
        request.setPassword("anotherPass");
        request.setLicenseNumber("LIC67890");
        request.setVehicleType("Bike");
        request.setEcoEnabled(false);

        assertEquals("Jane Smith", request.getFullName());
        assertEquals("jane@example.com", request.getEmail());
        assertEquals("0987654321", request.getPhone());
        assertEquals("anotherPass", request.getPassword());
        assertEquals("LIC67890", request.getLicenseNumber());
        assertEquals("Bike", request.getVehicleType());
        assertFalse(request.getEcoEnabled());
    }
}
