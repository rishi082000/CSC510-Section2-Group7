package com.project.packEats.payload.customer;

import lombok.Data;

@Data
public class RegisterCustomerResponse {
    private String message;
    private boolean success;
    private Object data;

    public RegisterCustomerResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
