package com.project.packEats.repository;

import com.project.packEats.entity.customer.CustomersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomersRepository extends JpaRepository<CustomersEntity, Integer>{
}
