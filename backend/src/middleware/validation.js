/**
 * Request Validation Middleware
 * 
 * Uses Joi for request validation with custom error handling
 * Validates query parameters, body, and URL parameters
 */

const Joi = require('joi');
const logger = require('../utils/logger').createModuleLogger('validation');

/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert types when possible
    });

    if (error) {
      logger.warn('Validation failed', {
        property,
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        })),
        url: req.originalUrl,
        method: req.method
      });

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, '')
        }))
      });
    }

    // Replace the request property with validated and sanitized value
    req[property] = value;
    next();
  };
};

// Search validation schema
const searchSchema = Joi.object({
  q: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.min': 'Search query must be at least 2 characters long',
      'string.max': 'Search query cannot exceed 100 characters',
      'any.required': 'Search query is required'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1',
      'number.max': 'Page cannot exceed 100'
    }),
    
  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(20)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    }),
    
  brand: Joi.string()
    .max(50)
    .trim()
    .optional(),
    
  category: Joi.string()
    .valid('shoes', 'sneakers', 'boots', 'sandals', 'formal')
    .optional(),
    
  minPrice: Joi.number()
    .min(0)
    .max(100000)
    .optional(),
    
  maxPrice: Joi.number()
    .min(0)
    .max(100000)
    .optional(),
    
  sortBy: Joi.string()
    .valid('price_asc', 'price_desc', 'name_asc', 'name_desc', 'relevance')
    .default('relevance')
    .optional()
});

// Product ID validation schema
const productIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Product ID must be a number',
      'number.min': 'Product ID must be a positive number',
      'any.required': 'Product ID is required'
    })
});

// Store ID validation schema
const storeIdSchema = Joi.object({
  storeId: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Store ID must be a number',
      'number.min': 'Store ID must be a positive number'
    })
});

// Price comparison validation schema
const compareSchema = Joi.object({
  productId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Product ID must be a number',
      'number.min': 'Product ID must be a positive number',
      'any.required': 'Product ID is required'
    })
});

// Export validation middleware functions
module.exports = {
  validate,
  validateSearch: validate(searchSchema, 'query'),
  validateProductId: validate(productIdSchema, 'params'),
  validateStoreId: validate(storeIdSchema, 'params'),
  validateCompare: validate(compareSchema, 'params'),
  
  // Export schemas for reuse
  schemas: {
    searchSchema,
    productIdSchema,
    storeIdSchema,
    compareSchema
  }
};