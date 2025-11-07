package com.project.packEats.entity.restaurant;

import java.util.UUID;

import jakarta.annotation.sql.DataSourceDefinition;
import jakarta.persistence.*;
import lombok.Data;
import java.util.*;

@Entity
@Table(name = "restaurants")
@Data
public class RestaurantEntity {

    @Id
    @Column(name = "id")
    UUID id;

    @Column(name = "name")
    String name;

    @Column(name = "owner_id")
    UUID owner_id;

    @Column(name = "address")
    String address;

}
