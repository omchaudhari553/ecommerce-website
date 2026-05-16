-- Diagnostic script to check order and product data
-- Run this to see what's actually stored in your database

USE ecommerce;

-- Check all products in database
SELECT '=== ALL PRODUCTS ===' as info;
SELECT id, name, category, price, image_url FROM products;

-- Check all orders
SELECT '=== ALL ORDERS ===' as info;
SELECT o.id, o.user_id, o.status, o.total_amount, o.order_date 
FROM orders o;

-- Check order items with product details
SELECT '=== ORDER ITEMS WITH PRODUCT DETAILS ===' as info;
SELECT 
    oi.id as order_item_id,
    oi.order_id,
    oi.product_id,
    oi.quantity,
    oi.price as item_price,
    p.name as product_name,
    p.category as product_category,
    p.price as product_price,
    p.image_url as product_image
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id;

-- Check if all order_items have the same product_id (THE SMOKING GUN)
SELECT '=== PRODUCT ID DISTRIBUTION IN ORDER_ITEMS ===' as info;
SELECT 
    product_id, 
    COUNT(*) as count,
    GROUP_CONCAT(DISTINCT order_id) as order_ids
FROM order_items 
GROUP BY product_id;

-- Check for orphaned order items (product_id that doesn't exist)
SELECT '=== ORPHANED ORDER ITEMS (product not found) ===' as info;
SELECT 
    oi.id,
    oi.order_id,
    oi.product_id,
    oi.quantity
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
WHERE p.id IS NULL;
