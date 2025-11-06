package com.project.packEats.controller.restaurant;

import com.project.packEats.entity.order.OrderEntity;
import com.project.packEats.repository.OrderCustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderCustomerRepository orderRepository;

    // ✅ POST endpoint to place an order
    @PostMapping("/place")
    public ResponseEntity<OrderEntity> placeOrder(@RequestBody OrderEntity order) {
        logger.info("Placing order for customer: {}", order.getCustomer_id());

        OrderEntity savedOrder = orderRepository.save(order);

        logger.info("Order placed successfully with ID: {}", savedOrder.getId());
        return ResponseEntity.ok(savedOrder);
    }
}
