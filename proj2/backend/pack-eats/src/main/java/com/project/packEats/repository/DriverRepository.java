package com.project.packEats.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.packEats.entity.driver.DriverEntity;

@Repository
public interface DriverRepository extends JpaRepository<DriverEntity, UUID> {
    Optional<DriverEntity> findByEmail(String email);
}
