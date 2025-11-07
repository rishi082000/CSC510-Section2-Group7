package com.project.packEats.payload.customer;

import lombok.Data;

@Data
public class RegisterCustomerRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
}
