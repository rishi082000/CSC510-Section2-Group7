package com.project.packEats.payload.driver;

import java.util.UUID;

public class DriverRegistrationResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String licenseNumber;
    private String vehicleType;
    private Boolean ecoEnabled;
    private String status;
    private String message;

    // ✅ Constructor that matches your controller call
    public DriverRegistrationResponse(UUID id, String fullName, String email, String phone,
                                      String licenseNumber, String vehicleType,
                                      Boolean ecoEnabled, String status, String message) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
        this.vehicleType = vehicleType;
        this.ecoEnabled = ecoEnabled;
        this.status = status;
        this.message = message;
    }

    // ✅ Default constructor (required by Spring/Jackson)
    public DriverRegistrationResponse() {}

    // ✅ Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public Boolean getEcoEnabled() { return ecoEnabled; }
    public void setEcoEnabled(Boolean ecoEnabled) { this.ecoEnabled = ecoEnabled; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
