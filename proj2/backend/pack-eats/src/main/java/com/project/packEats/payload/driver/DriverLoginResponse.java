package com.project.packEats.payload.driver;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverLoginResponse {
    private String status;
    private String message;
    private String fullName;
    private String email;

    // Convenience constructor for error/success without full data
    public DriverLoginResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }
}
