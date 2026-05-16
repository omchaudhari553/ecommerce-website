package com.springboot.repository;

import com.springboot.entity.Order;
import com.springboot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.product p " +
           "WHERE o.user = :user " +
           "ORDER BY o.orderDate DESC")
    List<Order> findByUserOrderByOrderDateDesc(User user);
    
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    
    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.product p " +
           "LEFT JOIN FETCH o.user u " +
           "WHERE o.id = :id")
    Optional<Order> findByIdWithItems(Long id);
}
