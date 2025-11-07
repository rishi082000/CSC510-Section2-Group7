package com.project.packEats.controller.driver;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
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

public class DriverControllerTest {

    @InjectMocks
    private DriverController driverController;

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private DriverInfoRepository driverInfoRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDriverRegistration_Success() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();
        request.setFullName("John Doe");
        request.setEmail("driver@example.com");
        request.setPassword("password123");
        request.setPhone("1234567890");
        request.setLicenseNumber("ABC123");
        request.setVehicleType("Bike");
        request.setEcoEnabled(true);

        // Mock userRepository returns null (no existing user)
        when(userRepository.findByEmail(request.getEmail())).thenReturn(null);

        // Mock password encoding
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashedPassword");

        // Mock saving user
        User savedUser = new User();
        UUID userId = UUID.randomUUID();
        savedUser.setId(userId);
        savedUser.setFullName(request.getFullName());
        savedUser.setEmail(request.getEmail());
        savedUser.setPasswordHash("hashedPassword");
        savedUser.setRole("driver");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Mock saving driver
        DriverEntity savedDriver = new DriverEntity();
        savedDriver.setId(userId);
        savedDriver.setFullName(request.getFullName());
        savedDriver.setEmail(request.getEmail());
        savedDriver.setPhone(request.getPhone());
        savedDriver.setPassword("hashedPassword");
        when(driverRepository.save(any(DriverEntity.class))).thenReturn(savedDriver);

        // Mock saving driverInfo
        DriverInfoEntity savedDriverInfo = new DriverInfoEntity();
        savedDriverInfo.setId(1); // Integer ID
        savedDriverInfo.setDriver(savedDriver);
        savedDriverInfo.setLicenseNumber(request.getLicenseNumber());
        savedDriverInfo.setVehicleType(request.getVehicleType());
        savedDriverInfo.setEcoEnabled(request.getEcoEnabled());
        savedDriverInfo.setStatus("pending");
        when(driverInfoRepository.save(any(DriverInfoEntity.class))).thenReturn(savedDriverInfo);

        ResponseEntity<?> responseEntity = driverController.registerDriver(request);

        assertEquals(200, responseEntity.getStatusCodeValue());

        DriverRegistrationResponse response = (DriverRegistrationResponse) responseEntity.getBody();
        assertEquals("John Doe", response.getFullName());
        assertEquals("driver@example.com", response.getEmail());
        assertEquals("1234567890", response.getPhone());
        assertEquals("ABC123", response.getLicenseNumber());
        assertEquals("Bike", response.getVehicleType());
        assertEquals(true, response.getEcoEnabled());
        assertEquals("pending", response.getStatus());
        assertEquals("Driver registered successfully", response.getMessage());

        verify(userRepository, times(1)).save(any(User.class));
        verify(driverRepository, times(1)).save(any(DriverEntity.class));
        verify(driverInfoRepository, times(1)).save(any(DriverInfoEntity.class));
    }

    @Test
    void testDriverRegistration_EmailExists() {
        DriverRegistrationRequest request = new DriverRegistrationRequest();
        request.setEmail("existing@example.com");

        // Mock existing user
        User existingUser = new User();
        when(userRepository.findByEmail(request.getEmail())).thenReturn(existingUser);

        ResponseEntity<?> responseEntity = driverController.registerDriver(request);

        assertEquals(400, responseEntity.getStatusCodeValue());

        DriverRegistrationResponse response = (DriverRegistrationResponse) responseEntity.getBody();
        assertEquals("Email already in use", response.getMessage());

        verify(userRepository, never()).save(any(User.class));
        verify(driverRepository, never()).save(any(DriverEntity.class));
        verify(driverInfoRepository, never()).save(any(DriverInfoEntity.class));
    }
}
