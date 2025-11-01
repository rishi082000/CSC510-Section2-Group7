package com.project.packEats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.packEats.entity.restaurant.RestaurantEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Integer> {

    List<RestaurantEntity> findAll();

}
