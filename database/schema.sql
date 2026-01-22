-- =====================================================
-- Shoe Price Comparison Platform - Database Schema
-- =====================================================
-- This schema is designed for scalability and performance
-- with proper indexing and relationships

-- Create database (run this separately if needed)
-- CREATE DATABASE IF NOT EXISTS shoe_comparison CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE shoe_comparison;

-- =====================================================
-- STORES TABLE
-- =====================================================
-- Stores information about different e-commerce platforms
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Store name (e.g., Amazon, Flipkart)',
    base_url VARCHAR(255) NOT NULL COMMENT 'Base URL of the store',
    logo_url VARCHAR(500) COMMENT 'URL to store logo',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether store is currently being scraped',
    scraping_config JSON COMMENT 'Store-specific scraping configuration',
    rate_limit_delay INT DEFAULT 2000 COMMENT 'Delay between requests in milliseconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_name (name)
) ENGINE=InnoDB COMMENT='E-commerce stores/platforms';

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
-- Master product information
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(500) NOT NULL COMMENT 'Product name',
    brand VARCHAR(100) COMMENT 'Brand name (Nike, Adidas, etc.)',
    model VARCHAR(150) COMMENT 'Product model',
    category VARCHAR(50) DEFAULT 'shoes' COMMENT 'Product category',
    subcategory VARCHAR(50) COMMENT 'Subcategory (running, casual, etc.)',
    description TEXT COMMENT 'Product description',
    primary_image_url VARCHAR(500) COMMENT 'Main product image',
    color VARCHAR(50) COMMENT 'Primary color',
    gender ENUM('men', 'women', 'unisex', 'kids') COMMENT 'Target gender',
    sizes JSON COMMENT 'Available sizes array',
    features JSON COMMENT 'Product features and specifications',
    search_keywords TEXT COMMENT 'Keywords for search optimization',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether product is actively tracked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for search performance
    FULLTEXT KEY ft_search (name, brand, model, description, search_keywords),
    INDEX idx_brand (brand),
    INDEX idx_category (category, subcategory),
    INDEX idx_gender (gender),
    INDEX idx_active (is_active),
    INDEX idx_name_brand (name, brand)
) ENGINE=InnoDB COMMENT='Master product catalog';

-- =====================================================
-- PRICES TABLE
-- =====================================================
-- Current prices from different stores
CREATE TABLE prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    store_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL COMMENT 'Current price',
    original_price DECIMAL(10, 2) COMMENT 'Original price before discount',
    discount_percentage DECIMAL(5, 2) COMMENT 'Discount percentage',
    currency VARCHAR(3) DEFAULT 'INR' COMMENT 'Currency code',
    product_url VARCHAR(1000) NOT NULL COMMENT 'Direct link to product page',
    availability ENUM('in_stock', 'out_of_stock', 'limited_stock', 'unknown') DEFAULT 'unknown',
    size_availability JSON COMMENT 'Size-wise availability',
    shipping_cost DECIMAL(8, 2) DEFAULT 0 COMMENT 'Shipping cost',
    delivery_time VARCHAR(50) COMMENT 'Estimated delivery time',
    rating DECIMAL(3, 2) COMMENT 'Product rating on this store',
    review_count INT DEFAULT 0 COMMENT 'Number of reviews',
    last_scraped TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When this price was last updated',
    scrape_status ENUM('success', 'failed', 'partial') DEFAULT 'success',
    error_message TEXT COMMENT 'Error details if scraping failed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Ensure one price record per product per store
    UNIQUE KEY unique_product_store (product_id, store_id),
    
    -- Performance indexes
    INDEX idx_price (price),
    INDEX idx_product_price (product_id, price),
    INDEX idx_store_id (store_id),
    INDEX idx_availability (availability),
    INDEX idx_last_scraped (last_scraped),
    INDEX idx_discount (discount_percentage)
) ENGINE=InnoDB COMMENT='Current prices from all stores';

-- =====================================================
-- PRICE HISTORY TABLE
-- =====================================================
-- Historical price data for trend analysis
CREATE TABLE price_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    store_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    currency VARCHAR(3) DEFAULT 'INR',
    availability ENUM('in_stock', 'out_of_stock', 'limited_stock', 'unknown'),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Indexes for trend analysis
    INDEX idx_product_store_date (product_id, store_id, recorded_at DESC),
    INDEX idx_recorded_at (recorded_at),
    INDEX idx_price_trend (product_id, recorded_at DESC, price)
) ENGINE=InnoDB COMMENT='Historical price data for trend analysis';

-- =====================================================
-- SEARCH QUERIES TABLE
-- =====================================================
-- Track search queries for analytics and optimization
CREATE TABLE search_queries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    query VARCHAR(500) NOT NULL COMMENT 'Search query text',
    normalized_query VARCHAR(500) COMMENT 'Normalized/cleaned query',
    results_count INT DEFAULT 0 COMMENT 'Number of results returned',
    user_ip VARCHAR(45) COMMENT 'User IP (hashed for privacy)',
    user_agent TEXT COMMENT 'User agent string',
    response_time_ms INT COMMENT 'Query response time in milliseconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_query (query),
    INDEX idx_normalized_query (normalized_query),
    INDEX idx_created_at (created_at),
    INDEX idx_results_count (results_count)
) ENGINE=InnoDB COMMENT='Search analytics and query tracking';

-- =====================================================
-- SCRAPING JOBS TABLE
-- =====================================================
-- Track scraping job status and scheduling
CREATE TABLE scraping_jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_type ENUM('full_scrape', 'price_update', 'new_product', 'store_check') NOT NULL,
    store_id INT,
    product_id INT,
    status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    products_processed INT DEFAULT 0,
    products_updated INT DEFAULT 0,
    products_failed INT DEFAULT 0,
    error_details JSON COMMENT 'Error details and logs',
    metadata JSON COMMENT 'Job-specific metadata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_job_type (job_type),
    INDEX idx_store_id (store_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='Scraping job queue and status tracking';

-- =====================================================
-- INITIAL DATA INSERTION
-- =====================================================

-- Insert initial store data
INSERT INTO stores (name, base_url, logo_url, scraping_config, rate_limit_delay) VALUES
('Amazon India', 'https://www.amazon.in', 'https://logo.clearbit.com/amazon.in', 
 JSON_OBJECT(
   'selectors', JSON_OBJECT(
     'price', '.a-price-whole, .a-offscreen',
     'original_price', '.a-text-price .a-offscreen',
     'title', '#productTitle',
     'image', '#landingImage, .a-dynamic-image',
     'availability', '#availability span',
     'rating', '.a-icon-alt'
   ),
   'search_url', 'https://www.amazon.in/s?k={query}&ref=nb_sb_noss'
 ), 3000),

('Flipkart', 'https://www.flipkart.com', 'https://logo.clearbit.com/flipkart.com',
 JSON_OBJECT(
   'selectors', JSON_OBJECT(
     'price', '._30jeq3, ._1_WHN1',
     'original_price', '._3I9_wc, ._2Tpdn3',
     'title', '.B_NuCI, ._4rR01T',
     'image', '._396cs4, ._2r_T1I',
     'availability', '._16FRp0',
     'rating', '._3LWZlK'
   ),
   'search_url', 'https://www.flipkart.com/search?q={query}'
 ), 2500),

('Myntra', 'https://www.myntra.com', 'https://logo.clearbit.com/myntra.com',
 JSON_OBJECT(
   'selectors', JSON_OBJECT(
     'price', '.pdp-price strong, .pdp-price',
     'original_price', '.pdp-mrp',
     'title', '.pdp-name, .pdp-title',
     'image', '.image-grid-image, .image-grid-square',
     'availability', '.size-buttons-unified-size',
     'rating', '.index-overallRating'
   ),
   'search_url', 'https://www.myntra.com/{query}'
 ), 4000),

('Nike India', 'https://www.nike.com/in', 'https://logo.clearbit.com/nike.com',
 JSON_OBJECT(
   'selectors', JSON_OBJECT(
     'price', '.product-price, .current-price',
     'original_price', '.striked-price',
     'title', '.pdp_product_title, h1',
     'image', '.hero-image, .product-image',
     'availability', '.size-layout',
     'rating', '.reviews-summary'
   ),
   'search_url', 'https://www.nike.com/in/w?q={query}'
 ), 3500),

('Adidas India', 'https://www.adidas.co.in', 'https://logo.clearbit.com/adidas.co.in',
 JSON_OBJECT(
   'selectors', JSON_OBJECT(
     'price', '.gl-price, .price-current',
     'original_price', '.gl-price-striked',
     'title', '.name, .pdp-product-name',
     'image', '.view-item-img, .product-image',
     'availability', '.size-selector',
     'rating', '.gl-star-rating'
   ),
   'search_url', 'https://www.adidas.co.in/search?q={query}'
 ), 3000);

-- =====================================================
-- USEFUL VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for best prices per product
CREATE VIEW best_prices AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.brand,
    MIN(pr.price) as lowest_price,
    s.name as best_store,
    pr.product_url as best_url,
    pr.availability,
    pr.last_scraped
FROM products p
JOIN prices pr ON p.id = pr.product_id
JOIN stores s ON pr.store_id = s.id
WHERE p.is_active = TRUE 
  AND s.is_active = TRUE
  AND pr.availability IN ('in_stock', 'limited_stock')
GROUP BY p.id, p.name, p.brand
HAVING MIN(pr.price) = pr.price;

-- View for price comparison per product
CREATE VIEW price_comparison AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.brand,
    s.name as store_name,
    pr.price,
    pr.original_price,
    pr.discount_percentage,
    pr.availability,
    pr.product_url,
    pr.last_scraped,
    RANK() OVER (PARTITION BY p.id ORDER BY pr.price ASC) as price_rank
FROM products p
JOIN prices pr ON p.id = pr.product_id
JOIN stores s ON pr.store_id = s.id
WHERE p.is_active = TRUE 
  AND s.is_active = TRUE;

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Additional composite indexes for common query patterns
CREATE INDEX idx_products_search_optimized ON products(is_active, brand, category, name);
CREATE INDEX idx_prices_comparison_optimized ON prices(product_id, availability, price, store_id);
CREATE INDEX idx_price_history_analytics ON price_history(product_id, recorded_at DESC, price);

-- =====================================================
-- STORED PROCEDURES (Optional - for complex operations)
-- =====================================================

DELIMITER //

-- Procedure to get price trends for a product
CREATE PROCEDURE GetPriceTrends(IN product_id INT, IN days_back INT)
BEGIN
    SELECT 
        DATE(recorded_at) as date,
        s.name as store_name,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price
    FROM price_history ph
    JOIN stores s ON ph.store_id = s.id
    WHERE ph.product_id = product_id
      AND ph.recorded_at >= DATE_SUB(NOW(), INTERVAL days_back DAY)
    GROUP BY DATE(recorded_at), s.name
    ORDER BY date DESC, avg_price ASC;
END //

DELIMITER ;

-- =====================================================
-- SAMPLE DATA (for testing)
-- =====================================================

-- Insert sample products
INSERT INTO products (name, brand, model, category, subcategory, description, gender, search_keywords) VALUES
('Air Max 270', 'Nike', 'Air Max 270', 'shoes', 'running', 'Nike Air Max 270 mens running shoes with air cushioning', 'men', 'nike air max 270 running shoes men'),
('Ultraboost 22', 'Adidas', 'Ultraboost 22', 'shoes', 'running', 'Adidas Ultraboost 22 running shoes with boost technology', 'unisex', 'adidas ultraboost running shoes boost'),
('Chuck Taylor All Star', 'Converse', 'All Star', 'shoes', 'casual', 'Classic Converse Chuck Taylor All Star casual sneakers', 'unisex', 'converse chuck taylor all star casual sneakers');

-- Note: Actual price data will be populated by the scraping system