package com.project.packEats.entity.driver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class DriverInfoEntityTest {

    @Test
    public void testNoArgsConstructorAndSetters() {
        DriverInfoEntity info = new DriverInfoEntity();

        DriverEntity driver = new DriverEntity();
        info.setId(1);
        info.setDriver(driver);
        info.setLicenseNumber("LIC123456");
        info.setVehicleType("Car");
        info.setEcoEnabled(true);
        info.setStatus("ACTIVE");

        assertEquals(1, info.getId());
        assertEquals(driver, info.getDriver());
        assertEquals("LIC123456", info.getLicenseNumber());
        assertEquals("Car", info.getVehicleType());
        assertTrue(info.getEcoEnabled());
        assertEquals("ACTIVE", info.getStatus());
    }

    @Test
    public void testAllArgsConstructor() {
        DriverEntity driver = new DriverEntity();
        DriverInfoEntity info = new DriverInfoEntity(
            2, 
            driver, 
            "LIC987654", 
            "Bike", 
            false, 
            "INACTIVE"
        );

        assertEquals(2, info.getId());
        assertEquals(driver, info.getDriver());
        assertEquals("LIC987654", info.getLicenseNumber());
        assertEquals("Bike", info.getVehicleType());
        assertFalse(info.getEcoEnabled());
        assertEquals("INACTIVE", info.getStatus());
    }
}
