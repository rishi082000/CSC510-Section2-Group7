package com.project.packEats.entity.customer;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CustomersEntityTest {

    @Test
    void testGettersAndSetters() {
        CustomersEntity entity = new CustomersEntity();
        entity.setId(1);
        entity.setName("Alice");
        entity.setEmail("alice@example.com");
        entity.setPassword("secret");
        entity.setPhone("1234567890");

        assertEquals(1, entity.getId());
        assertEquals("Alice", entity.getName());
        assertEquals("alice@example.com", entity.getEmail());
        assertEquals("secret", entity.getPassword());
        assertEquals("1234567890", entity.getPhone());
    }

    @Test
    void testEqualsAndHashCode() {
        CustomersEntity a = new CustomersEntity();
        a.setId(1);
        a.setName("Bob");

        CustomersEntity b = new CustomersEntity();
        b.setId(1);
        b.setName("Bob");

        CustomersEntity c = new CustomersEntity();
        c.setId(2);
        c.setName("Charlie");

        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
        assertNotEquals(a, c);
    }

    @Test
    void testToStringContainsFields() {
        CustomersEntity entity = new CustomersEntity();
        entity.setId(5);
        entity.setName("Dana");
        entity.setEmail("dana@example.com");

        String s = entity.toString();
        assertTrue(s.contains("5"));
        assertTrue(s.contains("Dana"));
        assertTrue(s.contains("dana@example.com"));
    }

    @Test
    void testJpaAnnotationsPresent() {
        assertNotNull(CustomersEntity.class.getAnnotation(Entity.class), "Missing @Entity");
        Table table = CustomersEntity.class.getAnnotation(Table.class);
        assertNotNull(table, "Missing @Table");
        assertEquals("Customers_1", table.name());
    }
}
