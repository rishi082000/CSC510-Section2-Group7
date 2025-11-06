package com.project.packEats.repository;

import com.project.packEats.entity.order.Order;
import com.project.packEats.entity.restaurantUser.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.restaurantId = :restaurantId AND o.status IN :statuses ORDER BY o.timestamp DESC")
    List<Order> findByRestaurantAndStatuses(@Param("restaurantId") UUID restaurantId,
            @Param("statuses") List<String> statuses);
}
