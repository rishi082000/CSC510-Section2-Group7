package com.project.packEats.entity.menu;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.project.packEats.entity.restaurant.Restaurant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MenuItemTest {

    private MenuItem menuItem;
    private Restaurant restaurant;

    @BeforeEach
    void setup() {
        restaurant = new Restaurant();
        restaurant.setId(java.util.UUID.randomUUID());
        restaurant.setName("Test Restaurant");

        menuItem = new MenuItem();
        menuItem.setId(1L);
        menuItem.setName("Burger");
        menuItem.setDescription("Tasty burger");
        menuItem.setPrice(9.99);
        menuItem.setCategory("Fast Food");
        menuItem.setAvailable(true);
        menuItem.setStock(50);
        menuItem.setRecommendationTags(List.of("Popular", "Combo"));
        menuItem.setRestaurant(restaurant);
    }

    @Test
    void testGettersAndSetters() {
        assertEquals("Burger", menuItem.getName());
        assertEquals("Tasty burger", menuItem.getDescription());
        assertEquals(9.99, menuItem.getPrice());
        assertTrue(menuItem.isAvailable());
        assertEquals(50, menuItem.getStock());
        assertEquals("Fast Food", menuItem.getCategory());
        assertEquals(List.of("Popular", "Combo"), menuItem.getRecommendationTags());
        assertEquals(restaurant, menuItem.getRestaurant());
    }

    @Test
    void testLifecycleCallbacks() {
        menuItem.onCreate();
        assertNotNull(menuItem.getCreatedAt());
        assertNotNull(menuItem.getUpdatedAt());

        LocalDateTime oldUpdated = menuItem.getUpdatedAt();
        menuItem.onUpdate();
        assertTrue(menuItem.getUpdatedAt().isAfter(oldUpdated) || menuItem.getUpdatedAt().isEqual(oldUpdated));
    }

    @Test
    void testJsonSerialization() throws Exception {
        menuItem.onCreate();
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        String json = mapper.writeValueAsString(menuItem);
        assertTrue(json.contains("Burger"));
        assertTrue(json.contains("Tasty burger"));
    }
}
