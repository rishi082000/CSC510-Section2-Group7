package com.project.packEats.entity.order;

import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.Type;

import com.project.packEats.model.customer.UserOrder;
import com.vladmihalcea.hibernate.type.json.JsonType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "orders")
@Data
public class OrderEntity {
    @Id
    @Column(name = "id")
    Integer id;

    @Column(name = "customer_id")
    UUID customer_id;

    @Column(name = "restaurant_id")
    UUID restaurant_id;

    @Column(name = "total_amount")
    Double total_amount;

    @Column(name = "items", columnDefinition = "jsonb")
    @Type(JsonType.class)
    private List<UserOrder> items;

    @Column(name = "status")
    String status;

    @Column(name = "menu_item_id")
    Integer menu_item_id;

}
