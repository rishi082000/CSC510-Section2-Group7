package com.project.packEats.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.packEats.entity.driver.DriverEntity;
import com.project.packEats.entity.driver.DriverInfoEntity;

public interface DriverInfoRepository extends JpaRepository<DriverInfoEntity, UUID> {

    // Add this method to find DriverInfo by DriverEntity
    DriverInfoEntity findByDriver(DriverEntity driver);
}
