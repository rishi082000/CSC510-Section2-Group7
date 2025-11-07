package com.project.packEats.payload.driver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class DriverLoginRequestTest {

    @Test
    public void testSettersAndGetters() {
        DriverLoginRequest request = new DriverLoginRequest();

        request.setEmail("test@example.com");
        request.setPassword("securePassword");

        assertEquals("test@example.com", request.getEmail());
        assertEquals("securePassword", request.getPassword());
    }

    @Test
    public void testToStringContainsFields() {
        DriverLoginRequest request = new DriverLoginRequest();
        request.setEmail("driver@example.com");
        request.setPassword("pass123");

        String toString = request.toString();
        assertTrue(toString.contains("email=driver@example.com"));
        assertTrue(toString.contains("password=pass123"));
    }

    @Test
    public void testEqualsAndHashCode() {
        DriverLoginRequest request1 = new DriverLoginRequest();
        DriverLoginRequest request2 = new DriverLoginRequest();

        request1.setEmail("a@example.com");
        request1.setPassword("123");

        request2.setEmail("a@example.com");
        request2.setPassword("123");

        assertEquals(request1, request2);
        assertEquals(request1.hashCode(), request2.hashCode());
    }
}
