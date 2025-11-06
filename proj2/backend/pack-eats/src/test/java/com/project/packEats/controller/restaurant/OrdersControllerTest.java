package com.project.packEats.controller.restaurant;

import com.project.packEats.entity.menu.MenuItem;
import com.project.packEats.entity.order.Order;
import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.repository.OrderRepository;
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

import com.fasterxml.jackson.databind.ObjectMapper;

class OrdersControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrdersController ordersController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private UUID userId = UUID.randomUUID();
    private UUID restaurantId = UUID.randomUUID();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(ordersController).build();
    }

    @Test
    void testGetOrdersSuccess() throws Exception {
        User user = new User();
        user.setRole("restaurant_staff");
        user.setRestaurantId(restaurantId);

        MenuItem menuItem = new MenuItem();
        menuItem.setName("Burger");

        Order order = new Order();
        order.setId(1L);
        order.setMenuItem(menuItem);
        order.setQuantity(2);
        order.setTimestamp(LocalDateTime.now()); // FIXED
        order.setStatus("PLACED");
        order.setRestaurantId(restaurantId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(orderRepository.findByRestaurantAndStatuses(restaurantId, List.of("PLACED", "ACCEPTED", "PREPARING")))
                .thenReturn(List.of(order));

        mockMvc.perform(get("/api/orders").param("userId", userId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].items[0].name").value("Burger"));
    }

    @Test
    void testUpdateOrderStatus() throws Exception {
        Order order = new Order();
        order.setId(1L);
        order.setMenuItem(new MenuItem());
        order.setQuantity(1);
        order.setTimestamp(LocalDateTime.now()); // FIXED
        order.setStatus("PLACED");

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrdersController.StatusRequest request = new OrdersController.StatusRequest();
        request.setStatus("ACCEPTED");

        mockMvc.perform(put("/api/orders/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
    }
}
