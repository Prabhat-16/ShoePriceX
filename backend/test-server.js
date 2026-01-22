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
  const { q, brand, category, minPrice, maxPrice, sortBy = 'relevance', page = 1, limit = 20 } = req.query;
  
  // Comprehensive mock product database
  const allMockProducts = [
    // Nike Products
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      model: 'Air Max 270',
      category: 'running',
      subcategory: 'lifestyle',
      gender: 'unisex',
      color: 'Black/White',
      primary_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      min_price: 8999,
      max_price: 12999,
      store_count: 4,
      avg_rating: 4.5,
      search_keywords: 'nike air max 270 running lifestyle black white'
    },
    {
      id: 2,
      name: 'Nike Air Force 1',
      brand: 'Nike',
      model: 'Air Force 1',
      category: 'casual',
      subcategory: 'lifestyle',
      gender: 'unisex',
      color: 'White',
      primary_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      min_price: 7999,
      max_price: 10999,
      store_count: 5,
      avg_rating: 4.7,
      search_keywords: 'nike air force 1 casual lifestyle white classic'
    },
    {
      id: 3,
      name: 'Nike React Infinity Run',
      brand: 'Nike',
      model: 'React Infinity Run',
      category: 'running',
      subcategory: 'performance',
      gender: 'unisex',
      color: 'Blue/Black',
      primary_image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      min_price: 12999,
      max_price: 16999,
      store_count: 3,
      avg_rating: 4.4,
      search_keywords: 'nike react infinity run running performance blue black'
    },
    {
      id: 4,
      name: 'Nike Dunk Low',
      brand: 'Nike',
      model: 'Dunk Low',
      category: 'casual',
      subcategory: 'streetwear',
      gender: 'unisex',
      color: 'White/Black',
      primary_image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      min_price: 8499,
      max_price: 11999,
      store_count: 4,
      avg_rating: 4.6,
      search_keywords: 'nike dunk low casual streetwear white black'
    },
    
    // Adidas Products
    {
      id: 5,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      model: 'Ultraboost 22',
      category: 'running',
      subcategory: 'performance',
      gender: 'unisex',
      color: 'Core Black',
      primary_image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      min_price: 11999,
      max_price: 16999,
      store_count: 3,
      avg_rating: 4.3,
      search_keywords: 'adidas ultraboost 22 running performance core black boost'
    },
    {
      id: 6,
      name: 'Adidas Stan Smith',
      brand: 'Adidas',
      model: 'Stan Smith',
      category: 'casual',
      subcategory: 'lifestyle',
      gender: 'unisex',
      color: 'White/Green',
      primary_image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
      min_price: 6999,
      max_price: 9999,
      store_count: 5,
      avg_rating: 4.5,
      search_keywords: 'adidas stan smith casual lifestyle white green classic'
    },
    {
      id: 7,
      name: 'Adidas NMD R1',
      brand: 'Adidas',
      model: 'NMD R1',
      category: 'casual',
      subcategory: 'streetwear',
      gender: 'unisex',
      color: 'Triple Black',
      primary_image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
      min_price: 9999,
      max_price: 13999,
      store_count: 4,
      avg_rating: 4.2,
      search_keywords: 'adidas nmd r1 casual streetwear triple black boost'
    },
    {
      id: 8,
      name: 'Adidas Gazelle',
      brand: 'Adidas',
      model: 'Gazelle',
      category: 'casual',
      subcategory: 'retro',
      gender: 'unisex',
      color: 'Navy/White',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
      min_price: 5999,
      max_price: 8999,
      store_count: 4,
      avg_rating: 4.4,
      search_keywords: 'adidas gazelle casual retro navy white suede'
    },
    
    // Puma Products
    {
      id: 9,
      name: 'Puma RS-X',
      brand: 'Puma',
      model: 'RS-X',
      category: 'casual',
      subcategory: 'chunky',
      gender: 'unisex',
      color: 'White/Multi',
      primary_image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
      min_price: 6499,
      max_price: 8999,
      store_count: 5,
      avg_rating: 4.1,
      search_keywords: 'puma rs-x casual chunky white multi retro'
    },
    {
      id: 10,
      name: 'Puma Suede Classic',
      brand: 'Puma',
      model: 'Suede Classic',
      category: 'casual',
      subcategory: 'lifestyle',
      gender: 'unisex',
      color: 'Red/White',
      primary_image_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
      min_price: 4999,
      max_price: 7999,
      store_count: 4,
      avg_rating: 4.3,
      search_keywords: 'puma suede classic casual lifestyle red white vintage'
    },
    {
      id: 11,
      name: 'Puma Future Rider',
      brand: 'Puma',
      model: 'Future Rider',
      category: 'running',
      subcategory: 'retro',
      gender: 'unisex',
      color: 'Black/Yellow',
      primary_image_url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400',
      min_price: 5499,
      max_price: 8499,
      store_count: 3,
      avg_rating: 4.0,
      search_keywords: 'puma future rider running retro black yellow'
    },
    
    // Converse Products
    {
      id: 12,
      name: 'Converse Chuck Taylor All Star',
      brand: 'Converse',
      model: 'Chuck Taylor All Star',
      category: 'casual',
      subcategory: 'classic',
      gender: 'unisex',
      color: 'Black',
      primary_image_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400',
      min_price: 3999,
      max_price: 5999,
      store_count: 5,
      avg_rating: 4.6,
      search_keywords: 'converse chuck taylor all star casual classic black canvas'
    },
    {
      id: 13,
      name: 'Converse Chuck 70',
      brand: 'Converse',
      model: 'Chuck 70',
      category: 'casual',
      subcategory: 'premium',
      gender: 'unisex',
      color: 'White',
      primary_image_url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400',
      min_price: 5999,
      max_price: 8999,
      store_count: 4,
      avg_rating: 4.5,
      search_keywords: 'converse chuck 70 casual premium white canvas vintage'
    },
    
    // New Balance Products
    {
      id: 14,
      name: 'New Balance 990v5',
      brand: 'New Balance',
      model: '990v5',
      category: 'running',
      subcategory: 'premium',
      gender: 'unisex',
      color: 'Grey',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      min_price: 15999,
      max_price: 19999,
      store_count: 3,
      avg_rating: 4.7,
      search_keywords: 'new balance 990v5 running premium grey made usa'
    },
    {
      id: 15,
      name: 'New Balance 574',
      brand: 'New Balance',
      model: '574',
      category: 'casual',
      subcategory: 'lifestyle',
      gender: 'unisex',
      color: 'Navy/Grey',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
      min_price: 6999,
      max_price: 9999,
      store_count: 4,
      avg_rating: 4.2,
      search_keywords: 'new balance 574 casual lifestyle navy grey retro'
    },
    
    // Vans Products
    {
      id: 16,
      name: 'Vans Old Skool',
      brand: 'Vans',
      model: 'Old Skool',
      category: 'casual',
      subcategory: 'skate',
      gender: 'unisex',
      color: 'Black/White',
      primary_image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
      min_price: 4999,
      max_price: 7999,
      store_count: 5,
      avg_rating: 4.4,
      search_keywords: 'vans old skool casual skate black white stripe'
    },
    {
      id: 17,
      name: 'Vans Authentic',
      brand: 'Vans',
      model: 'Authentic',
      category: 'casual',
      subcategory: 'classic',
      gender: 'unisex',
      color: 'Red',
      primary_image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
      min_price: 3999,
      max_price: 6999,
      store_count: 4,
      avg_rating: 4.3,
      search_keywords: 'vans authentic casual classic red canvas skate'
    },
    
    // Reebok Products
    {
      id: 18,
      name: 'Reebok Classic Leather',
      brand: 'Reebok',
      model: 'Classic Leather',
      category: 'casual',
      subcategory: 'retro',
      gender: 'unisex',
      color: 'White',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      min_price: 5499,
      max_price: 8499,
      store_count: 4,
      avg_rating: 4.1,
      search_keywords: 'reebok classic leather casual retro white vintage'
    },
    {
      id: 19,
      name: 'Reebok Nano X',
      brand: 'Reebok',
      model: 'Nano X',
      category: 'training',
      subcategory: 'crossfit',
      gender: 'unisex',
      color: 'Black/Red',
      primary_image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      min_price: 9999,
      max_price: 13999,
      store_count: 3,
      avg_rating: 4.5,
      search_keywords: 'reebok nano x training crossfit black red fitness'
    },
    
    // Jordan Products
    {
      id: 20,
      name: 'Air Jordan 1 Low',
      brand: 'Jordan',
      model: 'Air Jordan 1 Low',
      category: 'casual',
      subcategory: 'basketball',
      gender: 'unisex',
      color: 'Chicago',
      primary_image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      min_price: 9999,
      max_price: 14999,
      store_count: 4,
      avg_rating: 4.8,
      search_keywords: 'air jordan 1 low casual basketball chicago red white black'
    }
  ];

  // Filter products based on search query
  let filteredProducts = allMockProducts;

  // Search by query (name, brand, model, keywords)
  if (q && q.trim()) {
    const searchTerm = q.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.model.toLowerCase().includes(searchTerm) ||
      product.search_keywords.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.subcategory.toLowerCase().includes(searchTerm)
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

  // Sort products
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
      if (q && q.trim()) {
        const searchTerm = q.toLowerCase().trim();
        filteredProducts.sort((a, b) => {
          const aScore = (a.name.toLowerCase().includes(searchTerm) ? 10 : 0) +
                        (a.brand.toLowerCase().includes(searchTerm) ? 8 : 0) +
                        (a.model.toLowerCase().includes(searchTerm) ? 6 : 0);
          const bScore = (b.name.toLowerCase().includes(searchTerm) ? 10 : 0) +
                        (b.brand.toLowerCase().includes(searchTerm) ? 8 : 0) +
                        (b.model.toLowerCase().includes(searchTerm) ? 6 : 0);
          return bScore - aScore;
        });
      }
  }

  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / limitNum);

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