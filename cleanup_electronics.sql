-- Script to remove all electronic products and related orders
-- Database: ecommerce
-- Username: admin
-- Password: Shubham12345

USE ecommerce;

-- Disable foreign key checks to avoid constraint errors
SET FOREIGN_KEY_CHECKS = 0;

-- Step 1: Delete order_items related to electronic products
DELETE oi FROM order_items oi
INNER JOIN products p ON oi.product_id = p.id
WHERE p.category = 'Electronics';

-- Step 2: Delete orders that now have no items (optional - remove if you want to keep empty orders)
-- DELETE o FROM orders o
-- LEFT JOIN order_items oi ON o.id = oi.order_id
-- WHERE oi.id IS NULL;

-- Step 3: Delete all electronic products
DELETE FROM products WHERE category = 'Electronics';

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify cleanup
SELECT 'Remaining products:' as description;
SELECT id, name, category FROM products;

SELECT 'Order items count:' as description, COUNT(*) as count FROM order_items;
SELECT 'Orders count:' as description, COUNT(*) as count FROM orders;
