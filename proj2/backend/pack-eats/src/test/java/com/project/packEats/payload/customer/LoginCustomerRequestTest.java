package com.project.packEats.payload.customer;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class LoginCustomerRequestTest {

    @Test
    void testConstructorAndGettersSetters() {
        // given
        String identifier = "test@example.com";
        String password = "password123";

        // when
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier(identifier);
        request.setPassword(password);

        // then
        assertThat(request.getIdentifier()).isEqualTo(identifier);
        assertThat(request.getPassword()).isEqualTo(password);
    }

    @Test
    void testEqualsAndHashCode() {
        // given
        LoginCustomerRequest request1 = new LoginCustomerRequest();
        request1.setIdentifier("user@example.com");
        request1.setPassword("password123");

        LoginCustomerRequest request2 = new LoginCustomerRequest();
        request2.setIdentifier("user@example.com");
        request2.setPassword("password123");

        LoginCustomerRequest request3 = new LoginCustomerRequest();
        request3.setIdentifier("different@example.com");
        request3.setPassword("password123");

        // then
        assertThat(request1).isEqualTo(request2);
        assertThat(request1).isNotEqualTo(request3);
        assertThat(request1.hashCode()).isEqualTo(request2.hashCode());
        assertThat(request1.hashCode()).isNotEqualTo(request3.hashCode());
    }

    @Test
    void testToString() {
        // given
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier("test@example.com");
        request.setPassword("password123");

        // when
        String toString = request.toString();

        // then
        assertThat(toString)
                .contains("identifier=test@example.com")
                .contains("password=password123");
    }

    @Test
    void testNullValues() {
        // given
        LoginCustomerRequest request = new LoginCustomerRequest();

        // then
        assertThat(request.getIdentifier()).isNull();
        assertThat(request.getPassword()).isNull();
    }

    @Test
    void testBuilder() {
        // given
        String identifier = "test@example.com";
        String password = "password123";

        // when
        LoginCustomerRequest request = new LoginCustomerRequest();
        request.setIdentifier(identifier);
        request.setPassword(password);

        // then
        LoginCustomerRequest copy = new LoginCustomerRequest();
        copy.setIdentifier(request.getIdentifier());
        copy.setPassword(request.getPassword());

        assertThat(copy).isEqualTo(request);
    }
}
