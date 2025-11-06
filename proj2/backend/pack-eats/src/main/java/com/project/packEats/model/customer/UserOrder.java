package com.project.packEats.model.customer;

import lombok.Data;

@Data
public class UserOrder {
    private String name;
    private Double price;
    private Integer quantity;
    private Integer menu_item_id;
}
