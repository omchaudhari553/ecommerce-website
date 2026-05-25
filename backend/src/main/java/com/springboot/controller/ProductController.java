package com.springboot.controller;

import com.springboot.config.ProductCatalogSeeder;
import com.springboot.entity.Product;
import com.springboot.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;

    @Autowired
    private ProductCatalogSeeder catalogSeeder;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchProducts(name));
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(productService.getProductsByPriceRange(minPrice, maxPrice));
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        product.setId(id); // Set the ID from the path variable
        return ResponseEntity.ok(productService.updateProduct(product));
    }
    
    @PostMapping("/seed-catalog")
    public ResponseEntity<Map<String, Object>> seedCatalog() {
        return ResponseEntity.ok(catalogSeeder.ensureCatalog());
    }

    @PostMapping("/create-product-4")
    public ResponseEntity<Product> createProduct4() {
        Product product = new Product();
        product.setName("Classic White Shirt");
        product.setDescription("Classic white shirt for formal occasions");
        product.setPrice(new BigDecimal("738.00"));
        product.setStockQuantity(50);
        product.setImageUrl("f3.jpg");
        product.setCategory("Shirts");
        
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(savedProduct);
    }
    
    @PostMapping("/force-create-product-4")
    public ResponseEntity<String> forceCreateProduct4() {
        try {
            // Force create product with ID 4 using native query or direct repository method
            Product product = new Product();
            product.setId(4L); // Force set ID
            product.setName("Classic White Shirt");
            product.setDescription("Classic white shirt for formal occasions");
            product.setPrice(new BigDecimal("738.00"));
            product.setStockQuantity(50);
            product.setImageUrl("f3.jpg");
            product.setCategory("Shirts");
            
            // Save with forced ID
            Product savedProduct = productService.saveProductWithId(product);
            return ResponseEntity.ok("Product ID 4 created successfully: " + savedProduct.getId());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating product ID 4: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
