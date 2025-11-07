package com.project.packEats.payload.driver;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class DriverOrderResponseTest {

    @Test
    public void testNoArgsConstructorAndSetters() {
        DriverOrderResponse response = new DriverOrderResponse();

        UUID restaurantId = UUID.randomUUID();
        List<DriverOrderResponse.OrderItemDTO> items = new ArrayList<>();
        items.add(new DriverOrderResponse.OrderItemDTO("Burger", 2, 5.99));

        response.setId(1L);
        response.setRestaurantId(restaurantId);
        response.setRestaurantName("Pizza Place");
        response.setCustomerName("John Doe");
        response.setDeliveryAddress("123 Main St");
        response.setItems(items);
        response.setTotalAmount(11.98);
        response.setStatus("READY");
        response.setTimestamp("2025-11-06T22:00:00");

        assertEquals(1L, response.getId());
        assertEquals(restaurantId, response.getRestaurantId());
        assertEquals("Pizza Place", response.getRestaurantName());
        assertEquals("John Doe", response.getCustomerName());
        assertEquals("123 Main St", response.getDeliveryAddress());
        assertEquals(items, response.getItems());
        assertEquals(11.98, response.getTotalAmount());
        assertEquals("READY", response.getStatus());
        assertEquals("2025-11-06T22:00:00", response.getTimestamp());
    }

    @Test
    public void testAllArgsConstructor() {
        UUID restaurantId = UUID.randomUUID();
        List<DriverOrderResponse.OrderItemDTO> items = new ArrayList<>();
        items.add(new DriverOrderResponse.OrderItemDTO("Pizza", 1, 9.99));

        DriverOrderResponse response = new DriverOrderResponse(
                2L,
                restaurantId,
                "Pizza Hut",
                "Jane Smith",
                "456 Elm St",
                items,
                9.99,
                "COMPLETED",
                "2025-11-06T23:00:00"
        );

        assertEquals(2L, response.getId());
        assertEquals(restaurantId, response.getRestaurantId());
        assertEquals("Pizza Hut", response.getRestaurantName());
        assertEquals("Jane Smith", response.getCustomerName());
        assertEquals("456 Elm St", response.getDeliveryAddress());
        assertEquals(items, response.getItems());
        assertEquals(9.99, response.getTotalAmount());
        assertEquals("COMPLETED", response.getStatus());
        assertEquals("2025-11-06T23:00:00", response.getTimestamp());
    }

    @Test
    public void testOrderItemDTOSettersAndGetters() {
        DriverOrderResponse.OrderItemDTO item = new DriverOrderResponse.OrderItemDTO();

        item.setName("Sushi");
        item.setQuantity(3);
        item.setPrice(4.50);

        assertEquals("Sushi", item.getName());
        assertEquals(3, item.getQuantity());
        assertEquals(4.50, item.getPrice());
    }

    @Test
    public void testOrderItemDTOAllArgsConstructor() {
        DriverOrderResponse.OrderItemDTO item = new DriverOrderResponse.OrderItemDTO("Taco", 5, 2.00);

        assertEquals("Taco", item.getName());
        assertEquals(5, item.getQuantity());
        assertEquals(2.00, item.getPrice());
    }

    @Test
    public void testItemsListManipulation() {
        List<DriverOrderResponse.OrderItemDTO> items = new ArrayList<>();
        items.add(new DriverOrderResponse.OrderItemDTO("Burger", 2, 5.99));
        items.add(new DriverOrderResponse.OrderItemDTO("Fries", 1, 2.99));

        DriverOrderResponse response = new DriverOrderResponse();
        response.setItems(items);

        assertEquals(2, response.getItems().size());
        assertEquals("Fries", response.getItems().get(1).getName());
    }
}
