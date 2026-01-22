/**
 * Search Controller
 * 
 * Handles search-related HTTP requests and responses
 * Coordinates between routes and services
 */

const productService = require('../services/productService');
const database = require('../config/database');
const logger = require('../utils/logger').createModuleLogger('searchController');

class SearchController {
  /**
   * Search products across all stores
   * GET /api/search?q=nike+air+max&page=1&limit=20
   */
  async searchProducts(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Add user IP for analytics
      const searchParams = {
        ...req.query,
        userIp: req.ip
      };
      
      logger.info('Product search initiated', {
        query: req.query.q,
        filters: {
          brand: req.query.brand,
          category: req.query.category,
          priceRange: req.query.minPrice || req.query.maxPrice ? 
            `${req.query.minPrice || 0}-${req.query.maxPrice || '∞'}` : null
        },
        pagination: {
          page: req.query.page || 1,
          limit: req.query.limit || 20
        },
        userIp: req.ip
      });
      
      const results = await productService.searchProducts(searchParams);
      const responseTime = Date.now() - startTime;
      
      // Log successful search
      logger.info('Product search completed', {
        query: req.query.q,
        resultCount: results.products.length,
        totalResults: results.pagination.total,
        responseTime: `${responseTime}ms`
      });
      
      res.status(200).json({
        success: true,
        message: `Found ${results.pagination.total} products`,
        data: results,
        meta: {
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      logger.error('Search products error', {
        error: error.message,
        query: req.query.q,
        stack: error.stack
      });
      next(error);
    }
  }

  /**
   * Get search suggestions/autocomplete
   * GET /api/search/suggestions?q=nike
   */
  async getSearchSuggestions(req, res, next) {
    try {
      const { q: query } = req.query;
      
      if (!query || query.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Query must be at least 2 characters long'
        });
      }
      
      // Get suggestions from products and brands
      const suggestionsQuery = `
        SELECT DISTINCT 
          p.name as suggestion,
          'product' as type,
          p.brand,
          COUNT(*) as frequency
        FROM products p
        WHERE p.name LIKE ? AND p.is_active = TRUE
        GROUP BY p.name, p.brand
        
        UNION
        
        SELECT DISTINCT 
          p.brand as suggestion,
          'brand' as type,
          NULL as brand,
          COUNT(*) as frequency
        FROM products p
        WHERE p.brand LIKE ? AND p.is_active = TRUE
        GROUP BY p.brand
        
        ORDER BY frequency DESC, suggestion ASC
        LIMIT 10
      `;
      
      const suggestions = await database.query(suggestionsQuery, [
        `%${query}%`,
        `%${query}%`
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          query,
          suggestions: suggestions.map(item => ({
            text: item.suggestion,
            type: item.type,
            brand: item.brand,
            frequency: item.frequency
          }))
        }
      });
      
    } catch (error) {
      logger.error('Get search suggestions error', {
        error: error.message,
        query: req.query.q
      });
      next(error);
    }
  }

  /**
   * Get popular searches and trending products
   * GET /api/search/trending
   */
  async getTrendingSearches(req, res, next) {
    try {
      // Get popular search queries from last 7 days
      const trendingQuery = `
        SELECT 
          normalized_query as query,
          COUNT(*) as search_count,
          AVG(results_count) as avg_results
        FROM search_queries
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          AND results_count > 0
        GROUP BY normalized_query
        HAVING search_count >= 2
        ORDER BY search_count DESC, avg_results DESC
        LIMIT 10
      `;
      
      const trending = await database.query(trendingQuery);
      
      // Get popular brands
      const popularBrandsQuery = `
        SELECT 
          p.brand,
          COUNT(DISTINCT p.id) as product_count,
          AVG(pr.price) as avg_price,
          MIN(pr.price) as min_price
        FROM products p
        JOIN prices pr ON p.id = pr.product_id
        WHERE p.is_active = TRUE 
          AND pr.availability IN ('in_stock', 'limited_stock')
        GROUP BY p.brand
        HAVING product_count >= 3
        ORDER BY product_count DESC
        LIMIT 8
      `;
      
      const popularBrands = await database.query(popularBrandsQuery);
      
      res.status(200).json({
        success: true,
        data: {
          trending_searches: trending.map(item => ({
            query: item.query,
            search_count: item.search_count,
            avg_results: Math.round(item.avg_results)
          })),
          popular_brands: popularBrands.map(item => ({
            brand: item.brand,
            product_count: item.product_count,
            avg_price: parseFloat(item.avg_price).toFixed(2),
            min_price: parseFloat(item.min_price).toFixed(2)
          }))
        }
      });
      
    } catch (error) {
      logger.error('Get trending searches error', {
        error: error.message
      });
      next(error);
    }
  }
}

module.exports = new SearchController();