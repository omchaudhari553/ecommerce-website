package com.springboot.service;

import com.springboot.entity.Cart;
import com.springboot.entity.CartItem;
import com.springboot.entity.Product;
import com.springboot.entity.User;
import com.springboot.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductService productService;
    
    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }
    
    @Transactional
    public Cart addToCart(User user, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        
        Cart cart = getOrCreateCart(user);
        Product product = productService.getProductById(productId);
        
        // Check if product is in stock
        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }
        
        // Check if product already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
        
        if (existingItem.isPresent()) {
            // Update quantity if product already exists
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            // Add new item if product doesn't exist in cart
            CartItem newItem = new CartItem(cart, product, quantity);
            cart.addItem(newItem);
        }
        
        cart.recalculateTotal();
        return cartRepository.save(cart);
    }
    
    @Transactional
    public Cart updateCartItemQuantity(User user, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        
        Cart cart = getOrCreateCart(user);
        Product product = productService.getProductById(productId);
        
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product not found in cart"));
        
        // Check if new quantity is available in stock
        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }
        
        item.setQuantity(quantity);
        cart.recalculateTotal();
        return cartRepository.save(cart);
    }
    
    @Transactional
    public Cart removeFromCart(User user, Long productId) {
        Cart cart = getOrCreateCart(user);
        
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product not found in cart"));
        
        cart.removeItem(item);
        return cartRepository.save(cart);
    }
    
    @Transactional
    public Cart clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.clear();
        return cartRepository.save(cart);
    }
    
    public Cart getCart(User user) {
        return cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found for user"));
    }
}
