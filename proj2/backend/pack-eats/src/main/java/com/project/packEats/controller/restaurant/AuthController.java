package com.project.packEats.controller.restaurant;

import com.project.packEats.payload.restaurant.LoginRequest;
import com.project.packEats.payload.restaurant.RegisterRequest;
import com.project.packEats.services.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth") // matches frontend BASE_URL
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // DTO for login
    public static class LoginRequest {
        public String email;
        public String password;
    }

    // DTO for register
    public static class RegisterRequest {
        public String fullName;
        public String email;
        public String password;
        public String role;
        public String phone;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        return authService.login(request.email, request.password);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request) {
        return authService.register(
                request.fullName,
                request.email,
                request.password,
                request.role,
                request.phone
        );
    }
}
