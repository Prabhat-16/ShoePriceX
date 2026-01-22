/**
 * Search Routes
 * 
 * Defines all search-related API endpoints
 * Handles product search, suggestions, and trending data
 */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { validateSearch } = require('../middleware/validation');

// GET /api/search?q=nike+air+max&page=1&limit=20&brand=nike&category=shoes
router.get('/', validateSearch, searchController.searchProducts);

// GET /api/search/suggestions?q=nike
router.get('/suggestions', searchController.getSearchSuggestions);

// GET /api/search/trending
router.get('/trending', searchController.getTrendingSearches);

module.exports = router;