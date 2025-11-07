package com.project.packEats.entity.menu;

import java.util.UUID;

import jakarta.annotation.sql.DataSourceDefinition;
import jakarta.persistence.*;
import lombok.Data;
import java.util.*;

@Entity
@Table(name = "menu_items")
@Data
public class MenuEntity {

    @Id
    @Column(name = "id")
    Integer id;

    @Column(name = "restaurant_id")
    UUID restaurant_id;

    @Column(name = "name")
    String name;

    @Column(name = "description")
    String description;

    @Column(name = "price")
    Double price;

    @Column(name = "category")
    String category;

    @Column(name = "available")
    Boolean available;

    @Column(name = "stock")
    Integer stock;

    @Column(name = "recommendation_tags")
    List<String> recommendation_tags;

    @Column(name = "restaurant_name")
    String restaurant_name;

    @Column(name = "food_type")
    String food_type;

}
