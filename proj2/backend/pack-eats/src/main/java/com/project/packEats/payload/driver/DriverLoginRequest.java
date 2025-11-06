package com.project.packEats.payload.driver;

import lombok.Data;

@Data
public class DriverLoginRequest {
    private String email;
    private String password;
}
