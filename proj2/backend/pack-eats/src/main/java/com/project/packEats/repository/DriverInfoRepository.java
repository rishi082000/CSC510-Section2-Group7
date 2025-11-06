package com.project.packEats.repository;

import com.project.packEats.entity.driver.DriverInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverInfoRepository extends JpaRepository<DriverInfoEntity, Integer> {
}
