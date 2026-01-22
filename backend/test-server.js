/**
 * Simple server test without database connection
 * Used to verify API structure and routes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

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
  const { q } = req.query;
  
  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      category: 'shoes',
      primary_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      min_price: 8999,
      max_price: 12999,
      store_count: 4,
      avg_rating: 4.5
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      category: 'shoes',
      primary_image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      min_price: 11999,
      max_price: 16999,
      store_count: 3,
      avg_rating: 4.3
    },
    {
      id: 3,
      name: 'Puma RS-X',
      brand: 'Puma',
      category: 'shoes',
      primary_image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
      min_price: 6499,
      max_price: 8999,
      store_count: 5,
      avg_rating: 4.1
    }
  ];

  res.json({
    success: true,
    message: `Search results for: ${q}`,
    data: {
      products: mockProducts,
      pagination: { 
        page: 1, 
        limit: 20, 
        total: mockProducts.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      filters: { query: q }
    }
  });
});

// Mock search suggestions
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;
  res.json({
    success: true,
    data: {
      query: q,
      suggestions: [
        { text: 'Nike Air Max', type: 'product', brand: 'Nike' },
        { text: 'Adidas Ultraboost', type: 'product', brand: 'Adidas' },
        { text: 'Running Shoes', type: 'category' }
      ]
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
        { query: 'running shoes', search_count: 100 }
      ],
      popular_brands: [
        { brand: 'Nike', product_count: 25, avg_price: '10000', min_price: '5000' },
        { brand: 'Adidas', product_count: 20, avg_price: '12000', min_price: '6000' }
      ]
    }
  });
});

// Mock product detail
app.get('/api/product/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    data: {
      id: parseInt(id),
      name: 'Nike Air Max 270',
      brand: 'Nike',
      model: 'Air Max 270',
      category: 'shoes',
      description: 'The Nike Air Max 270 delivers visible cushioning under every step.',
      primary_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      lowest_price: 8999,
      highest_price: 12999,
      avg_rating: 4.5,
      total_reviews: 1250,
      prices: [
        {
          store_name: 'Amazon',
          price: 8999,
          original_price: 12999,
          discount_percentage: 31,
          availability: 'in_stock',
          product_url: 'https://amazon.in',
          last_scraped: new Date().toISOString()
        },
        {
          store_name: 'Flipkart',
          price: 9499,
          original_price: 12999,
          discount_percentage: 27,
          availability: 'in_stock',
          product_url: 'https://flipkart.com',
          last_scraped: new Date().toISOString()
        }
      ]
    }
  });
});

// Mock price comparison
app.get('/api/compare/:productId', (req, res) => {
  const { productId } = req.params;
  res.json({
    success: true,
    data: {
      product: {
        id: parseInt(productId),
        name: 'Nike Air Max 270',
        brand: 'Nike',
        primary_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
      },
      comparison: [
        {
          store_name: 'Amazon',
          price: 8999,
          original_price: 12999,
          discount_percentage: 31,
          availability: 'in_stock',
          product_url: 'https://amazon.in',
          is_lowest_price: true,
          savings_vs_highest: 3500,
          last_scraped: new Date().toISOString()
        },
        {
          store_name: 'Flipkart',
          price: 9499,
          original_price: 12999,
          discount_percentage: 27,
          availability: 'in_stock',
          product_url: 'https://flipkart.com',
          is_lowest_price: false,
          savings_vs_highest: 3000,
          last_scraped: new Date().toISOString()
        },
        {
          store_name: 'Myntra',
          price: 12499,
          original_price: 12999,
          discount_percentage: 4,
          availability: 'limited_stock',
          product_url: 'https://myntra.com',
          is_lowest_price: false,
          savings_vs_highest: 0,
          last_scraped: new Date().toISOString()
        }
      ],
      summary: {
        lowest_price: 8999,
        highest_price: 12499,
        max_savings: 3500,
        store_count: 3,
        avg_price: 10332,
        last_updated: new Date().toISOString()
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api`);
  console.log(`🔍 Mock search: http://localhost:${PORT}/api/search?q=nike`);
});

module.exports = app;