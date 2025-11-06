package com.project.packEats.entity.order;

import com.project.packEats.entity.menu.MenuItem;
import com.project.packEats.entity.restaurantUser.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private MenuItem menuItem;

    private int quantity;

    private LocalDateTime timestamp;

    @Column(name = "restaurant_id", nullable = false)
    private UUID restaurantId;

    @Column(nullable = false)
    private String status; // "PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED"

    public Order() {
    }

    public Order(User user, MenuItem menuItem, int quantity, LocalDateTime timestamp, String status) {
        this.user = user;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.timestamp = timestamp;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(UUID restaurantId) {
        this.restaurantId = restaurantId;
    }

    // Helper method to check if order is visible to restaurant
    public boolean isVisible() {
        return status.equals("PLACED") || status.equals("ACCEPTED") || status.equals("PREPARING");
    }
}
