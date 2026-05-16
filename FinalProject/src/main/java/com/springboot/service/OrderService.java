package com.springboot.service;

import com.springboot.entity.Order;
import com.springboot.entity.OrderItem;
import com.springboot.entity.Product;
import com.springboot.entity.User;
import com.springboot.repository.OrderRepository;
import com.springboot.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.validation.Valid;
import javax.validation.Validator;
import javax.validation.ConstraintViolation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private Validator validator;
    
    @Transactional
    public Order createOrder(@Valid Order order, User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        // Set required fields before validation
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING"); // Set default status
        
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Process order items and calculate total amount
        java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;
        for (OrderItem item : order.getOrderItems()) {
            if (item.getQuantity() == null || item.getQuantity() < 1) {
                throw new IllegalArgumentException("Invalid quantity for order item");
            }
            
            // Log the incoming product data
            logger.info("Processing order item - Incoming product ID: {}, Product name: {}", 
                item.getProduct().getId(), 
                item.getProduct().getName());
            
            // Validate that the product exists and get fresh data
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + item.getProduct().getId()));
            
            logger.info("Retrieved product from database - ID: {}, Name: {}, Price: {}, ImageUrl: {}", 
                product.getId(), product.getName(), product.getPrice(), product.getImageUrl());
            
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }
            
            // Set order item details with the correct product from database
            item.setOrder(order);
            item.setProduct(product);
            item.setPrice(product.getPrice()); // Set the current price of the product
            
            // Calculate item total and add to order total
            totalAmount = totalAmount.add(product.getPrice().multiply(new java.math.BigDecimal(item.getQuantity())));
            
            // Update product stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
            
            logger.info("Order item processed successfully - Product ID: {}, Name: {}, Quantity: {}, Price: {}", 
                product.getId(), product.getName(), item.getQuantity(), product.getPrice());
        }
        
        // Set the calculated total amount
        order.setTotalAmount(totalAmount);

        // Validate the order after setting all required fields
        Set<ConstraintViolation<Order>> violations = validator.validate(order);
        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining(", "));
            throw new IllegalArgumentException("Order validation failed: " + errorMessage);
        }
        
        return orderRepository.save(order);
    }
    
    public List<Order> getUserOrders(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        logger.info("Getting orders for user: {} (ID: {})", user.getEmail(), user.getId());
        List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(user);
        
        logger.info("Found {} orders for user: {}", orders.size(), user.getEmail());
        
        // Log detailed information about each order and its items
        for (int i = 0; i < orders.size(); i++) {
            Order order = orders.get(i);
            logger.info("Order {}: ID={}, Status={}, TotalAmount={}, OrderDate={}", 
                i + 1, order.getId(), order.getStatus(), order.getTotalAmount(), order.getOrderDate());
            
            if (order.getOrderItems() != null) {
                for (int j = 0; j < order.getOrderItems().size(); j++) {
                    OrderItem item = order.getOrderItems().get(j);
                    if (item.getProduct() != null) {
                        logger.info("  Item {}: ProductID={}, ProductName={}, Quantity={}, Price={}, ImageUrl={}", 
                            j + 1, 
                            item.getProduct().getId(), 
                            item.getProduct().getName(), 
                            item.getQuantity(), 
                            item.getPrice(), 
                            item.getProduct().getImageUrl());
                    } else {
                        logger.warn("  Item {}: Product is null!", j + 1);
                    }
                }
            } else {
                logger.warn("Order {} has no order items", order.getId());
            }
        }
        
        return orders;
    }
    
    public Order getOrderById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        return orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
    }
    
    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        if (id == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        
        Order order = getOrderById(id);
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
    
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        if ("DELIVERED".equals(order.getStatus())) {
            throw new IllegalArgumentException("Cannot cancel a delivered order");
        }
        
        // Restore product stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + item.getProduct().getId()));
            
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
        
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }
}
