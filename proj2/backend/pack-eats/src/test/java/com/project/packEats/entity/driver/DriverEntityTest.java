package com.project.packEats.entity.driver;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class DriverEntityTest {

    @Test
    public void testNoArgsConstructorAndSetters() {
        DriverEntity driver = new DriverEntity();

        UUID id = UUID.randomUUID();
        driver.setId(id);
        driver.setFullName("John Doe");
        driver.setEmail("john.doe@example.com");
        driver.setPhone("1234567890");
        driver.setPassword("securePassword");

        assertEquals(id, driver.getId());
        assertEquals("John Doe", driver.getFullName());
        assertEquals("john.doe@example.com", driver.getEmail());
        assertEquals("1234567890", driver.getPhone());
        assertEquals("securePassword", driver.getPassword());
    }

    @Test
    public void testAllArgsConstructor() {
        UUID id = UUID.randomUUID();
        DriverEntity driver = new DriverEntity(
            id, 
            "Jane Smith", 
            "jane.smith@example.com", 
            "0987654321", 
            "anotherPassword"
        );

        assertEquals(id, driver.getId());
        assertEquals("Jane Smith", driver.getFullName());
        assertEquals("jane.smith@example.com", driver.getEmail());
        assertEquals("0987654321", driver.getPhone());
        assertEquals("anotherPassword", driver.getPassword());
    }
}
