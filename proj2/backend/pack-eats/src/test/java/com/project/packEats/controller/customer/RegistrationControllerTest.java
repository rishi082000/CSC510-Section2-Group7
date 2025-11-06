package com.project.packEats.controller.customer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.packEats.entity.customer.CustomersEntity;
import com.project.packEats.payload.customer.LoginCustomerRequest;
import com.project.packEats.payload.customer.RegisterCustomerRequest;
import com.project.packEats.repository.CustomersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        customersRepository.deleteAll();

        // Add test data to H2 database
        CustomersEntity existingCustomer = new CustomersEntity();
        existingCustomer.setName("Existing User");
        existingCustomer.setEmail("existing@example.com");
        existingCustomer.setPhone("1234567890");
        existingCustomer.setPassword("password123");
        customersRepository.save(existingCustomer);
    }

    @Test
    void whenRegisterNewUser_thenSuccess() throws Exception {
        // given
        RegisterCustomerRequest request = new RegisterCustomerRequest();
        request.setName("Rish Ra");
        request.setEmail("rish@example.com");
        request.setPhone("9876543210");
        request.setPassword("password123");

        // when
        ResultActions response = mockMvc.perform(post("/api/customers/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isOk());

        CustomersEntity savedCustomer = customersRepository.findByEmail("rish@example.com").orElse(null);
        assertThat(savedCustomer).isNotNull();
        assertThat(savedCustomer.getName()).isEqualTo("Rish Ra");
        assertThat(savedCustomer.getPhone()).isEqualTo("9876543210");
    }

    @Test
    void whenRegisterExistingEmail_thenConflict() throws Exception {
        // given
        RegisterCustomerRequest request = new RegisterCustomerRequest();
        request.setName("Another User");
        request.setEmail("existing@example.com");
        request.setPhone("5555555555");
        request.setPassword("password456");

        // when
        ResultActions response = mockMvc.perform(post("/api/customers/register")
                        .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isOk())
                .andExpect(content().string("User already exists. Please login"));
    }

    @Test
    void whenLoginWithEmail_thenSuccess() throws Exception {
        // given
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier("existing@example.com");
        request.setPassword("password123");

        // when
        ResultActions response = mockMvc.perform(post("/api/customers/login")
                        .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isOk())
                .andExpect(content().string("Login successful!"));
    }

    @Test
    void whenLoginWithPhone_thenSuccess() throws Exception {
        // given
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier("1234567890");
        request.setPassword("password123");

        // when
        ResultActions response = mockMvc.perform(post("/api/customers/login")
                        .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isOk())
                .andExpect(content().string("Login successful!"));
    }

    @Test
    void whenLoginWithWrongPassword_thenUnauthorized() throws Exception {
        // given
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier("existing@example.com");
        request.setPassword("wrongpassword");

        // when
        ResultActions response = mockMvc.perform(post("/api/customers/login")
                        .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid password."));
    }

    @Test
    void whenLoginWithNonExistentUserEmail_thenNotFound() throws Exception {
        // given
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier("nonexistent@example.com");
        request.setPassword("password123");

        // when
        ResultActions response = mockMvc.perform(post("/api/customers/login")
                        .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isNotFound())
                .andExpect(content().string("User not found. Please register first."));
    }

    @Test
    void whenLoginWithNonExistentUserPhone_thenNotFound() throws Exception {
        // given
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier("1234567891");
        request.setPassword("password123");

        // when
        ResultActions response = mockMvc.perform(post("/api/customers/login")
                        .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        // then
        response.andExpect(status().isNotFound())
                .andExpect(content().string("User not found. Please register first."));
    }
}