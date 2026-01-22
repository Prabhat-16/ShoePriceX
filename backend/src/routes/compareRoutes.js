/**
 * Compare Routes
 * 
 * Defines all price comparison API endpoints
 * Handles single and multiple product comparisons
 */

const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compareController');
const { validateCompare, validate } = require('../middleware/validation');
const Joi = require('joi');

// Validation schema for multiple product comparison
const multipleCompareSchema = Joi.object({
  productIds: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(1)
    .max(5)
    .required()
    .messages({
      'array.min': 'At least 1 product ID is required',
      'array.max': 'Maximum 5 products can be compared',
      'any.required': 'Product IDs array is required'
    })
});

// GET /api/compare/:productId - Compare prices for a single product
router.get('/:productId', validateCompare, compareController.compareProductPrices);

// POST /api/compare/multiple - Compare multiple products side by side
router.post('/multiple', 
  validate(multipleCompareSchema, 'body'), 
  compareController.compareMultipleProducts
);

// GET /api/compare/:productId/alerts - Get price alert suggestions
router.get('/:productId/alerts', validateCompare, compareController.getPriceAlerts);

module.exports = router;