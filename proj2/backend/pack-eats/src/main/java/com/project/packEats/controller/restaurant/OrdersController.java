package com.project.packEats.controller.restaurant;

import com.project.packEats.entity.order.Order;
import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.repository.OrderRepository;
import com.project.packEats.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrdersController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrdersController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // ✅ Get all orders for restaurant linked to this staff user
    @GetMapping
    public List<OrderResponse> getOrders(@RequestParam UUID userId) {
        // find the staff user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!"restaurant_staff".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only restaurant staff can access orders");
        }

        UUID restaurantId = user.getRestaurantId();
        if (restaurantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No restaurant assigned to this staff");
        }

        // fetch only visible orders for that restaurant
        List<String> visibleStatuses = List.of("PLACED", "ACCEPTED", "PREPARING");
        List<Order> orders = orderRepository.findByRestaurantAndStatuses(restaurantId, visibleStatuses);

        // build the response — no userId taken from order
        return orders.stream().map(order -> {
            OrderItemResponse item = new OrderItemResponse(
                    order.getMenuItem().getName(),
                    order.getQuantity());

            return new OrderResponse(
                    order.getId(),
                    List.of(item),
                    order.getTimestamp().toString(),
                    order.getStatus(),
                    order.getRestaurantId());
        }).toList();
    }

    // ✅ Update order status
    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        switch (request.getStatus().toUpperCase()) {
            case "PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED" ->
                order.setStatus(request.getStatus().toUpperCase());
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }

        Order updatedOrder = orderRepository.save(order);

        OrderItemResponse item = new OrderItemResponse(
                updatedOrder.getMenuItem().getName(),
                updatedOrder.getQuantity());

        return new OrderResponse(
                updatedOrder.getId(),
                List.of(item),
                updatedOrder.getTimestamp().toString(),
                updatedOrder.getStatus(),
                updatedOrder.getRestaurantId());
    }

    // Request classes
    public static class StatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // Response classes
    public static class OrderItemResponse {
        private String name;
        private int quantity;

        public OrderItemResponse(String name, int quantity) {
            this.name = name;
            this.quantity = quantity;
        }

        public String getName() {
            return name;
        }

        public int getQuantity() {
            return quantity;
        }
    }

    public static class OrderResponse {
        private Long id;
        private List<OrderItemResponse> items;
        private String timestamp;
        private String status;
        private UUID restaurantId;

        public OrderResponse(Long id, List<OrderItemResponse> items, String timestamp,
                String status, UUID restaurantId) {
            this.id = id;
            this.items = items;
            this.timestamp = timestamp;
            this.status = status;
            this.restaurantId = restaurantId;
        }

        public Long getId() {
            return id;
        }

        public List<OrderItemResponse> getItems() {
            return items;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public String getStatus() {
            return status;
        }

        public UUID getRestaurantId() {
            return restaurantId;
        }
    }
}
