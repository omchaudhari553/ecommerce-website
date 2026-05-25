package com.springboot.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ProductCatalogSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ProductCatalogSeeder.class);

    private final JdbcTemplate jdbcTemplate;

    public ProductCatalogSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private record CatalogItem(String name, String description, BigDecimal price, int stock, String imageUrl, String category) {}

    private static final List<CatalogItem> CATALOG = List.of(
        item("Cartoon Astronaut T-Shirt", "High-quality cotton t-shirt with unique astronaut design", "647.00", 50, "f1.jpg", "T-Shirts"),
        item("Floral Print Shirt", "Stylish floral print shirt perfect for summer", "564.00", 45, "f2.jpg", "Shirts"),
        item("Classic White Shirt", "Classic white shirt for formal occasions", "738.00", 30, "f3.jpg", "Shirts"),
        item("Vintage Print T-Shirt", "Vintage style printed t-shirt", "481.00", 60, "f4.jpg", "T-Shirts"),
        item("Denim Shirt", "Classic denim shirt with modern fit", "812.00", 25, "f5.jpg", "Shirts"),
        item("Casual Overshirt", "Casual overshirt perfect for layering", "705.00", 35, "f6.jpg", "Shirts"),
        item("Printed Summer Shirt", "Light and breezy summer shirt with unique print", "623.00", 40, "f7.jpg", "Shirts"),
        item("Striped Casual Shirt", "Casual striped shirt for everyday wear", "538.00", 55, "f8.jpg", "Shirts"),
        item("New Collection Shirt", "Latest collection formal shirt", "787.00", 20, "n1.jpg", "Shirts"),
        item("Modern Fit Shirt", "Modern fit shirt with unique design", "732.00", 30, "n2.jpg", "Shirts"),
        item("Summer Collection Shirt", "Light summer collection shirt", "597.00", 45, "n3.jpg", "Shirts"),
        item("Casual Summer Shirt", "Casual shirt perfect for summer", "564.00", 50, "n4.jpg", "Shirts"),
        item("Denim Collection Shirt", "New denim collection shirt", "764.00", 25, "n5.jpg", "Shirts"),
        item("Classic Fit Shirt", "Classic fit shirt for formal wear", "647.00", 35, "n6.jpg", "Shirts"),
        item("Premium Cotton Shirt", "Premium cotton shirt with modern design", "705.00", 40, "n7.jpg", "Shirts"),
        item("Slim Fit Shirt", "Slim fit shirt for a modern look", "680.00", 30, "n8.jpg", "Shirts")
    );

    private static CatalogItem item(String name, String description, String price, int stock, String imageUrl, String category) {
        return new CatalogItem(name, description, new BigDecimal(price), stock, imageUrl, category);
    }

    @Transactional
    public Map<String, Object> ensureCatalog() {
        Map<String, Object> result = new HashMap<>();
        int created = 0;
        for (int i = 0; i < CATALOG.size(); i++) {
            long id = i + 1L;
            CatalogItem p = CATALOG.get(i);
            Integer exists = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM products WHERE id = ?", Integer.class, id);
            if (exists != null && exists == 0) {
                jdbcTemplate.update(
                        "INSERT INTO products (id, name, description, price, stock_quantity, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        id, p.name(), p.description(), p.price(), p.stock(), p.imageUrl(), p.category());
                created++;
            }
        }
        Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Long.class);
        result.put("inserted", created);
        result.put("total", total);
        logger.info("Product catalog: inserted {}, total {}", created, total);
        return result;
    }
}
