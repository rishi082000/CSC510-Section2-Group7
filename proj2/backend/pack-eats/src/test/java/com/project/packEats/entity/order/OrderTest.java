package com.project.packEats.entity.order;

import com.project.packEats.entity.menu.MenuItem;
import com.project.packEats.entity.restaurant.Restaurant;
import com.project.packEats.entity.restaurantUser.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class OrderTest {

    private Order order;
    private MenuItem menuItem;
    private User user;
    private Restaurant restaurant;

    @BeforeEach
    void setup() {
        restaurant = new Restaurant();
        restaurant.setId(UUID.randomUUID());
        restaurant.setName("Test Restaurant");

        menuItem = new MenuItem();
        menuItem.setId(1L);
        menuItem.setName("Burger");
        menuItem.setRestaurant(restaurant);

        user = new User();
        user.setId(UUID.randomUUID());
        user.setFullName("John Doe");
        user.setRestaurantId(restaurant.getId());

        order = new Order(user, menuItem, 2, LocalDateTime.now(), "PLACED");
        order.setId(100L);
        order.setRestaurantId(restaurant.getId());
    }

    @Test
    void testGettersSetters() {
        assertEquals(user, order.getUser());
        assertEquals(menuItem, order.getMenuItem());
        assertEquals(2, order.getQuantity());
        assertEquals("PLACED", order.getStatus());
        assertEquals(restaurant.getId(), order.getRestaurantId());
    }

    @Test
    void testIsVisible() {
        assertTrue(order.isVisible());
        order.setStatus("READY");
        assertFalse(order.isVisible());
    }
}
