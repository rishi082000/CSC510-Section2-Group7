package com.project.packEats.entity.restaurant;

import com.project.packEats.entity.menu.MenuItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class RestaurantTest {

    private Restaurant restaurant;
    private MenuItem menuItem;

    @BeforeEach
    void setup() {
        restaurant = new Restaurant();
        restaurant.setId(UUID.randomUUID());
        restaurant.setName("Test Restaurant");
        restaurant.setOwnerId(UUID.randomUUID());
        restaurant.setPhone("1234567890");
        restaurant.setAddress("Test Address");

        menuItem = new MenuItem();
        menuItem.setId(1L);
        menuItem.setName("Burger");
        menuItem.setRestaurant(restaurant);

        restaurant.setMenuItems(List.of(menuItem));
    }

    @Test
    void testGettersSetters() {
        assertEquals("Test Restaurant", restaurant.getName());
        assertEquals("1234567890", restaurant.getPhone());
        assertEquals("Test Address", restaurant.getAddress());
        assertNotNull(restaurant.getOwnerId());

        assertEquals(1, restaurant.getMenuItems().size());
        assertEquals(menuItem, restaurant.getMenuItems().get(0));
    }
}
