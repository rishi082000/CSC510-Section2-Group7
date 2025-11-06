package com.project.packEats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.packEats.entity.order.OrderEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderCustomerRepository extends JpaRepository<OrderEntity, Integer> {

    List<OrderEntity> findAll();

}
