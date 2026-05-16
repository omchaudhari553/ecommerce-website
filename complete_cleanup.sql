-- COMPLETE CLEANUP SCRIPT
-- This will reset everything and set up correct data

USE ecommerce;

-- Step 1: Delete all order items and orders
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM order_items;
DELETE FROM orders;
SET FOREIGN_KEY_CHECKS = 1;

-- Step 2: Reset auto-increment on orders table
ALTER TABLE orders AUTO_INCREMENT = 1;

-- Step 3: Delete ALL existing products (clean slate)
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM products;
SET FOREIGN_KEY_CHECKS = 1;

-- Step 4: Reset auto-increment on products
ALTER TABLE products AUTO_INCREMENT = 1;

-- Step 5: Insert correct shirt products with proper IDs
-- IDs are assigned sequentially starting from 1

INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Cartoon Astronaut T-Shirt', 'Adidas Cartoon Astronaut T-Shirt - Premium cotton comfort', 647.00, 50, 'T-Shirts', 'f1.jpg'),
('Floral Print Shirt', 'Zara Floral Print Shirt - Elegant floral design', 564.00, 50, 'Shirts', 'f2.jpg'),
('Classic White Shirt', 'Levis Classic White Shirt - Timeless formal wear', 738.00, 50, 'Shirts', 'f3.jpg'),
('Vintage Print T-Shirt', 'Nike Vintage Print T-Shirt - Retro style comfort', 481.00, 50, 'T-Shirts', 'f4.jpg'),
('Denim Shirt', 'Levis Denim Shirt - Durable denim style', 812.00, 40, 'Shirts', 'f5.jpg'),
('Casual Overshirt', 'Zara Casual Overshirt - Modern casual look', 705.00, 45, 'Shirts', 'f6.jpg'),
('Printed Summer Shirt', 'H&M Printed Summer Shirt - Lightweight summer wear', 623.00, 50, 'Shirts', 'f7.jpg'),
('Striped Casual Shirt', 'Pull&Bear Striped Casual Shirt - Classic stripes', 538.00, 50, 'Shirts', 'f8.jpg'),
('New Collection Shirt', 'Zara New Collection Shirt - Latest fashion', 787.00, 40, 'Shirts', 'n1.jpg'),
('Modern Fit Shirt', 'H&M Modern Fit Shirt - Contemporary style', 732.00, 45, 'Shirts', 'n2.jpg'),
('Summer Collection Shirt', 'Pull&Bear Summer Collection Shirt - Seasonal favorite', 597.00, 50, 'Shirts', 'n3.jpg'),
('Casual Summer Shirt', 'Levis Casual Summer Shirt - Relaxed summer fit', 564.00, 50, 'Shirts', 'n4.jpg'),
('Denim Collection Shirt', 'Levis Denim Collection Shirt - Premium denim', 764.00, 35, 'Shirts', 'n5.jpg'),
('Classic Fit Shirt', 'Zara Classic Fit Shirt - Traditional elegance', 647.00, 45, 'Shirts', 'n6.jpg'),
('Premium Cotton Shirt', 'H&M Premium Cotton Shirt - 100% pure cotton', 705.00, 50, 'Shirts', 'n7.jpg'),
('Slim Fit Shirt', 'Pull&Bear Slim Fit Shirt - Tailored fit', 670.00, 45, 'Shirts', 'n8.jpg');

-- Step 6: Verify cleanup
SELECT '=== CLEANUP COMPLETE ===' AS status;
SELECT COUNT(*) AS total_orders FROM orders;
SELECT COUNT(*) AS total_order_items FROM order_items;
SELECT COUNT(*) AS total_products FROM products;
SELECT id, name, category, price FROM products ORDER BY id;
