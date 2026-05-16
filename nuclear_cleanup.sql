-- NUCLEAR CLEANUP - Resets EVERYTHING
USE ecommerce;

-- Step 1: Drop and recreate order_items table (complete reset)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;

-- Recreate order_items table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Step 2: Drop and recreate orders table (complete reset)
DROP TABLE IF EXISTS orders;

-- Recreate orders table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    shipping_address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(500),
    payment_status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

SET FOREIGN_KEY_CHECKS = 1;

-- Step 3: Verify
SELECT '=== NUCLEAR CLEANUP COMPLETE ===' AS status;
SELECT 'orders table recreated, ID starts from 1' AS message;
SELECT 'order_items table recreated' AS message;
SELECT COUNT(*) AS total_orders FROM orders;
SELECT COUNT(*) AS total_order_items FROM order_items;
