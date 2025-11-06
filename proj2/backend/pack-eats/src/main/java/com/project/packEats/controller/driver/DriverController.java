package com.project.packEats.controller.driver;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.packEats.entity.driver.DriverEntity;
import com.project.packEats.entity.driver.DriverInfoEntity;
import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.payload.driver.DriverRegistrationRequest;
import com.project.packEats.payload.driver.DriverRegistrationResponse;
import com.project.packEats.repository.DriverInfoRepository;
import com.project.packEats.repository.DriverRepository;
import com.project.packEats.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/drivers")
public class DriverController {

    private static final Logger logger = LoggerFactory.getLogger(DriverController.class);

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DriverInfoRepository driverInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //  Test endpoint
    @GetMapping("api/drivers/test")
    public String testDriverEndpoint() {
        return "Driver endpoint accessible!";
    }

    //  Register a new driver
  @PostMapping("/register")
public ResponseEntity<?> registerDriver(@RequestBody DriverRegistrationRequest request) {
    try {
        // 1️⃣ Check if a user with the same email already exists
        List<User> existingUsers = userRepository.findAll(); // or use findByEmail if available
        boolean emailExists = existingUsers.stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(request.getEmail()));

        if (emailExists) {
            DriverRegistrationResponse errorResponse = new DriverRegistrationResponse(
                    null, null, null, null, null, null, null, null,
                    "Email already in use"
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // 2️⃣ Create a new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("DRIVER");
        userRepository.save(user);

        // 3️⃣ Create driver entity
        DriverEntity driver = new DriverEntity();
        driver.setFullName(request.getFullName());
        driver.setEmail(request.getEmail());
        driver.setPhone(request.getPhone());
        driver.setPassword(user.getPasswordHash());
        DriverEntity savedDriver = driverRepository.save(driver);

        // 4️⃣ Create driver info
        DriverInfoEntity driverInfo = new DriverInfoEntity();
        driverInfo.setDriver(savedDriver);
        driverInfo.setLicenseNumber(request.getLicenseNumber());
        driverInfo.setVehicleType(request.getVehicleType());
        driverInfo.setEcoEnabled(request.getEcoEnabled());
        driverInfo.setStatus("pending");
        driverInfoRepository.save(driverInfo);

        // 5️⃣ Build response
        DriverRegistrationResponse response = new DriverRegistrationResponse(
                savedDriver.getId(),
                savedDriver.getFullName(),
                savedDriver.getEmail(),
                savedDriver.getPhone(),
                driverInfo.getLicenseNumber(),
                driverInfo.getVehicleType(),
                driverInfo.getEcoEnabled(),
                driverInfo.getStatus(),
                "Driver registered successfully"
        );

        logger.info("✅ Driver registered successfully: {}", driver.getFullName());
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        logger.error("❌ Driver registration failed: {}", e.getMessage(), e);
        DriverRegistrationResponse errorResponse = new DriverRegistrationResponse(
                null, null, null, null, null, null, null, null,
                "Error during registration: " + e.getMessage()
        );
        return ResponseEntity.internalServerError().body(errorResponse);
    }
}


}
