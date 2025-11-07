package com.project.packEats.controller.restaurant;

import com.project.packEats.entity.restaurant.Restaurant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.packEats.entity.menu.MenuEntity;
import com.project.packEats.entity.restaurant.RestaurantEntity;
import com.project.packEats.repository.MenuRepository;
import com.project.packEats.repository.RestaurantRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {

    Logger logger = LoggerFactory.getLogger(RestaurantController.class);

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    // ✅ Get menu items for a restaurant (existing)
    @GetMapping("api/restaurants/menu")
    public ResponseEntity<List<MenuEntity>> getMenuItems(@RequestParam String restaurantName) {
        List<MenuEntity> allMenuItems = menuRepository.findAll();

        if (restaurantName.isEmpty()) {
            logger.info("Returning all the menu items");
            return new ResponseEntity<>(allMenuItems, HttpStatusCode.valueOf(200));
        }

        List<MenuEntity> restaurantMenuItems = allMenuItems.stream()
                .filter(item -> item.getRestaurant_name() != null &&
                        item.getRestaurant_name().equalsIgnoreCase(restaurantName))
                .collect(Collectors.toList());

        logger.info("Returning menu items for restaurant: {}", restaurantName);
        return new ResponseEntity<>(restaurantMenuItems, HttpStatusCode.valueOf(200));
    }

    // ✅ Get all restaurants (new)
    @GetMapping("api/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        logger.info("Returning all restaurants");
        return new ResponseEntity<>(restaurants, HttpStatusCode.valueOf(200));
    }
}
