package com.project.packEats.entity.customer;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Customers_1")
@Data
public class CustomersEntityTest {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "phone")
    private String phone;
}
