package com.project.packEats.controller.restaurant;

import com.project.packEats.services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void testLoginSuccess() throws Exception {
        AuthController.LoginRequest request = new AuthController.LoginRequest();
        request.email = "test@example.com";
        request.password = "password";

        when(authService.login(request.email, request.password))
                .thenReturn(Map.of("token", "abc123"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("abc123"));

        verify(authService, times(1)).login(request.email, request.password);
    }

    @Test
    void testRegisterSuccess() throws Exception {
        AuthController.RegisterRequest request = new AuthController.RegisterRequest();
        request.fullName = "Test User";
        request.email = "test@example.com";
        request.password = "password";
        request.role = "restaurant_staff";
        request.phone = "1234567890";

        when(authService.register(request.fullName, request.email, request.password, request.role, request.phone))
                .thenReturn(Map.of("id", 1));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(authService, times(1)).register(request.fullName, request.email, request.password, request.role, request.phone);
    }
}
