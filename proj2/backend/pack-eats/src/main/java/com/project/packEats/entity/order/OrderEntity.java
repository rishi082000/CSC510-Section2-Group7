package com.project.packEats.entity.order;

import jakarta.annotation.sql.DataSourceDefinition;
import jakarta.persistence.*;
import lombok.Data;
import java.util.*;
import com.project.packEats.model.customer.UserOrder;
import org.hibernate.annotations.JdbcType;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.hibernate.type.descriptor.jdbc.JsonJdbcType;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "orders")
@Data
public class OrderEntity {
    @Id
    @Column(name = "id")
    Integer id;

    @Column(name = "customer_id")
    UUID customer_id;

    @Column(name = "restaurant_id")
    UUID restaurant_id;

    @Column(name = "total_amount")
    Double total_amount;

    @Column(name = "items", columnDefinition = "jsonb")
    @Type(JsonType.class)
    private List<UserOrder> items;

    @Column(name = "status")
    String status;

    @Column(name = "menu_item_id")
    Integer menu_item_id;

}
