package com.project.packEats.entity.order;

import com.project.packEats.model.customer.UserOrder;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class OrderEntityTest {

    @Test
    void testGettersAndSetters() {
        OrderEntity o = new OrderEntity();
        o.setId(100);
        UUID cid = UUID.randomUUID();
        UUID rid = UUID.randomUUID();
        o.setCustomer_id(cid);
        o.setRestaurant_id(rid);
        o.setTotal_amount(25.5);

        List<UserOrder> items = new ArrayList<>();
        // We don't need to populate UserOrder for this basic test; just ensure list handling works
        o.setItems(items);

        o.setStatus("PENDING");
        o.setMenu_item_id(7);

        assertEquals(100, o.getId());
        assertEquals(cid, o.getCustomer_id());
        assertEquals(rid, o.getRestaurant_id());
        assertEquals(25.5, o.getTotal_amount());
        assertEquals(items, o.getItems());
        assertEquals("PENDING", o.getStatus());
        assertEquals(7, o.getMenu_item_id());
    }
}
