/**
 * Simple server test without database connection
 * Used to verify API structure and routes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { mockProducts, generateMockProducts } = require('./src/utils/mockData');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test routes without database
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Shoe Price Comparison API',
    version: '1.0.0',
    endpoints: {
      search: 'GET /api/search?q={query}',
      product: 'GET /api/product/:id',
      compare: 'GET /api/compare/:productId',
      health: 'GET /health'
    },
    status: 'API structure ready'
  });
});

// Mock search endpoint
app.get('/api/search', (req, res) => {
  const { q, brand, category, minPrice, maxPrice, sortBy = 'relevance', page = 1, limit = 20 } = req.query;

  // Filter products based on search query
  let filteredProducts = mockProducts;

  // Search by query (name, brand, model, keywords)
  if (q && q.trim()) {
    const searchTerm = q.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.model.toLowerCase().includes(searchTerm) ||
      product.search_keywords.toLowerCase().includes(searchTerm) ||
      (product.category && product.category.toLowerCase().includes(searchTerm)) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm))
    );
  }

  // Filter by brand
  if (brand && brand.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.brand.toLowerCase() === brand.toLowerCase().trim()
    );
  }

  // Filter by category
  if (category && category.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase().trim()
    );
  }

  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.min_price >= parseInt(minPrice)
    );
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.min_price <= parseInt(maxPrice)
    );
  }

  // Apply sorting
  switch (sortBy) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.min_price - b.min_price);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.min_price - a.min_price);
      break;
    case 'name_asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name_desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'rating_desc':
      filteredProducts.sort((a, b) => b.avg_rating - a.avg_rating);
      break;
    default: // relevance
      // Simple relevance sort logic already mostly handled by filter order, but could be enhanced
      break;
  }
  
  // DYNAMIC FALLBACK: If no results, generate them!
  if (filteredProducts.length === 0 && (q || brand)) {
    const queryTerm = q || brand;
    console.log(`[INFO] Attempting fallback generation for: "${queryTerm}"`);
    // Mock generation
    filteredProducts = generateMockProducts(queryTerm);
      
    // Apply filters again to generated products just in case
    if (minPrice) filteredProducts = filteredProducts.filter(p => p.min_price >= parseInt(minPrice));
    if (maxPrice) filteredProducts = filteredProducts.filter(p => p.min_price <= parseInt(maxPrice));
    
    // Apply sorting again
    if (sortBy === 'price_asc') filteredProducts.sort((a, b) => a.min_price - b.min_price);
    if (sortBy === 'price_desc') filteredProducts.sort((a, b) => b.min_price - a.min_price);
    
    console.log(`[INFO] Generated ${filteredProducts.length} fallback products`);
  }

  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / limitNum);

  console.log(`[INFO] Returning ${paginatedProducts.length} products (Total: ${filteredProducts.length})`);

  res.json({
    success: true,
    message: `Found ${filteredProducts.length} products${q ? ` for "${q}"` : ''}`,
    data: {
      products: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredProducts.length,
        totalPages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: {
        query: q,
        brand,
        category,
        minPrice,
        maxPrice,
        sortBy
      }
    }
  });
});

// Mock search suggestions
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;

  const allSuggestions = [
    { text: 'Nike Air Max', type: 'product', brand: 'Nike' },
    { text: 'Nike Air Force 1', type: 'product', brand: 'Nike' },
    { text: 'Nike React', type: 'product', brand: 'Nike' },
    { text: 'Nike Dunk', type: 'product', brand: 'Nike' },
    { text: 'Adidas Ultraboost', type: 'product', brand: 'Adidas' },
    { text: 'Adidas Stan Smith', type: 'product', brand: 'Adidas' },
    { text: 'Adidas NMD', type: 'product', brand: 'Adidas' },
    { text: 'Adidas Gazelle', type: 'product', brand: 'Adidas' },
    { text: 'Puma RS-X', type: 'product', brand: 'Puma' },
    { text: 'Puma Suede', type: 'product', brand: 'Puma' },
    { text: 'Converse Chuck Taylor', type: 'product', brand: 'Converse' },
    { text: 'New Balance 990', type: 'product', brand: 'New Balance' },
    { text: 'Vans Old Skool', type: 'product', brand: 'Vans' },
    { text: 'Air Jordan 1', type: 'product', brand: 'Jordan' },
    { text: 'Running Shoes', type: 'category' },
    { text: 'Casual Shoes', type: 'category' },
    { text: 'Basketball Shoes', type: 'category' },
    { text: 'Training Shoes', type: 'category' },
    { text: 'Nike', type: 'brand' },
    { text: 'Adidas', type: 'brand' },
    { text: 'Puma', type: 'brand' },
    { text: 'Converse', type: 'brand' },
    { text: 'New Balance', type: 'brand' },
    { text: 'Vans', type: 'brand' },
    { text: 'Jordan', type: 'brand' },
    { text: 'Reebok', type: 'brand' }
  ];

  let filteredSuggestions = allSuggestions;

  if (q && q.trim()) {
    const searchTerm = q.toLowerCase().trim();
    filteredSuggestions = allSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(searchTerm)
    ).slice(0, 8);
  } else {
    filteredSuggestions = allSuggestions.slice(0, 6);
  }

  res.json({
    success: true,
    data: {
      query: q,
      suggestions: filteredSuggestions
    }
  });
});

// Mock trending searches
app.get('/api/search/trending', (req, res) => {
  res.json({
    success: true,
    data: {
      trending_searches: [
        { query: 'nike air max', search_count: 150 },
        { query: 'adidas ultraboost', search_count: 120 },
        { query: 'running shoes', search_count: 100 },
        { query: 'converse chuck taylor', search_count: 85 },
        { query: 'vans old skool', search_count: 75 },
        { query: 'air jordan 1', search_count: 70 },
        { query: 'nike air force 1', search_count: 65 },
        { query: 'adidas stan smith', search_count: 60 },
        { query: 'puma suede', search_count: 45 },
        { query: 'new balance 574', search_count: 40 }
      ],
      popular_brands: [
        { brand: 'Nike', product_count: 25, avg_price: '10000', min_price: '5000' },
        { brand: 'Adidas', product_count: 20, avg_price: '12000', min_price: '6000' },
        { brand: 'Puma', product_count: 15, avg_price: '8000', min_price: '4000' },
        { brand: 'Converse', product_count: 12, avg_price: '6000', min_price: '3000' },
        { brand: 'Vans', product_count: 10, avg_price: '7000', min_price: '4000' },
        { brand: 'New Balance', product_count: 8, avg_price: '11000', min_price: '7000' }
      ]
    }
  });
});

// Mock product detail
app.get('/api/product/:id', (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);

  const product = mockProducts.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    // Try to "generate" one for detail view if it looks like a generated ID > 5000
    if (productId > 5000) {
        // Recover some info from ID or random
        const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Bata'];
        const brand = brands[productId % brands.length];
        const generated = {
            id: productId,
            name: `${brand} Dynamic Shoe`,
            brand: brand,
            model: `Dynamic ${productId}`,
            category: 'shoes',
            subcategory: 'casual',
            description: 'A dynamically generated shoe detail for fallback.',
            primary_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
            min_price: 5000,
            max_price: 7000,
            store_count: 3,
            avg_rating: 4.0,
            total_reviews: 10,
            search_keywords: 'generated mock shoe'
        };
        res.json(generated);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
  }
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📖 API info: http://localhost:${PORT}/api`);
    console.log(`🔍 Mock search: http://localhost:${PORT}/api/search?q=nike`);
});