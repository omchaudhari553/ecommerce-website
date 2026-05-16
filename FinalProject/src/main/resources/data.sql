-- Insert test user (password is 'password123' encoded with BCrypt)
INSERT INTO users (name, email, password, role)
VALUES ('Test User', 'user@example.com', '$2a$10$YCJ0oM5qL5PNGK.DuGGEi.jrLMTdWZZ5XY5WGQGqb1dY6pQmm5NZi', 'USER');

-- Insert all shirt products (16 products)
-- IDs 1-16 with correct names, prices, and images as per user's shop
INSERT INTO products (id, name, description, price, stock_quantity, category, image_url)
VALUES 
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
ON DUPLICATE KEY UPDATE id=id;
