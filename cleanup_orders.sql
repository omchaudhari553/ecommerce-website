-- Script to clean up orders and order_items tables
-- Database: ecommerce
-- Run this in MySQL Workbench or MySQL command line

USE ecommerce;

-- Disable foreign key checks temporarily to avoid constraint errors
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate (delete all records from) order_items table
TRUNCATE TABLE order_items;

-- Truncate (delete all records from) orders table
TRUNCATE TABLE orders;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify cleanup
SELECT COUNT(*) as order_items_count FROM order_items;
SELECT COUNT(*) as orders_count FROM orders;
