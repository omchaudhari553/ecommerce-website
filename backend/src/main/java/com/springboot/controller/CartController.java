package com.springboot.controller;

import com.springboot.entity.Cart;
import com.springboot.entity.User;
import com.springboot.service.CartService;
import com.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserService userService;
    
    static class AddToCartRequest {
        private Long productId;
        private Integer quantity;
        private String userEmail;
        
        public Long getProductId() {
            return productId;
        }
        
        public void setProductId(Long productId) {
            this.productId = productId;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public String getUserEmail() {
            return userEmail;
        }
        
        public void setUserEmail(String userEmail) {
            this.userEmail = userEmail;
        }
    }
    
    @GetMapping("/{userEmail}")
    public ResponseEntity<Cart> getCart(@PathVariable String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return ResponseEntity.ok(cartService.getCart(user));
    }
    
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request) {
        User user = userService.getUserByEmail(request.getUserEmail());
        return ResponseEntity.ok(cartService.addToCart(user, request.getProductId(), request.getQuantity()));
    }
    
    @PutMapping("/update")
    public ResponseEntity<Cart> updateCartItem(@RequestBody AddToCartRequest request) {
        User user = userService.getUserByEmail(request.getUserEmail());
        return ResponseEntity.ok(cartService.updateCartItemQuantity(user, request.getProductId(), request.getQuantity()));
    }
    
    @DeleteMapping("/{userEmail}/items/{productId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable String userEmail, @PathVariable Long productId) {
        User user = userService.getUserByEmail(userEmail);
        return ResponseEntity.ok(cartService.removeFromCart(user, productId));
    }
    
    @DeleteMapping("/{userEmail}/clear")
    public ResponseEntity<Cart> clearCart(@PathVariable String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        return ResponseEntity.ok(cartService.clearCart(user));
    }
}
