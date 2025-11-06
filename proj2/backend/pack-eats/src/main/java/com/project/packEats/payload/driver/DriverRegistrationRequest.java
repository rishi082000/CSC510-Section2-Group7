package com.project.packEats.payload.driver;


public class DriverRegistrationRequest {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String licenseNumber;
    private String vehicleType;
    private boolean ecoEnabled;

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public boolean getEcoEnabled() {
        return ecoEnabled;
    }

    public void setEcoEnabled(boolean ecoEnabled) {
        this.ecoEnabled = ecoEnabled;
    }
}
