package com.project.packEats.controller.driver;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.packEats.entity.order.Order;
import com.project.packEats.entity.restaurant.Restaurant;
import com.project.packEats.payload.driver.DriverOrderResponse;
import com.project.packEats.repository.OrderRepository;
import com.project.packEats.repository.RestaurantRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("api/driver/orders")
public class DriverOrdersController {

    private static final Logger logger = LoggerFactory.getLogger(DriverOrdersController.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    /**
     * Get all available orders (status = READY for driver pickup)
     */
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableOrders() {
        try {
            logger.info("📦 Fetching available orders for drivers");
            
            // Fetch all orders with status READY (ready for driver pickup)
            List<Order> allOrders = orderRepository.findAll();
            
            List<Order> readyOrders = allOrders.stream()
                .filter(order -> "READY".equals(order.getStatus()))
                .collect(Collectors.toList());
            
            logger.info("🔍 Found {} orders with READY status", readyOrders.size());
            
            // Convert to response DTOs
            List<DriverOrderResponse> response = new ArrayList<>();
            for (Order order : readyOrders) {
                try {
                    DriverOrderResponse dto = convertToDriverOrderResponse(order);
                    response.add(dto);
                } catch (Exception e) {
                    logger.error("❌ Error converting order {}: {}", order.getId(), e.getMessage());
                }
            }
            
            logger.info("✅ Returning {} available orders to driver", response.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error fetching available orders: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching orders: " + e.getMessage());
        }
    }

    /**
     * Accept an order
     */
    @PostMapping("/{orderId}/accept")
    public ResponseEntity<?> acceptOrder(
            @PathVariable Long orderId,
            @RequestBody AcceptOrderRequest request) {
        try {
            logger.info("📦 Driver {} accepting order: {}", request.getDriverId(), orderId);
            
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
            
            if (!"READY".equals(order.getStatus())) {
                logger.warn("⚠️ Order {} is not in READY status, current status: {}", orderId, order.getStatus());
                return ResponseEntity.badRequest()
                    .body("Order is not available for pickup");
            }
            
            // Update order status to OUT_FOR_DELIVERY or COMPLETED
            order.setStatus("COMPLETED");
            orderRepository.save(order);
            
            logger.info("✅ Order {} accepted and marked as COMPLETED by driver {}", orderId, request.getDriverId());
            return ResponseEntity.ok("Order accepted successfully");
            
        } catch (Exception e) {
            logger.error("❌ Error accepting order: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error accepting order: " + e.getMessage());
        }
    }

    /**
     * Convert Order entity to DriverOrderResponse DTO
     */
    private DriverOrderResponse convertToDriverOrderResponse(Order order) {
        DriverOrderResponse response = new DriverOrderResponse();
        response.setId(order.getId());
        response.setRestaurantId(order.getRestaurantId());
        response.setStatus(order.getStatus());
        response.setTimestamp(order.getTimestamp().toString());
        
        // Get restaurant name from restaurant table
        String restaurantName = "Unknown Restaurant";
        try {
            if (order.getRestaurantId() != null) {
                Restaurant restaurant = restaurantRepository.findById(order.getRestaurantId())
                    .orElse(null);
                if (restaurant != null) {
                    restaurantName = restaurant.getName();
                    response.setDeliveryAddress(restaurant.getAddress());
                }
            }
        } catch (Exception e) {
            logger.error("❌ Error fetching restaurant for order {}: {}", order.getId(), e.getMessage());
        }
        response.setRestaurantName(restaurantName);
        
        // Get customer name from User entity if available
        String customerName = "Customer";
        if (order.getUser() != null) {
            customerName = order.getUser().getFullName();
        }
        response.setCustomerName(customerName);
        
        // Set item details
        if (order.getMenuItem() != null) {
            DriverOrderResponse.OrderItemDTO item = new DriverOrderResponse.OrderItemDTO();
            item.setName(order.getMenuItem().getName());
            item.setQuantity(order.getQuantity());
            item.setPrice(order.getMenuItem().getPrice());
            response.setItems(List.of(item));
            
            // Calculate total amount
            response.setTotalAmount(order.getMenuItem().getPrice() * order.getQuantity());
        } else {
            response.setItems(new ArrayList<>());
            response.setTotalAmount(0.0);
        }
        
        // Use restaurant address as delivery address if not set
        if (response.getDeliveryAddress() == null) {
            response.setDeliveryAddress("Delivery Address Not Available");
        }
        
        return response;
    }

    /**
     * Request DTO for accepting orders
     */
    public static class AcceptOrderRequest {
        private UUID driverId;

        public UUID getDriverId() {
            return driverId;
        }

        public void setDriverId(UUID driverId) {
            this.driverId = driverId;
        }
    }
}
