package com.project.packEats.controller.driver;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.packEats.entity.driver.DriverEntity;
import com.project.packEats.entity.driver.DriverInfoEntity;
import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.payload.driver.DriverRegistrationRequest;
import com.project.packEats.payload.driver.DriverRegistrationResponse;
import com.project.packEats.repository.DriverInfoRepository;
import com.project.packEats.repository.DriverRepository;
import com.project.packEats.repository.UserRepository;

class DriverLoginControllerTest {

    @InjectMocks
    private DriverLoginController driverLoginController;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DriverInfoRepository driverInfoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginDriverSuccess() {
        UUID driverId = UUID.randomUUID();

        DriverRegistrationRequest request = new DriverRegistrationRequest();
        request.setEmail("driver@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setId(driverId);
        user.setEmail("driver@example.com");
        user.setPasswordHash("encodedPassword");

        DriverEntity driver = new DriverEntity();
        driver.setId(driverId);
        driver.setEmail("driver@example.com");
        driver.setFullName("John Doe");
        driver.setPhone("1234567890");

        DriverInfoEntity driverInfo = new DriverInfoEntity();
        driverInfo.setDriver(driver);
        driverInfo.setLicenseNumber("ABC123");
        driverInfo.setVehicleType("Car");
        driverInfo.setEcoEnabled(true);
        driverInfo.setStatus("active");

        List<DriverInfoEntity> driverInfoList = new ArrayList<>();
        driverInfoList.add(driverInfo);

        when(userRepository.findByEmail(anyString())).thenReturn(user);
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(driverRepository.findByEmail(anyString())).thenReturn(Optional.of(driver));
        when(driverInfoRepository.findAll()).thenReturn(driverInfoList);

        ResponseEntity<?> responseEntity = driverLoginController.loginDriver(request);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertTrue(responseEntity.getBody() instanceof DriverRegistrationResponse);

        DriverRegistrationResponse response = (DriverRegistrationResponse) responseEntity.getBody();
        assertEquals("driver@example.com", response.getEmail());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    void testLoginDriverInvalidEmail() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();
        request.setEmail("notfound@example.com");
        request.setPassword("password");

        when(userRepository.findByEmail(anyString())).thenReturn(null);

        ResponseEntity<?> responseEntity = driverLoginController.loginDriver(request);
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        assertEquals("Invalid email or password", responseEntity.getBody());
    }

    @Test
    void testLoginDriverInvalidPassword() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();
        request.setEmail("driver@example.com");
        request.setPassword("wrongpassword");

        User user = new User();
        user.setEmail("driver@example.com");
        user.setPasswordHash("encodedPassword");

        when(userRepository.findByEmail(anyString())).thenReturn(user);
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        ResponseEntity<?> responseEntity = driverLoginController.loginDriver(request);
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        assertEquals("Invalid email or password", responseEntity.getBody());
    }

    @Test
    void testLoginDriverMissingDriver() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();
        request.setEmail("driver@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("driver@example.com");
        user.setPasswordHash("encodedPassword");

        when(userRepository.findByEmail(anyString())).thenReturn(user);
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(driverRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        ResponseEntity<?> responseEntity = driverLoginController.loginDriver(request);
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        assertEquals("Driver not found", responseEntity.getBody());
    }
}
