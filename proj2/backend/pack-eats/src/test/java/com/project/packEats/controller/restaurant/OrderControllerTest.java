package com.project.packEats.controller.restaurant;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.packEats.entity.order.OrderEntity;
import com.project.packEats.repository.OrderCustomerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderCustomerRepository orderRepository;

    @Test
    void whenPlaceOrder_thenSavedAndReturned() throws Exception {
        OrderEntity input = new OrderEntity();
        input.setCustomer_id(UUID.randomUUID());
        input.setRestaurant_id(UUID.randomUUID());
        input.setTotal_amount(12.5);
        input.setItems(new ArrayList<>());
        input.setStatus("PENDING");
        input.setMenu_item_id(3);

        OrderEntity saved = new OrderEntity();
        saved.setId(1);
        saved.setCustomer_id(input.getCustomer_id());
        saved.setRestaurant_id(input.getRestaurant_id());
        saved.setTotal_amount(input.getTotal_amount());
        saved.setItems(input.getItems());
        saved.setStatus(input.getStatus());
        saved.setMenu_item_id(input.getMenu_item_id());

        when(orderRepository.save(any(OrderEntity.class))).thenReturn(saved);

        mockMvc.perform(post("/api/orders/place")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("\"id\":1")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("\"total_amount\":12.5")));
    }
}
