-- AWS NUCLEAR CLEANUP - DESTROYS AND RECREATES EVERYTHING
USE ebdb;

-- Step 1: Nuke order_items table
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;

-- Step 2: Nuke orders table  
DROP TABLE IF EXISTS orders;

-- Step 3: Clean products - keep only IDs 1-16
DELETE FROM products WHERE id > 16 OR id < 1;

-- Step 4: Recreate orders table fresh
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    shipping_address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    pincode VARCHAR(20),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(500),
    payment_status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
) AUTO_INCREMENT=1;

-- Step 5: Recreate order_items table fresh
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) AUTO_INCREMENT=1;

SET FOREIGN_KEY_CHECKS = 1;

-- Step 6: Insert correct products (16 shirts only)
INSERT INTO products (id, name, description, price, stock_quantity, category, image_url) VALUES 
(1, 'Cartoon Astronaut T-Shirt', 'Adidas Cartoon Astronaut T-Shirt - Premium cotton comfort', 647.00, 50, 'T-Shirts', 'f1.jpg'),
(2, 'Floral Print Shirt', 'Zara Floral Print Shirt - Elegant floral design', 564.00, 50, 'Shirts', 'f2.jpg'),
(3, 'Classic White Shirt', 'Levis Classic White Shirt - Timeless formal wear', 738.00, 50, 'Shirts', 'f3.jpg'),
(4, 'Vintage Print T-Shirt', 'Nike Vintage Print T-Shirt - Retro style comfort', 481.00, 50, 'T-Shirts', 'f4.jpg'),
(5, 'Denim Shirt', 'Levis Denim Shirt - Durable denim style', 812.00, 40, 'Shirts', 'f5.jpg'),
(6, 'Casual Overshirt', 'Zara Casual Overshirt - Modern casual look', 705.00, 45, 'Shirts', 'f6.jpg'),
(7, 'Printed Summer Shirt', 'H&M Printed Summer Shirt - Lightweight summer wear', 623.00, 50, 'Shirts', 'f7.jpg'),
(8, 'Striped Casual Shirt', 'Pull&Bear Striped Casual Shirt - Classic stripes', 538.00, 50, 'Shirts', 'f8.jpg'),
(9, 'New Collection Shirt', 'Zara New Collection Shirt - Latest fashion', 787.00, 40, 'Shirts', 'n1.jpg'),
(10, 'Modern Fit Shirt', 'H&M Modern Fit Shirt - Contemporary style', 732.00, 45, 'Shirts', 'n2.jpg'),
(11, 'Summer Collection Shirt', 'Pull&Bear Summer Collection Shirt - Seasonal favorite', 597.00, 50, 'Shirts', 'n3.jpg'),
(12, 'Casual Summer Shirt', 'Levis Casual Summer Shirt - Relaxed summer fit', 564.00, 50, 'Shirts', 'n4.jpg'),
(13, 'Denim Collection Shirt', 'Levis Denim Collection Shirt - Premium denim', 764.00, 35, 'Shirts', 'n5.jpg'),
(14, 'Classic Fit Shirt', 'Zara Classic Fit Shirt - Traditional elegance', 647.00, 45, 'Shirts', 'n6.jpg'),
(15, 'Premium Cotton Shirt', 'H&M Premium Cotton Shirt - 100% pure cotton', 705.00, 50, 'Shirts', 'n7.jpg'),
(16, 'Slim Fit Shirt', 'Pull&Bear Slim Fit Shirt - Tailored fit', 670.00, 45, 'Shirts', 'n8.jpg')
ON DUPLICATE KEY UPDATE 
name=VALUES(name), 
description=VALUES(description), 
price=VALUES(price), 
stock_quantity=VALUES(stock_quantity), 
category=VALUES(category), 
image_url=VALUES(image_url);

-- Step 7: Verify
SELECT '=== AWS DATABASE NUKED AND REBUILT ===' AS status;
SELECT COUNT(*) AS total_orders FROM orders;
SELECT COUNT(*) AS total_order_items FROM order_items;
SELECT COUNT(*) AS total_products FROM products;
SELECT id, name, category, price FROM products ORDER BY id;
