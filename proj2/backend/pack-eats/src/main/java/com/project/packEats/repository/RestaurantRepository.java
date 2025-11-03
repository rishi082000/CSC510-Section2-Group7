package com.project.packEats.repository;

import com.project.packEats.entity.restaurant.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.packEats.entity.restaurant.RestaurantEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, UUID> {

//    List<Restaurant> findAll();

}
