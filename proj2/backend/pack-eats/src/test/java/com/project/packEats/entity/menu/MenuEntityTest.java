package com.project.packEats.entity.menu;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class MenuEntityTest {

    @Test
    void testGettersAndSetters() {
        MenuEntity m = new MenuEntity();
        m.setId(10);
        UUID rid = UUID.randomUUID();
        m.setRestaurant_id(rid);
        m.setName("Pasta");
        m.setDescription("Delicious pasta");
        m.setPrice(9.99);
        m.setCategory("Main");
        m.setAvailable(true);
        m.setStock(5);

        List<String> tags = new ArrayList<>();
        tags.add("vegan");
        m.setRecommendation_tags(tags);

        m.setRestaurant_name("Italiano");
        m.setFood_type("Veg");

        assertEquals(10, m.getId());
        assertEquals(rid, m.getRestaurant_id());
        assertEquals("Pasta", m.getName());
        assertEquals("Delicious pasta", m.getDescription());
        assertEquals(9.99, m.getPrice());
        assertEquals("Main", m.getCategory());
        assertTrue(m.getAvailable());
        assertEquals(5, m.getStock());
        assertEquals(tags, m.getRecommendation_tags());
        assertEquals("Italiano", m.getRestaurant_name());
        assertEquals("Veg", m.getFood_type());
    }
}
