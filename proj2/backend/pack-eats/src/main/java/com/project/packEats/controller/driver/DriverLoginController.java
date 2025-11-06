package com.project.packEats.controller.driver;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
public class DriverLoginController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverInfoRepository driverInfoRepository;

    private static final Logger logger = LoggerFactory.getLogger(DriverLoginController.class);

    @PostMapping("/api/drivers/login")
    public ResponseEntity<?> loginDriver(@RequestBody DriverRegistrationRequest request) {
        try {
            // 1️⃣ Find user by email
            User user = userRepository.findByEmail(request.getEmail());
            if (user == null || !user.getPasswordHash().equals(request.getPassword())) {
                return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
            }

            // 2️⃣ Fetch driver entity
            Optional<DriverEntity> driverOpt = driverRepository.findByEmail(request.getEmail());
            if (driverOpt.isEmpty()) {
                return new ResponseEntity<>("Driver not found", HttpStatus.NOT_FOUND);
            }
            DriverEntity driver = driverOpt.get(); // unwrap Optional

            // 3️⃣ Fetch driver info manually (no findByDriver method)
            Optional<DriverInfoEntity> driverInfoOpt = driverInfoRepository.findAll()
                    .stream()
                    .filter(info -> info.getDriver().getId().equals(driver.getId()))
                    .findFirst();
            DriverInfoEntity driverInfo = driverInfoOpt.orElse(null);

            // 4️⃣ Build response
            DriverRegistrationResponse response = new DriverRegistrationResponse(
                    driver.getId(),
                    driver.getFullName(),
                    driver.getEmail(),
                    driver.getPhone(),
                    driverInfo != null ? driverInfo.getLicenseNumber() : null,
                    driverInfo != null ? driverInfo.getVehicleType() : null,
                    driverInfo != null ? driverInfo.getEcoEnabled() : null,
                    driverInfo != null ? driverInfo.getStatus() : null,
                    "Login successful"
            );

            logger.info("Driver logged in: {}", driver.getFullName());
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("Driver login failed: {}", e.getMessage(), e);
            return new ResponseEntity<>("Server error during login", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
