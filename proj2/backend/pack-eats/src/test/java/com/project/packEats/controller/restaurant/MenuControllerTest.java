package com.project.packEats.controller.restaurant;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.project.packEats.entity.menu.MenuItem;
import com.project.packEats.entity.restaurant.Restaurant;
import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.repository.MenuItemRepository;
import com.project.packEats.repository.RestaurantRepository;
import com.project.packEats.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class MenuControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @InjectMocks
    private MenuController menuController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private UUID userId = UUID.randomUUID();
    private UUID restaurantId = UUID.randomUUID();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(menuController).build();
        objectMapper.registerModule(new JavaTimeModule()); // handle LocalDateTime
    }

    @Test
    void testGetMenuSuccess() throws Exception {
        User user = new User();
        user.setRole("restaurant_staff");
        user.setRestaurantId(restaurantId);

        MenuItem menuItem = new MenuItem();
        menuItem.setName("Burger");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(new Restaurant()));
        when(menuItemRepository.findByRestaurantId(restaurantId))
                .thenReturn(List.of(menuItem));

        mockMvc.perform(get("/api/menu").param("userId", userId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Burger"));

        verify(menuItemRepository, atLeastOnce()).findByRestaurantId(restaurantId); // allow multiple calls
    }

    @Test
    void testAddMenuItemSuccess() throws Exception {
        User user = new User();
        user.setRole("restaurant_staff");
        user.setRestaurantId(restaurantId);
        Restaurant restaurant = new Restaurant();

        MenuItem item = new MenuItem();
        item.setName("Pizza");
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));
        when(menuItemRepository.save(any(MenuItem.class))).thenReturn(item);

        mockMvc.perform(post("/api/menu")
                        .param("userId", userId.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Pizza"));
    }
}
