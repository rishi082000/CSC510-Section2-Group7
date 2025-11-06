package com.project.packEats.services;

import com.project.packEats.entity.restaurantUser.User;
import com.project.packEats.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTest {

    private UserRepository userRepository;
    private CustomUserDetailsService service;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        service = new CustomUserDetailsService(userRepository);
    }

    @Test
    void loadUserByUsernameThrowsIfUserNotFound() {
        when(userRepository.findByEmail("a@b.com")).thenReturn(null);
        assertThrows(UsernameNotFoundException.class, () -> service.loadUserByUsername("a@b.com"));
    }

    @Test
    void loadUserByUsernameReturnsUserDetails() {
        User user = new User("John", "a@b.com", "hash", "restaurant_staff");
        when(userRepository.findByEmail("a@b.com")).thenReturn(user);

        UserDetails userDetails = service.loadUserByUsername("a@b.com");
        assertEquals(user.getEmail(), userDetails.getUsername());
        assertEquals(user.getPasswordHash(), userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().isEmpty());
    }
}
