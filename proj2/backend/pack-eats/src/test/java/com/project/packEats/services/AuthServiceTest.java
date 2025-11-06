package com.project.packEats.services;

import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private AuthService authService;
    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        authService = new AuthService(userRepository);
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Test
    void registerFailsIfRoleNotStaff() {
        Map<String, Object> result = authService.register("John", "a@b.com", "pass", "admin", "123");
        assertFalse((Boolean) result.get("success"));
        assertEquals("Only restaurant_staff role allowed", result.get("message"));
    }

    @Test
    void registerFailsIfUserExists() {
        when(userRepository.findByEmail("a@b.com")).thenReturn(new User());
        Map<String, Object> result = authService.register("John", "a@b.com", "pass", "restaurant_staff", "123");
        assertFalse((Boolean) result.get("success"));
        assertEquals("User with this email already exists", result.get("message"));
    }

    @Test
    void registerSucceeds() {
        when(userRepository.findByEmail("a@b.com")).thenReturn(null);
        Map<String, Object> result = authService.register("John", "a@b.com", "pass", "restaurant_staff", "123");
        assertTrue((Boolean) result.get("success"));
        assertEquals("User registered successfully", result.get("message"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void loginFailsIfUserNotFound() {
        when(userRepository.findByEmail("a@b.com")).thenReturn(null);
        Map<String, Object> result = authService.login("a@b.com", "pass");
        assertFalse((Boolean) result.get("success"));
        assertEquals("User not found", result.get("message"));
    }

    @Test
    void loginFailsIfRoleNotStaff() {
        User user = new User("John", "a@b.com", passwordEncoder.encode("pass"), "customer");
        when(userRepository.findByEmail("a@b.com")).thenReturn(user);

        Map<String, Object> result = authService.login("a@b.com", "pass");
        assertFalse((Boolean) result.get("success"));
        assertEquals("Not a restaurant account", result.get("message"));
    }

    @Test
    void loginFailsIfPasswordIncorrect() {
        User user = new User("John", "a@b.com", passwordEncoder.encode("pass"), "restaurant_staff");
        when(userRepository.findByEmail("a@b.com")).thenReturn(user);

        Map<String, Object> result = authService.login("a@b.com", "wrong");
        assertFalse((Boolean) result.get("success"));
        assertEquals("Incorrect password", result.get("message"));
    }

    @Test
    void loginSucceeds() {
        User user = new User("John", "a@b.com", passwordEncoder.encode("pass"), "restaurant_staff");
        user.setId(UUID.randomUUID());
        when(userRepository.findByEmail("a@b.com")).thenReturn(user);

        Map<String, Object> result = authService.login("a@b.com", "pass");
        assertTrue((Boolean) result.get("success"));
        assertEquals("Login successful", result.get("message"));
        assertNotNull(result.get("token"));
        assertEquals(user.getId().toString(), result.get("userId"));
    }
}
