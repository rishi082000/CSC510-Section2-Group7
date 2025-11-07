package com.project.packEats.entity.restaurantUser;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private User user;
    private UUID restaurantId;

    @BeforeEach
    void setup() {
        restaurantId = UUID.randomUUID();
        user = new User();
        user.setId(UUID.randomUUID());
        user.setFullName("John Doe");
        user.setEmail("john@example.com");
        user.setPasswordHash("hashedPass");
        user.setRole("restaurant_staff");
        user.setRestaurantId(restaurantId);
    }

    @Test
    void testGettersSetters() {
        assertEquals("John Doe", user.getFullName());
        assertEquals("john@example.com", user.getEmail());
        assertEquals("hashedPass", user.getPasswordHash());
        assertEquals("restaurant_staff", user.getRole());
        assertEquals(restaurantId, user.getRestaurantId());
    }
}
