package com.project.packEats.payload.driver;

import java.util.List;
import java.util.UUID;

public class DriverOrderResponse {
    private Long id;
    private UUID restaurantId;
    private String restaurantName;
    private String customerName;
    private String deliveryAddress;
    private List<OrderItemDTO> items;
    private Double totalAmount;
    private String status;
    private String timestamp;

    // Constructors
    public DriverOrderResponse() {}

    public DriverOrderResponse(Long id, UUID restaurantId, String restaurantName, 
                              String customerName, String deliveryAddress, 
                              List<OrderItemDTO> items, Double totalAmount, 
                              String status, String timestamp) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
        this.customerName = customerName;
        this.deliveryAddress = deliveryAddress;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(UUID restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    // Inner class for Order Items
    public static class OrderItemDTO {
        private String name;
        private Integer quantity;
        private Double price;

        // Constructors
        public OrderItemDTO() {}

        public OrderItemDTO(String name, Integer quantity, Double price) {
            this.name = name;
            this.quantity = quantity;
            this.price = price;
        }

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }
    }
}
