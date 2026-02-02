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
  const productId = parseInt(id);

  // Use the same product database as search
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
      description: 'The Nike Air Max 270 delivers visible cushioning under every step with the largest Air unit yet. Inspired by the Air Max 93 and Air Max 180, it features a sleek silhouette with bold colors.',
      primary_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      min_price: 8999,
      max_price: 12999,
      store_count: 4,
      avg_rating: 4.5,
      total_reviews: 1250,
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
      description: 'The Nike Air Force 1 \'07 is the basketball original. This classic silhouette pairs crisp leather with playful colors and a hoops-inspired look.',
      primary_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      min_price: 7999,
      max_price: 10999,
      store_count: 5,
      avg_rating: 4.7,
      total_reviews: 2100,
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
      description: 'The Nike React Infinity Run Flyknit is designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.',
      primary_image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      min_price: 12999,
      max_price: 16999,
      store_count: 3,
      avg_rating: 4.4,
      total_reviews: 890,
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
      description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.',
      primary_image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
      min_price: 8499,
      max_price: 11999,
      store_count: 4,
      avg_rating: 4.6,
      total_reviews: 1560,
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
      description: 'The Adidas Ultraboost 22 features responsive Boost midsole cushioning and a Primeknit+ upper for adaptive support and comfort.',
      primary_image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
      min_price: 11999,
      max_price: 16999,
      store_count: 3,
      avg_rating: 4.3,
      total_reviews: 980,
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
      description: 'The Adidas Stan Smith is a timeless tennis-inspired sneaker with clean lines and minimalist design. A true icon of casual footwear.',
      primary_image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
      min_price: 6999,
      max_price: 9999,
      store_count: 5,
      avg_rating: 4.5,
      total_reviews: 3200,
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
      description: 'The Adidas NMD R1 blends heritage and innovation with Boost cushioning and a sock-like Primeknit upper for modern street style.',
      primary_image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
      min_price: 9999,
      max_price: 13999,
      store_count: 4,
      avg_rating: 4.2,
      total_reviews: 1450,
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
      description: 'The Adidas Gazelle brings retro style with premium suede upper and classic 3-Stripes design. A vintage-inspired lifestyle sneaker.',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800',
      min_price: 5999,
      max_price: 8999,
      store_count: 4,
      avg_rating: 4.4,
      total_reviews: 1890,
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
      description: 'The Puma RS-X reinvents retro with bold colors and chunky proportions. Features RS cushioning technology for comfort and style.',
      primary_image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
      min_price: 6499,
      max_price: 8999,
      store_count: 5,
      avg_rating: 4.1,
      total_reviews: 720,
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
      description: 'The Puma Suede Classic is an iconic sneaker with premium suede upper and timeless design. A streetwear staple since the 1960s.',
      primary_image_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
      min_price: 4999,
      max_price: 7999,
      store_count: 4,
      avg_rating: 4.3,
      total_reviews: 1340,
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
      description: 'The Puma Future Rider combines retro running aesthetics with modern comfort. Features Federbein outsole technology.',
      primary_image_url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800',
      min_price: 5499,
      max_price: 8499,
      store_count: 3,
      avg_rating: 4.0,
      total_reviews: 560,
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
      description: 'The Converse Chuck Taylor All Star is the original basketball sneaker and cultural icon. Features classic canvas upper and rubber toe cap.',
      primary_image_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800',
      min_price: 3999,
      max_price: 5999,
      store_count: 5,
      avg_rating: 4.6,
      total_reviews: 4500,
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
      description: 'The Converse Chuck 70 features premium materials and enhanced comfort with OrthoLite insole and vintage details.',
      primary_image_url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800',
      min_price: 5999,
      max_price: 8999,
      store_count: 4,
      avg_rating: 4.5,
      total_reviews: 2100,
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
      description: 'The New Balance 990v5 represents the pinnacle of American craftsmanship with premium materials and superior comfort.',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
      min_price: 15999,
      max_price: 19999,
      store_count: 3,
      avg_rating: 4.7,
      total_reviews: 890,
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
      description: 'The New Balance 574 is a versatile lifestyle sneaker with ENCAP midsole technology and classic running-inspired design.',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800',
      min_price: 6999,
      max_price: 9999,
      store_count: 4,
      avg_rating: 4.2,
      total_reviews: 1670,
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
      description: 'The Vans Old Skool is the original skate shoe with iconic side stripe, durable canvas and suede uppers, and waffle outsole.',
      primary_image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
      min_price: 4999,
      max_price: 7999,
      store_count: 5,
      avg_rating: 4.4,
      total_reviews: 2890,
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
      description: 'The Vans Authentic is the original and now iconic Vans silhouette. Simple, clean canvas upper with metal eyelets.',
      primary_image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
      min_price: 3999,
      max_price: 6999,
      store_count: 4,
      avg_rating: 4.3,
      total_reviews: 1980,
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
      description: 'The Reebok Classic Leather is a timeless sneaker with soft garment leather upper and comfortable EVA midsole.',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
      min_price: 5499,
      max_price: 8499,
      store_count: 4,
      avg_rating: 4.1,
      total_reviews: 1230,
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
      description: 'The Reebok Nano X is built for the most intense workouts with Floatride Energy foam and flexible Flexweave upper.',
      primary_image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      min_price: 9999,
      max_price: 13999,
      store_count: 3,
      avg_rating: 4.5,
      total_reviews: 670,
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
      description: 'The Air Jordan 1 Low offers the iconic look of the original AJ1 in a versatile low-top silhouette with premium leather construction.',
      primary_image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
      min_price: 9999,
      max_price: 14999,
      store_count: 4,
      avg_rating: 4.8,
      total_reviews: 3400,
      search_keywords: 'air jordan 1 low casual basketball chicago red white black'
    }
  ];

  // Find the specific product
  const product = allMockProducts.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // Generate realistic store prices for this specific product
  const generateStorePrices = (product) => {
    const stores = [
      { name: 'Amazon', base_url: 'https://amazon.in', logo: 'https://logo.clearbit.com/amazon.in' },
      { name: 'Flipkart', base_url: 'https://flipkart.com', logo: 'https://logo.clearbit.com/flipkart.com' },
      { name: 'Myntra', base_url: 'https://myntra.com', logo: 'https://logo.clearbit.com/myntra.com' },
      { name: 'Ajio', base_url: 'https://ajio.com', logo: 'https://logo.clearbit.com/ajio.com' },
      { name: 'Nykaa Fashion', base_url: 'https://nykaafashion.com', logo: 'https://logo.clearbit.com/nykaa.com' }
    ];

    const basePrice = product.min_price;
    const maxPrice = product.max_price;
    const priceRange = maxPrice - basePrice;

    return stores.slice(0, product.store_count).map((store, index) => {
      const price = basePrice + (priceRange * Math.random());
      const originalPrice = price + (price * 0.1 * Math.random()); // 0-10% higher original price
      const discount = ((originalPrice - price) / originalPrice) * 100;
      const encodedName = encodeURIComponent(product.name);

      let productUrl = '';
      switch (store.name) {
        case 'Amazon':
          productUrl = `https://www.amazon.in/s?k=${encodedName}`;
          break;
        case 'Flipkart':
          productUrl = `https://www.flipkart.com/search?q=${encodedName}`;
          break;
        case 'Myntra':
          productUrl = `https://www.myntra.com/${product.name.toLowerCase().replace(/\s+/g, '-')}`;
          break;
        case 'Ajio':
          productUrl = `https://www.ajio.com/search/?text=${encodedName}`;
          break;
        case 'Nykaa Fashion':
          productUrl = `https://www.nykaafashion.com/catalogsearch/result/?q=${encodedName}`;
          break;
        default:
          productUrl = `${store.base_url}/search?q=${encodedName}`;
      }

      return {
        store_name: store.name,
        store_logo: store.logo,
        price: Math.round(price),
        original_price: Math.round(originalPrice),
        discount_percentage: Math.round(discount),
        availability: ['in_stock', 'in_stock', 'in_stock', 'limited_stock'][Math.floor(Math.random() * 4)],
        product_url: productUrl,
        delivery_time: ['1-2 days', '2-3 days', '3-5 days', 'Same day'][Math.floor(Math.random() * 4)],
        last_scraped: new Date().toISOString()
      };
    });
  };

  const prices = generateStorePrices(product);
  const lowestPrice = Math.min(...prices.map(p => p.price));
  const highestPrice = Math.max(...prices.map(p => p.price));

  res.json({
    success: true,
    data: {
      ...product,
      lowest_price: lowestPrice,
      highest_price: highestPrice,
      prices: prices
    }
  });
});

// Mock price comparison
app.get('/api/compare/:productId', (req, res) => {
  const { productId } = req.params;
  const id = parseInt(productId);

  // Use the same product database
  const allMockProducts = [
    // Nike Products
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      model: 'Air Max 270',
      primary_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      min_price: 8999,
      max_price: 12999,
      store_count: 4
    },
    {
      id: 2,
      name: 'Nike Air Force 1',
      brand: 'Nike',
      model: 'Air Force 1',
      primary_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      min_price: 7999,
      max_price: 10999,
      store_count: 5
    },
    {
      id: 3,
      name: 'Nike React Infinity Run',
      brand: 'Nike',
      model: 'React Infinity Run',
      primary_image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      min_price: 12999,
      max_price: 16999,
      store_count: 3
    },
    {
      id: 4,
      name: 'Nike Dunk Low',
      brand: 'Nike',
      model: 'Dunk Low',
      primary_image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      min_price: 8499,
      max_price: 11999,
      store_count: 4
    },
    // Adidas Products
    {
      id: 5,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      model: 'Ultraboost 22',
      primary_image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      min_price: 11999,
      max_price: 16999,
      store_count: 3
    },
    {
      id: 6,
      name: 'Adidas Stan Smith',
      brand: 'Adidas',
      model: 'Stan Smith',
      primary_image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
      min_price: 6999,
      max_price: 9999,
      store_count: 5
    },
    {
      id: 7,
      name: 'Adidas NMD R1',
      brand: 'Adidas',
      model: 'NMD R1',
      primary_image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
      min_price: 9999,
      max_price: 13999,
      store_count: 4
    },
    {
      id: 8,
      name: 'Adidas Gazelle',
      brand: 'Adidas',
      model: 'Gazelle',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
      min_price: 5999,
      max_price: 8999,
      store_count: 4
    },
    // Puma Products
    {
      id: 9,
      name: 'Puma RS-X',
      brand: 'Puma',
      model: 'RS-X',
      primary_image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
      min_price: 6499,
      max_price: 8999,
      store_count: 5
    },
    {
      id: 10,
      name: 'Puma Suede Classic',
      brand: 'Puma',
      model: 'Suede Classic',
      primary_image_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
      min_price: 4999,
      max_price: 7999,
      store_count: 4
    },
    {
      id: 11,
      name: 'Puma Future Rider',
      brand: 'Puma',
      model: 'Future Rider',
      primary_image_url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400',
      min_price: 5499,
      max_price: 8499,
      store_count: 3
    },
    // Converse Products
    {
      id: 12,
      name: 'Converse Chuck Taylor All Star',
      brand: 'Converse',
      model: 'Chuck Taylor All Star',
      primary_image_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400',
      min_price: 3999,
      max_price: 5999,
      store_count: 5
    },
    {
      id: 13,
      name: 'Converse Chuck 70',
      brand: 'Converse',
      model: 'Chuck 70',
      primary_image_url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400',
      min_price: 5999,
      max_price: 8999,
      store_count: 4
    },
    // New Balance Products
    {
      id: 14,
      name: 'New Balance 990v5',
      brand: 'New Balance',
      model: '990v5',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      min_price: 15999,
      max_price: 19999,
      store_count: 3
    },
    {
      id: 15,
      name: 'New Balance 574',
      brand: 'New Balance',
      model: '574',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
      min_price: 6999,
      max_price: 9999,
      store_count: 4
    },
    // Vans Products
    {
      id: 16,
      name: 'Vans Old Skool',
      brand: 'Vans',
      model: 'Old Skool',
      primary_image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
      min_price: 4999,
      max_price: 7999,
      store_count: 5
    },
    {
      id: 17,
      name: 'Vans Authentic',
      brand: 'Vans',
      model: 'Authentic',
      primary_image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
      min_price: 3999,
      max_price: 6999,
      store_count: 4
    },
    // Reebok Products
    {
      id: 18,
      name: 'Reebok Classic Leather',
      brand: 'Reebok',
      model: 'Classic Leather',
      primary_image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      min_price: 5499,
      max_price: 8499,
      store_count: 4
    },
    {
      id: 19,
      name: 'Reebok Nano X',
      brand: 'Reebok',
      model: 'Nano X',
      primary_image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      min_price: 9999,
      max_price: 13999,
      store_count: 3
    },
    // Jordan Products
    {
      id: 20,
      name: 'Air Jordan 1 Low',
      brand: 'Jordan',
      model: 'Air Jordan 1 Low',
      primary_image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      min_price: 9999,
      max_price: 14999,
      store_count: 4
    }
  ];

  const product = allMockProducts.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // Generate realistic comparison data
  const generateComparison = (product) => {
    const stores = [
      { name: 'Amazon', base_url: 'https://amazon.in' },
      { name: 'Flipkart', base_url: 'https://flipkart.com' },
      { name: 'Myntra', base_url: 'https://myntra.com' },
      { name: 'Ajio', base_url: 'https://ajio.com' },
      { name: 'Nykaa Fashion', base_url: 'https://nykaafashion.com' }
    ];

    const basePrice = product.min_price;
    const maxPrice = product.max_price;
    const priceRange = maxPrice - basePrice;

    const comparison = stores.slice(0, product.store_count).map((store, index) => {
      const price = basePrice + (priceRange * Math.random());
      const originalPrice = price + (price * 0.15 * Math.random());
      const discount = ((originalPrice - price) / originalPrice) * 100;
      const encodedName = encodeURIComponent(product.name);

      let productUrl = '';
      switch (store.name) {
        case 'Amazon':
          productUrl = `https://www.amazon.in/s?k=${encodedName}`;
          break;
        case 'Flipkart':
          productUrl = `https://www.flipkart.com/search?q=${encodedName}`;
          break;
        case 'Myntra':
          productUrl = `https://www.myntra.com/${product.name.toLowerCase().replace(/\s+/g, '-')}`;
          break;
        case 'Ajio':
          productUrl = `https://www.ajio.com/search/?text=${encodedName}`;
          break;
        case 'Nykaa Fashion':
          productUrl = `https://www.nykaafashion.com/catalogsearch/result/?q=${encodedName}`;
          break;
        default:
          productUrl = `${store.base_url}/search?q=${encodedName}`;
      }

      return {
        store_name: store.name,
        price: Math.round(price),
        original_price: Math.round(originalPrice),
        discount_percentage: Math.round(discount),
        availability: ['in_stock', 'in_stock', 'limited_stock'][Math.floor(Math.random() * 3)],
        product_url: productUrl,
        is_lowest_price: false,
        savings_vs_highest: 0,
        last_scraped: new Date().toISOString()
      };
    });

    // Sort by price and mark lowest
    comparison.sort((a, b) => a.price - b.price);
    const lowestPrice = comparison[0].price;
    const highestPrice = comparison[comparison.length - 1].price;

    comparison.forEach(item => {
      item.is_lowest_price = item.price === lowestPrice;
      item.savings_vs_highest = highestPrice - item.price;
    });

    return comparison;
  };

  const comparison = generateComparison(product);
  const lowestPrice = Math.min(...comparison.map(c => c.price));
  const highestPrice = Math.max(...comparison.map(c => c.price));
  const avgPrice = Math.round(comparison.reduce((sum, c) => sum + c.price, 0) / comparison.length);

  res.json({
    success: true,
    data: {
      product: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        primary_image_url: product.primary_image_url
      },
      comparison: comparison,
      summary: {
        lowest_price: lowestPrice,
        highest_price: highestPrice,
        max_savings: highestPrice - lowestPrice,
        store_count: comparison.length,
        avg_price: avgPrice,
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