package com.project.packEats.controller.restaurant;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.packEats.entity.menu.MenuEntity;
import com.project.packEats.entity.restaurant.Restaurant;
import com.project.packEats.repository.MenuRepository;
import com.project.packEats.repository.RestaurantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class RestaurantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MenuRepository menuRepository;

    @MockBean
    private RestaurantRepository restaurantRepository;

    private MenuEntity item1;
    private MenuEntity item2;

    @BeforeEach
    void setUp() {
        item1 = new MenuEntity();
        item1.setId(1);
        item1.setName("Burger");
        item1.setRestaurant_name("TastyPlace");

        item2 = new MenuEntity();
        item2.setId(2);
        item2.setName("Fries");
        item2.setRestaurant_name("OtherPlace");
    }

    @Test
    void whenGetMenuWithEmptyName_thenReturnsAll() throws Exception {
        List<MenuEntity> all = List.of(item1, item2);
        when(menuRepository.findAll()).thenReturn(all);

        mockMvc.perform(get("/api/restaurants/menu").param("restaurantName", "")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Burger")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Fries")));
    }

    @Test
    void whenGetMenuForSpecificRestaurant_thenFilters() throws Exception {
        List<MenuEntity> all = List.of(item1, item2);
        when(menuRepository.findAll()).thenReturn(all);

        mockMvc.perform(get("/api/restaurants/menu").param("restaurantName", "TastyPlace")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Burger")))
                .andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("Fries"))));
    }

    @Test
    void whenGetAllRestaurants_thenReturnsList() throws Exception {
        Restaurant r = new Restaurant();
        UUID id = UUID.randomUUID();
        r.setId(id);
        r.setName("TastyPlace");

        List<Restaurant> restaurants = new ArrayList<>();
        restaurants.add(r);

        when(restaurantRepository.findAll()).thenReturn(restaurants);

        mockMvc.perform(get("/api/restaurants").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("TastyPlace")));
    }
}
