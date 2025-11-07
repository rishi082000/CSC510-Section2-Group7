package com.project.packEats.entity.driver;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "driver_info")
public class DriverInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private DriverEntity driver;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "eco_mode")
    private Boolean ecoEnabled;

    @Column(name = "status")
    private String status;

    // Constructors
    public DriverInfoEntity() {
    }

    public DriverInfoEntity(Integer id, DriverEntity driver, String licenseNumber, 
                           String vehicleType, Boolean ecoEnabled, String status) {
        this.id = id;
        this.driver = driver;
        this.licenseNumber = licenseNumber;
        this.vehicleType = vehicleType;
        this.ecoEnabled = ecoEnabled;
        this.status = status;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public DriverEntity getDriver() {
        return driver;
    }

    public void setDriver(DriverEntity driver) {
        this.driver = driver;
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

    public Boolean getEcoEnabled() {
        return ecoEnabled;
    }

    public void setEcoEnabled(Boolean ecoEnabled) {
        this.ecoEnabled = ecoEnabled;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}