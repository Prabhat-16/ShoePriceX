/**
 * Product Routes
 * 
 * Defines all product-related API endpoints
 * Handles individual product operations and listings
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProductId } = require('../middleware/validation');

// GET /api/product/filters - Get available filters (categories, brands)
router.get('/filters', productController.getProductFilters);

// GET /api/product?page=1&limit=20&category=shoes&brand=nike
router.get('/', productController.getAllProducts);

// GET /api/product/:id - Get specific product details
router.get('/:id', validateProductId, productController.getProductById);

module.exports = router;