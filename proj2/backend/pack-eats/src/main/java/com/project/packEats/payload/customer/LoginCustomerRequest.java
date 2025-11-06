package com.project.packEats.payload.customer;

import lombok.Data;

@Data
public class LoginCustomerRequest {
    private String identifier;

    private String password;
}
