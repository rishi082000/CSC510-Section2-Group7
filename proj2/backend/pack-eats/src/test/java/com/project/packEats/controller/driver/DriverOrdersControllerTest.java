package com.project.packEats.controller.driver;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.project.packEats.entity.menu.MenuItem;
import com.project.packEats.entity.order.Order;
import com.project.packEats.entity.restaurant.Restaurant;
import com.project.packEats.payload.driver.DriverOrderResponse;
import com.project.packEats.repository.OrderRepository;
import com.project.packEats.repository.RestaurantRepository;

public class DriverOrdersControllerTest {

    @InjectMocks
    private DriverOrdersController controller;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAvailableOrders() {
        // Prepare a restaurant
        UUID restaurantId = UUID.randomUUID();
        Restaurant restaurant = new Restaurant();
        restaurant.setId(restaurantId);
        restaurant.setName("Test Restaurant");
        restaurant.setAddress("123 Main St");

        // Prepare a menu item
        MenuItem item = new MenuItem();
        item.setName("Pizza");
        item.setPrice(15.0);

        // Prepare an order with READY status
        Order order = new Order();
        order.setId(1L);
        order.setRestaurantId(restaurantId);
        order.setStatus("READY");
        order.setTimestamp(LocalDateTime.now());
        order.setMenuItem(item);
        order.setQuantity(2);

        when(orderRepository.findAll()).thenReturn(List.of(order));
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));

        ResponseEntity<?> response = controller.getAvailableOrders();

        assertNotNull(response);
        List<DriverOrderResponse> orders = (List<DriverOrderResponse>) response.getBody();
        assertEquals(1, orders.size());
        assertEquals("READY", orders.get(0).getStatus());
        assertEquals("Test Restaurant", orders.get(0).getRestaurantName());
    }

    @Test
    public void testAcceptOrderSuccessfully() {
        Long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setStatus("READY");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        DriverOrdersController.AcceptOrderRequest request = new DriverOrdersController.AcceptOrderRequest();
        request.setDriverId(UUID.randomUUID());

        ResponseEntity<?> response = controller.acceptOrder(orderId, request);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("COMPLETED", order.getStatus());
    }

    @Test
    public void testAcceptOrderNotReady() {
        Long orderId = 2L;
        Order order = new Order();
        order.setId(orderId);
        order.setStatus("PENDING"); // Not READY

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        DriverOrdersController.AcceptOrderRequest request = new DriverOrdersController.AcceptOrderRequest();
        request.setDriverId(UUID.randomUUID());

        ResponseEntity<?> response = controller.acceptOrder(orderId, request);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Order is not available for pickup", response.getBody());
    }

    @Test
    public void testAcceptOrderNotFound() {
        Long orderId = 3L;

        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        DriverOrdersController.AcceptOrderRequest request = new DriverOrdersController.AcceptOrderRequest();
        request.setDriverId(UUID.randomUUID());

        ResponseEntity<?> response = controller.acceptOrder(orderId, request);
        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Order not found"));
    }
}
