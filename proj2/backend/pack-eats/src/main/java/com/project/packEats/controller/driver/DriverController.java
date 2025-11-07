package com.project.packEats.controller.driver;

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
@RequestMapping("api/drivers")
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

    // Test endpoint
    @GetMapping("/test")
    public String testDriverEndpoint() {
        return "Driver endpoint accessible!";
    }

    // Register a new driver
    @PostMapping("/register")
    public ResponseEntity<?> registerDriver(@RequestBody DriverRegistrationRequest request) {
        try {
            logger.info("🔹 Starting driver registration for email: {}", request.getEmail());

            // 1️⃣ Check if user with same email exists
            User existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser != null) {
                logger.warn("⚠️ Email already exists: {}", request.getEmail());
                DriverRegistrationResponse errorResponse = new DriverRegistrationResponse(
                        null, null, null, null, null, null, null, null,
                        "Email already in use"
                );
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // 2️⃣ Create a new User
            User user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setRole("driver");
            User savedUser = userRepository.save(user);
            logger.info("✅ User saved with ID: {}", savedUser.getId());

            // 3️⃣ Create DriverEntity
            DriverEntity driver = new DriverEntity();
            driver.setId(savedUser.getId());
            driver.setFullName(request.getFullName());
            driver.setEmail(request.getEmail());
            driver.setPhone(request.getPhone());
            driver.setPassword(user.getPasswordHash());
            
            logger.info("🔹 Attempting to save driver entity...");
            logger.info("🔹 Driver data - Name: {}, Email: {}, Phone: {}, ID: {}", 
                driver.getFullName(), driver.getEmail(), driver.getPhone(), driver.getId());
            
            DriverEntity savedDriver = driverRepository.save(driver);
            logger.info("✅ Driver saved with ID: {}", savedDriver.getId());

            // 4️⃣ Create DriverInfoEntity
            DriverInfoEntity driverInfo = new DriverInfoEntity();
            driverInfo.setDriver(savedDriver);
            driverInfo.setLicenseNumber(request.getLicenseNumber());
            driverInfo.setVehicleType(request.getVehicleType());
            driverInfo.setEcoEnabled(request.getEcoEnabled());
            driverInfo.setStatus("pending");
            
            logger.info("🔹 Attempting to save driver info...");
            DriverInfoEntity savedDriverInfo = driverInfoRepository.save(driverInfo);
            logger.info("✅ Driver info saved with ID: {}", savedDriverInfo.getId());

            // 5️⃣ Build response
            DriverRegistrationResponse response = new DriverRegistrationResponse(
                    savedDriver.getId(),
                    savedDriver.getFullName(),
                    savedDriver.getEmail(),
                    savedDriver.getPhone(),
                    savedDriverInfo.getLicenseNumber(),
                    savedDriverInfo.getVehicleType(),
                    savedDriverInfo.getEcoEnabled(),
                    savedDriverInfo.getStatus(),
                    "Driver registered successfully"
            );

            logger.info("✅ Driver registration completed successfully: {}", savedDriver.getFullName());
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