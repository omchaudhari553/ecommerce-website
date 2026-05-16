-- Script to remove Wireless Headphones from database
-- Database: ecommerce
-- Username: admin
-- Password: Shubham12345

USE ecommerce;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Step 1: Delete order_items related to Wireless Headphones
DELETE oi FROM order_items oi
INNER JOIN products p ON oi.product_id = p.id
WHERE p.name LIKE '%Wireless Headphones%';

-- Step 2: Delete Wireless Headphones product
DELETE FROM products WHERE name LIKE '%Wireless Headphones%';

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify removal
SELECT 'Products matching Wireless Headphones:' as description;
SELECT id, name, category FROM products WHERE name LIKE '%Wireless Headphones%';
