package com.project.packEats.services;

import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Map<String, Object> register(String fullName, String email, String password, String role, String phone) {
        Map<String, Object> response = new HashMap<>();

        if (!"restaurant_staff".equals(role)) {
            response.put("success", false);
            response.put("message", "Only restaurant_staff role allowed");
            return response;
        }

        if (userRepository.findByEmail(email) != null) {
            response.put("success", false);
            response.put("message", "User with this email already exists");
            return response;
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(fullName, email, hashedPassword, role);
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "User registered successfully");
        return response;
    }

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        if (!"restaurant_staff".equals(user.getRole())) {
            response.put("success", false);
            response.put("message", "Not a restaurant account");
            return response;
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            response.put("success", false);
            response.put("message", "Incorrect password");
            return response;
        }

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", "dummy-jwt-token");
        response.put("userId", user.getId().toString());

        return response;
    }
}
