package com.springboot.controller;

import com.springboot.dto.CreateOrderDTO;
import com.springboot.dto.OrderItemDTO;
import com.springboot.entity.*;
import com.springboot.repository.CartRepository;
import com.springboot.repository.OrderRepository;
import com.springboot.service.CartService;
import com.springboot.service.OrderService;
import com.springboot.service.ProductService;
import com.springboot.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private CartRepository cartRepository;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("OrderController is working!");
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderDTO request) {
        logger.info("Received order creation request for user: {}", request.getUserEmail());
        
        try {
            // Validate request
            if (request == null) {
                throw new IllegalArgumentException("Request cannot be null");
            }
            if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
                throw new IllegalArgumentException("Order must contain at least one item");
            }
            if (request.getUserEmail() == null || request.getUserEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("User email is required");
            }
            if (request.getShippingAddress() == null || request.getShippingAddress().trim().isEmpty()) {
                throw new IllegalArgumentException("Shipping address is required");
            }

            // Get user
            User user = userService.getUserByEmail(request.getUserEmail());
            if (user == null) {
                throw new IllegalArgumentException("User not found with email: " + request.getUserEmail());
            }

            // Create order
            Order order = new Order();
            order.setUser(user);
            order.setShippingAddress(request.getShippingAddress());
            order.setStatus("PENDING");

            // Create order items
            logger.info("=== CREATING ORDER ITEMS ===");
            List<OrderItem> orderItems = new ArrayList<>();
            for (OrderItemDTO itemDTO : request.getOrderItems()) {
                logger.info("Processing item DTO: productId={}, quantity={}", itemDTO.getProductId(), itemDTO.getQuantity());
                
                Product product = productService.getProductById(itemDTO.getProductId());
                if (product == null) {
                    throw new IllegalArgumentException("Product not found with id: " + itemDTO.getProductId());
                }
                
                logger.info("Found product: id={}, name={}, price={}, imageUrl={}", 
                    product.getId(), product.getName(), product.getPrice(), product.getImageUrl());

                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(product);
                orderItem.setQuantity(itemDTO.getQuantity());
                orderItem.setPrice(product.getPrice()); // Save the product price
                orderItem.setOrder(order);
                orderItems.add(orderItem);
                
                logger.info("Created order item: productId={}, quantity={}, price={}", 
                    product.getId(), itemDTO.getQuantity(), product.getPrice());
            }
            order.setOrderItems(orderItems);

            // Create order
            Order createdOrder = orderService.createOrder(order, user);
            logger.info("Order created successfully with ID: {}", createdOrder.getId());
            
            return ResponseEntity.ok(createdOrder);
        } catch (IllegalArgumentException e) {
            logger.error("Error creating order: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error creating order", e);
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }
    
    @PostMapping("/test-create")
    public ResponseEntity<Map<String, Object>> testCreateOrder() {
        logger.info("=== TESTING ORDER CREATION ===");
        try {
            // Create a simple test order
            User testUser = userService.getUserByEmail("test@example.com");
            if (testUser == null) {
                // Create a test user if not exists
                testUser = new User();
                testUser.setEmail("test@example.com");
                testUser.setName("Test User");
                testUser.setPassword("password");
                testUser = userService.createUser(testUser);
            }
            
            Order testOrder = new Order();
            testOrder.setUser(testUser);
            testOrder.setShippingAddress("Test Address");
            testOrder.setStatus("PENDING");
            
            // Create a test order item
            Product testProduct = productService.getProductById(1L);
            if (testProduct == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product with ID 1 not found"));
            }
            
            OrderItem testItem = new OrderItem();
            testItem.setProduct(testProduct);
            testItem.setQuantity(1);
            testItem.setPrice(testProduct.getPrice());
            testItem.setOrder(testOrder);
            
            List<OrderItem> items = new ArrayList<>();
            items.add(testItem);
            testOrder.setOrderItems(items);
            
            Order createdOrder = orderService.createOrder(testOrder, testUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", createdOrder.getId());
            response.put("productName", testProduct.getName());
            response.put("productPrice", testProduct.getPrice());
            response.put("productImageUrl", testProduct.getImageUrl());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in test order creation: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/test-all")
    public ResponseEntity<List<Map<String, Object>>> testAllOrders() {
        logger.info("=== TESTING ALL ORDERS ===");
        try {
            List<Order> allOrders = orderRepository.findAll();
            logger.info("Found {} total orders in database", allOrders.size());
            
            List<Map<String, Object>> result = new ArrayList<>();
            for (Order order : allOrders) {
                Map<String, Object> orderData = new HashMap<>();
                orderData.put("orderId", order.getId());
                orderData.put("userEmail", order.getUser() != null ? order.getUser().getEmail() : null);
                orderData.put("status", order.getStatus());
                orderData.put("totalAmount", order.getTotalAmount());
                
                if (order.getOrderItems() != null) {
                    List<Map<String, Object>> items = new ArrayList<>();
                    for (OrderItem item : order.getOrderItems()) {
                        Map<String, Object> itemData = new HashMap<>();
                        itemData.put("quantity", item.getQuantity());
                        itemData.put("price", item.getPrice());
                        
                        if (item.getProduct() != null) {
                            itemData.put("productId", item.getProduct().getId());
                            itemData.put("productName", item.getProduct().getName());
                            itemData.put("productPrice", item.getProduct().getPrice());
                            itemData.put("productImageUrl", item.getProduct().getImageUrl());
                        }
                        items.add(itemData);
                    }
                    orderData.put("items", items);
                }
                result.add(orderData);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error testing orders: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String userEmail) {
        logger.info("Getting orders for user: {}", userEmail);
        User user = userService.getUserByEmail(userEmail);
        
        if (user == null) {
            logger.error("User not found with email: {}", userEmail);
            throw new IllegalArgumentException("User not found with email: " + userEmail);
        }
        
        List<Order> orders = orderService.getUserOrders(user);
        logger.info("Found {} orders for user", orders.size());
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/debug/{orderId}")
    public ResponseEntity<Map<String, Object>> debugOrder(@PathVariable Long orderId) {
        logger.info("Debugging order with ID: {}", orderId);
        
        try {
            Order order = orderService.getOrderById(orderId);
            Map<String, Object> debugData = new HashMap<>();
            
            debugData.put("orderId", order.getId());
            debugData.put("orderDate", order.getOrderDate());
            debugData.put("status", order.getStatus());
            debugData.put("totalAmount", order.getTotalAmount());
            debugData.put("userEmail", order.getUser() != null ? order.getUser().getEmail() : null);
            
            List<Map<String, Object>> itemsDebug = new ArrayList<>();
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    Map<String, Object> itemDebug = new HashMap<>();
                    itemDebug.put("orderItemId", item.getId());
                    itemDebug.put("quantity", item.getQuantity());
                    itemDebug.put("orderItemPrice", item.getPrice());
                    
                    if (item.getProduct() != null) {
                        Map<String, Object> productDebug = new HashMap<>();
                        productDebug.put("productId", item.getProduct().getId());
                        productDebug.put("productName", item.getProduct().getName());
                        productDebug.put("productPrice", item.getProduct().getPrice());
                        productDebug.put("productImage", item.getProduct().getImageUrl());
                        itemDebug.put("product", productDebug);
                    }
                    
                    itemsDebug.add(itemDebug);
                }
            }
            debugData.put("orderItems", itemsDebug);
            
            return ResponseEntity.ok(debugData);
        } catch (Exception e) {
            logger.error("Error debugging order: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearAllOrders() {
        logger.info("Clearing all orders from database");
        try {
            orderRepository.deleteAll();
            logger.info("All orders cleared successfully");
            Map<String, String> response = new HashMap<>();
            response.put("message", "All orders cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error clearing orders: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error clearing orders: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/cleanup-product-4")
    public ResponseEntity<Map<String, String>> cleanupProduct4References() {
        logger.info("Cleaning up any references to product ID 4");
        try {
            // Clear all orders that might reference product 4
            orderRepository.deleteAll();
            
            // Clear cart for the user that might have product 4
            try {
                User user = userService.getUserByEmail("omchaudhari055@gmail.com");
                Cart cart = cartService.getCart(user);
                cart.clear();
                cartRepository.save(cart);
            } catch (Exception e) {
                logger.info("Cart already cleared or not found: {}", e.getMessage());
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Successfully cleaned up product ID 4 references");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error cleaning up product 4 references: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        logger.info("Getting order by ID: {}", id);
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        logger.info("Updating status of order {} to {}", id, status);
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
