package com.project.packEats.payload.driver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class DriverLoginResponseTest {

    @Test
    public void testNoArgsConstructorAndSetters() {
        DriverLoginResponse response = new DriverLoginResponse();

        response.setStatus("SUCCESS");
        response.setMessage("Login successful");
        response.setFullName("John Doe");
        response.setEmail("john@example.com");

        assertEquals("SUCCESS", response.getStatus());
        assertEquals("Login successful", response.getMessage());
        assertEquals("John Doe", response.getFullName());
        assertEquals("john@example.com", response.getEmail());
    }

    @Test
    public void testAllArgsConstructor() {
        DriverLoginResponse response = new DriverLoginResponse(
                "SUCCESS",
                "Login successful",
                "Jane Smith",
                "jane@example.com"
        );

        assertEquals("SUCCESS", response.getStatus());
        assertEquals("Login successful", response.getMessage());
        assertEquals("Jane Smith", response.getFullName());
        assertEquals("jane@example.com", response.getEmail());
    }

    @Test
    public void testConvenienceConstructor() {
        DriverLoginResponse response = new DriverLoginResponse("ERROR", "Invalid credentials");

        assertEquals("ERROR", response.getStatus());
        assertEquals("Invalid credentials", response.getMessage());
        assertNull(response.getFullName());
        assertNull(response.getEmail());
    }

    @Test
    public void testEqualsAndHashCode() {
        DriverLoginResponse r1 = new DriverLoginResponse("SUCCESS", "OK", "Alice", "alice@example.com");
        DriverLoginResponse r2 = new DriverLoginResponse("SUCCESS", "OK", "Alice", "alice@example.com");

        assertEquals(r1, r2);
        assertEquals(r1.hashCode(), r2.hashCode());
    }

    @Test
    public void testToStringContainsFields() {
        DriverLoginResponse response = new DriverLoginResponse("SUCCESS", "Welcome", "Bob", "bob@example.com");
        String str = response.toString();

        assertTrue(str.contains("status=SUCCESS"));
        assertTrue(str.contains("message=Welcome"));
        assertTrue(str.contains("fullName=Bob"));
        assertTrue(str.contains("email=bob@example.com"));
    }
}
