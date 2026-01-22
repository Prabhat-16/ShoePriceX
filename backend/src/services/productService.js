/**
 * Product Service Layer
 * 
 * Handles all product-related database operations and business logic
 * Provides clean interface between controllers and database
 */

const database = require('../config/database');
const logger = require('../utils/logger').createModuleLogger('productService');

class ProductService {
  /**
   * Search products with filters and pagination
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchProducts(searchParams) {
    const {
      q: query,
      page = 1,
      limit = 20,
      brand,
      category,
      minPrice,
      maxPrice,
      sortBy = 'relevance'
    } = searchParams;

    try {
      const offset = (page - 1) * limit;
      
      // Build dynamic WHERE clause
      let whereConditions = ['p.is_active = TRUE'];
      let queryParams = [];
      
      // Full-text search on product name, brand, and keywords
      if (query) {
        whereConditions.push(`(
          MATCH(p.name, p.brand, p.model, p.description, p.search_keywords) AGAINST (? IN NATURAL LANGUAGE MODE)
          OR p.name LIKE ?
          OR p.brand LIKE ?
          OR p.model LIKE ?
        )`);
        queryParams.push(query, `%${query}%`, `%${query}%`, `%${query}%`);
      }
      
      // Brand filter
      if (brand) {
        whereConditions.push('p.brand = ?');
        queryParams.push(brand);
      }
      
      // Category filter
      if (category) {
        whereConditions.push('p.category = ?');
        queryParams.push(category);
      }
      
      // Price range filter (using minimum price from all stores)
      if (minPrice || maxPrice) {
        if (minPrice) {
          whereConditions.push('min_price >= ?');
          queryParams.push(minPrice);
        }
        if (maxPrice) {
          whereConditions.push('min_price <= ?');
          queryParams.push(maxPrice);
        }
      }
      
      // Build ORDER BY clause
      let orderBy = 'p.created_at DESC';
      switch (sortBy) {
        case 'price_asc':
          orderBy = 'min_price ASC';
          break;
        case 'price_desc':
          orderBy = 'min_price DESC';
          break;
        case 'name_asc':
          orderBy = 'p.name ASC';
          break;
        case 'name_desc':
          orderBy = 'p.name DESC';
          break;
        case 'relevance':
          if (query) {
            orderBy = `MATCH(p.name, p.brand, p.model, p.description, p.search_keywords) AGAINST (? IN NATURAL LANGUAGE MODE) DESC, min_price ASC`;
            queryParams.push(query);
          }
          break;
      }
      
      const whereClause = whereConditions.join(' AND ');
      
      // Main search query with price aggregation
      const searchQuery = `
        SELECT 
          p.id,
          p.name,
          p.brand,
          p.model,
          p.category,
          p.subcategory,
          p.description,
          p.primary_image_url,
          p.color,
          p.gender,
          MIN(pr.price) as min_price,
          MAX(pr.price) as max_price,
          COUNT(DISTINCT pr.store_id) as store_count,
          AVG(pr.rating) as avg_rating,
          SUM(pr.review_count) as total_reviews
        FROM products p
        LEFT JOIN prices pr ON p.id = pr.product_id 
          AND pr.availability IN ('in_stock', 'limited_stock')
        WHERE ${whereClause}
        GROUP BY p.id, p.name, p.brand, p.model, p.category, p.subcategory, 
                 p.description, p.primary_image_url, p.color, p.gender
        HAVING store_count > 0 OR ? = 1
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;
      
      // Add parameters for HAVING clause and pagination
      const finalParams = [...queryParams, 1, limit, offset];
      
      // Execute search query
      const products = await database.query(searchQuery, finalParams);
      
      // Count total results for pagination
      const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM products p
        LEFT JOIN prices pr ON p.id = pr.product_id 
          AND pr.availability IN ('in_stock', 'limited_stock')
        WHERE ${whereConditions.join(' AND ')}
        GROUP BY p.id
        HAVING COUNT(DISTINCT pr.store_id) > 0 OR ? = 1
      `;
      
      const countResult = await database.query(countQuery, [...queryParams.slice(0, -3), 1]);
      const total = countResult.length;
      
      // Log search analytics
      await this.logSearchQuery(query, total, searchParams);
      
      return {
        products: products.map(product => ({
          ...product,
          min_price: parseFloat(product.min_price) || null,
          max_price: parseFloat(product.max_price) || null,
          avg_rating: parseFloat(product.avg_rating) || null,
          price_range: product.min_price && product.max_price 
            ? `₹${product.min_price} - ₹${product.max_price}`
            : null
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          query,
          brand,
          category,
          minPrice,
          maxPrice,
          sortBy
        }
      };
      
    } catch (error) {
      logger.error('Error searching products', { 
        error: error.message, 
        searchParams 
      });
      throw error;
    }
  }

  /**
   * Get product details by ID with all store prices
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product details with prices
   */
  async getProductById(productId) {
    try {
      // Get product details
      const productQuery = `
        SELECT 
          p.*,
          COUNT(DISTINCT pr.store_id) as available_stores,
          MIN(pr.price) as lowest_price,
          MAX(pr.price) as highest_price,
          AVG(pr.rating) as avg_rating,
          SUM(pr.review_count) as total_reviews
        FROM products p
        LEFT JOIN prices pr ON p.id = pr.product_id 
          AND pr.availability IN ('in_stock', 'limited_stock')
        WHERE p.id = ? AND p.is_active = TRUE
        GROUP BY p.id
      `;
      
      const products = await database.query(productQuery, [productId]);
      
      if (products.length === 0) {
        return null;
      }
      
      const product = products[0];
      
      // Get all store prices for this product
      const pricesQuery = `
        SELECT 
          pr.*,
          s.name as store_name,
          s.logo_url as store_logo,
          s.base_url as store_base_url
        FROM prices pr
        JOIN stores s ON pr.store_id = s.id
        WHERE pr.product_id = ? AND s.is_active = TRUE
        ORDER BY pr.price ASC
      `;
      
      const prices = await database.query(pricesQuery, [productId]);
      
      // Get price history for trends (last 30 days)
      const historyQuery = `
        SELECT 
          DATE(ph.recorded_at) as date,
          s.name as store_name,
          AVG(ph.price) as avg_price,
          MIN(ph.price) as min_price,
          MAX(ph.price) as max_price
        FROM price_history ph
        JOIN stores s ON ph.store_id = s.id
        WHERE ph.product_id = ? 
          AND ph.recorded_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(ph.recorded_at), s.name
        ORDER BY date DESC
        LIMIT 30
      `;
      
      const priceHistory = await database.query(historyQuery, [productId]);
      
      return {
        ...product,
        lowest_price: parseFloat(product.lowest_price) || null,
        highest_price: parseFloat(product.highest_price) || null,
        avg_rating: parseFloat(product.avg_rating) || null,
        sizes: product.sizes ? JSON.parse(product.sizes) : [],
        features: product.features ? JSON.parse(product.features) : {},
        prices: prices.map(price => ({
          ...price,
          price: parseFloat(price.price),
          original_price: parseFloat(price.original_price) || null,
          discount_percentage: parseFloat(price.discount_percentage) || null,
          size_availability: price.size_availability ? JSON.parse(price.size_availability) : null
        })),
        price_history: priceHistory.map(history => ({
          ...history,
          avg_price: parseFloat(history.avg_price),
          min_price: parseFloat(history.min_price),
          max_price: parseFloat(history.max_price)
        }))
      };
      
    } catch (error) {
      logger.error('Error getting product by ID', { 
        error: error.message, 
        productId 
      });
      throw error;
    }
  }

  /**
   * Get price comparison for a specific product
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Price comparison data
   */
  async getProductComparison(productId) {
    try {
      // Verify product exists
      const product = await this.getProductById(productId);
      if (!product) {
        return null;
      }
      
      // Get detailed price comparison
      const comparisonQuery = `
        SELECT 
          pr.*,
          s.name as store_name,
          s.logo_url as store_logo,
          s.base_url as store_base_url,
          RANK() OVER (ORDER BY pr.price ASC) as price_rank,
          CASE 
            WHEN pr.price = (SELECT MIN(price) FROM prices WHERE product_id = pr.product_id AND availability IN ('in_stock', 'limited_stock'))
            THEN TRUE 
            ELSE FALSE 
          END as is_lowest_price
        FROM prices pr
        JOIN stores s ON pr.store_id = s.id
        WHERE pr.product_id = ? AND s.is_active = TRUE
        ORDER BY pr.price ASC, pr.last_scraped DESC
      `;
      
      const comparison = await database.query(comparisonQuery, [productId]);
      
      // Calculate savings compared to highest price
      const prices = comparison.map(item => parseFloat(item.price));
      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      const maxSavings = highestPrice - lowestPrice;
      
      return {
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          model: product.model,
          primary_image_url: product.primary_image_url
        },
        comparison: comparison.map(item => ({
          ...item,
          price: parseFloat(item.price),
          original_price: parseFloat(item.original_price) || null,
          discount_percentage: parseFloat(item.discount_percentage) || null,
          savings_vs_highest: highestPrice - parseFloat(item.price),
          size_availability: item.size_availability ? JSON.parse(item.size_availability) : null
        })),
        summary: {
          lowest_price: lowestPrice,
          highest_price: highestPrice,
          max_savings: maxSavings,
          store_count: comparison.length,
          avg_price: prices.reduce((sum, price) => sum + price, 0) / prices.length,
          last_updated: comparison[0]?.last_scraped || null
        }
      };
      
    } catch (error) {
      logger.error('Error getting product comparison', { 
        error: error.message, 
        productId 
      });
      throw error;
    }
  }

  /**
   * Log search query for analytics
   * @param {string} query - Search query
   * @param {number} resultCount - Number of results
   * @param {Object} params - Search parameters
   */
  async logSearchQuery(query, resultCount, params) {
    try {
      const insertQuery = `
        INSERT INTO search_queries (query, normalized_query, results_count, user_ip)
        VALUES (?, ?, ?, ?)
      `;
      
      const normalizedQuery = query?.toLowerCase().trim();
      
      await database.query(insertQuery, [
        query,
        normalizedQuery,
        resultCount,
        params.userIp || 'unknown'
      ]);
      
    } catch (error) {
      // Don't throw error for analytics logging failure
      logger.warn('Failed to log search query', { 
        error: error.message, 
        query 
      });
    }
  }
}

module.exports = new ProductService();