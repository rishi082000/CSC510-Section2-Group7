package com.project.packEats.payload.customer;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class RegisterCustomerRequestTest {

    @Test
    void testGettersAndSetters() {
        // given
        RegisterCustomerRequest request = new RegisterCustomerRequest();

        // when
        request.setName("Rish Ra");
        request.setEmail("rish.ra@example.com");
        request.setPassword("password123");
        request.setPhone("1234567890");

        // then
        assertThat(request.getName()).isEqualTo("Rish Ra");
        assertThat(request.getEmail()).isEqualTo("rish.ra@example.com");
        assertThat(request.getPassword()).isEqualTo("password123");
        assertThat(request.getPhone()).isEqualTo("1234567890");
    }

    @Test
    void testEqualsAndHashCode() {
        // given
        RegisterCustomerRequest request1 = new RegisterCustomerRequest();
        request1.setName("Rish Ra");
        request1.setEmail("rish@example.com");
        request1.setPassword("password123");
        request1.setPhone("1234567890");

        RegisterCustomerRequest request2 = new RegisterCustomerRequest();
        request2.setName("Rish Ra");
        request2.setEmail("rish@example.com");
        request2.setPassword("password123");
        request2.setPhone("1234567890");

        RegisterCustomerRequest request3 = new RegisterCustomerRequest();
        request3.setName("Risha R");
        request3.setEmail("risha@example.com");
        request3.setPassword("password456");
        request3.setPhone("0987654321");

        // then
        assertThat(request1).isEqualTo(request2);
        assertThat(request1).isNotEqualTo(request3);
        assertThat(request1.hashCode()).isEqualTo(request2.hashCode());
        assertThat(request1.hashCode()).isNotEqualTo(request3.hashCode());
    }

    @Test
    void testToString() {
        // given
        RegisterCustomerRequest request = new RegisterCustomerRequest();
        request.setName("Rish Ra");
        request.setEmail("rish@example.com");
        request.setPassword("password123");
        request.setPhone("1234567890");

        // when
        String toString = request.toString();

        // then
        assertThat(toString)
                .contains("name=Rish Ra")
                .contains("email=rish@example.com")
                .contains("password=password123")
                .contains("phone=1234567890");
    }

    @Test
    void testNullValues() {
        // given
        RegisterCustomerRequest request = new RegisterCustomerRequest();

        // then
        assertThat(request.getName()).isNull();
        assertThat(request.getEmail()).isNull();
        assertThat(request.getPassword()).isNull();
        assertThat(request.getPhone()).isNull();
    }

    @Test
    void testObjectCopy() {
        // given
        RegisterCustomerRequest original = new RegisterCustomerRequest();
        original.setName("Rish Ra");
        original.setEmail("rish@example.com");
        original.setPassword("password123");
        original.setPhone("1234567890");

        // when
        RegisterCustomerRequest copy = new RegisterCustomerRequest();
        copy.setName(original.getName());
        copy.setEmail(original.getEmail());
        copy.setPassword(original.getPassword());
        copy.setPhone(original.getPhone());

        // then
        assertThat(copy).isEqualTo(original);
    }
}
