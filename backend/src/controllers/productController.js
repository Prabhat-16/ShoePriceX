/**
 * Product Controller
 * 
 * Handles product-related HTTP requests
 * Manages individual product operations and details
 */

const productService = require('../services/productService');
const database = require('../config/database');
const logger = require('../utils/logger').createModuleLogger('productController');

class ProductController {
  /**
   * Get product details by ID
   * GET /api/product/:id
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const startTime = Date.now();
      
      logger.info('Fetching product details', { productId: id });
      
      const product = await productService.getProductById(parseInt(id));
      const responseTime = Date.now() - startTime;
      
      if (!product) {
        logger.warn('Product not found', { productId: id });
        return res.status(404).json({
          success: false,
          error: 'Product not found',
          productId: id
        });
      }
      
      logger.info('Product details retrieved successfully', {
        productId: id,
        productName: product.name,
        storeCount: product.prices?.length || 0,
        responseTime: `${responseTime}ms`
      });
      
      res.status(200).json({
        success: true,
        data: product,
        meta: {
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          storeCount: product.prices?.length || 0
        }
      });
      
    } catch (error) {
      logger.error('Get product by ID error', {
        error: error.message,
        productId: req.params.id,
        stack: error.stack
      });
      next(error);
    }
  }

  /**
   * Get all products with pagination
   * GET /api/product?page=1&limit=20&category=shoes
   */
  async getAllProducts(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        brand,
        sortBy = 'created_at_desc'
      } = req.query;
      
      const startTime = Date.now();
      
      logger.info('Fetching all products', {
        pagination: { page, limit },
        filters: { category, brand, sortBy }
      });
      
      // Build query conditions
      let whereConditions = ['p.is_active = TRUE'];
      let queryParams = [];
      
      if (category) {
        whereConditions.push('p.category = ?');
        queryParams.push(category);
      }
      
      if (brand) {
        whereConditions.push('p.brand = ?');
        queryParams.push(brand);
      }
      
      // Build ORDER BY clause
      let orderBy = 'p.created_at DESC';
      switch (sortBy) {
        case 'name_asc':
          orderBy = 'p.name ASC';
          break;
        case 'name_desc':
          orderBy = 'p.name DESC';
          break;
        case 'brand_asc':
          orderBy = 'p.brand ASC, p.name ASC';
          break;
        case 'price_asc':
          orderBy = 'min_price ASC';
          break;
        case 'price_desc':
          orderBy = 'min_price DESC';
          break;
        case 'created_at_asc':
          orderBy = 'p.created_at ASC';
          break;
        default:
          orderBy = 'p.created_at DESC';
      }
      
      const offset = (page - 1) * limit;
      const whereClause = whereConditions.join(' AND ');
      
      // Get products with price information
      const productsQuery = `
        SELECT 
          p.id,
          p.name,
          p.brand,
          p.model,
          p.category,
          p.subcategory,
          p.primary_image_url,
          p.color,
          p.gender,
          p.created_at,
          MIN(pr.price) as min_price,
          MAX(pr.price) as max_price,
          COUNT(DISTINCT pr.store_id) as store_count,
          AVG(pr.rating) as avg_rating
        FROM products p
        LEFT JOIN prices pr ON p.id = pr.product_id 
          AND pr.availability IN ('in_stock', 'limited_stock')
        WHERE ${whereClause}
        GROUP BY p.id, p.name, p.brand, p.model, p.category, p.subcategory,
                 p.primary_image_url, p.color, p.gender, p.created_at
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;
      
      const products = await database.query(productsQuery, [...queryParams, limit, offset]);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(DISTINCT p.id) as total
        FROM products p
        WHERE ${whereClause}
      `;
      
      const countResult = await database.query(countQuery, queryParams);
      const total = countResult[0].total;
      const responseTime = Date.now() - startTime;
      
      logger.info('Products retrieved successfully', {
        count: products.length,
        total,
        responseTime: `${responseTime}ms`
      });
      
      res.status(200).json({
        success: true,
        data: {
          products: products.map(product => ({
            ...product,
            min_price: parseFloat(product.min_price) || null,
            max_price: parseFloat(product.max_price) || null,
            avg_rating: parseFloat(product.avg_rating) || null
          })),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        },
        meta: {
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      logger.error('Get all products error', {
        error: error.message,
        query: req.query
      });
      next(error);
    }
  }

  /**
   * Get product categories and brands for filters
   * GET /api/product/filters
   */
  async getProductFilters(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Get available categories
      const categoriesQuery = `
        SELECT 
          category,
          subcategory,
          COUNT(*) as product_count
        FROM products
        WHERE is_active = TRUE
        GROUP BY category, subcategory
        ORDER BY category, subcategory
      `;
      
      // Get available brands
      const brandsQuery = `
        SELECT 
          brand,
          COUNT(*) as product_count,
          MIN(pr.price) as min_price,
          MAX(pr.price) as max_price
        FROM products p
        LEFT JOIN prices pr ON p.id = pr.product_id
        WHERE p.is_active = TRUE
        GROUP BY brand
        HAVING product_count > 0
        ORDER BY brand
      `;
      
      const [categories, brands] = await Promise.all([
        database.query(categoriesQuery),
        database.query(brandsQuery)
      ]);
      
      const responseTime = Date.now() - startTime;
      
      // Group categories by main category
      const groupedCategories = categories.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        if (item.subcategory) {
          acc[item.category].push({
            name: item.subcategory,
            count: item.product_count
          });
        }
        return acc;
      }, {});
      
      res.status(200).json({
        success: true,
        data: {
          categories: Object.keys(groupedCategories).map(category => ({
            name: category,
            subcategories: groupedCategories[category],
            total_count: groupedCategories[category].reduce((sum, sub) => sum + sub.count, 0)
          })),
          brands: brands.map(brand => ({
            name: brand.brand,
            product_count: brand.product_count,
            price_range: {
              min: parseFloat(brand.min_price) || null,
              max: parseFloat(brand.max_price) || null
            }
          }))
        },
        meta: {
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      logger.error('Get product filters error', {
        error: error.message
      });
      next(error);
    }
  }
}

module.exports = new ProductController();