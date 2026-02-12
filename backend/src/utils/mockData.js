/**
 * Mock Data for Shoe Price Comparison
 * Used as fallback when database connection is unavailable or search returns no results
 */

const mockProducts = [
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
    description: 'The Nike Air Max 270 delivers visible cushioning under every step.',
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
    description: 'The legend lives on in the Nike Air Force 1 \'07.',
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
    description: 'Designed to help reduce injury and keep you on the run.',
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
    description: 'Created for the hardwood but taken to the streets.',
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
    description: 'Experience epic energy with the new Ultraboost 22.',
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
    description: 'Timeless appeal. Effortless style. Everyday versatility.',
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
    description: 'Streamlined shoes that merge \'80s racing heritage with modern style.',
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
    description: 'A low-profile classic. The Gazelle started as a soccer shoe.',
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
    description: 'RS-X is back. The future-retro silhouette of this sneaker returns.',
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
    description: 'The Suede has been changing the game ever since 1968.',
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
    description: 'Born in 1980, the Fast Rider launched when running moved from the track to the street.',
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
    description: 'The sneaker that started it all. The Chuck Taylor All Star is the definitive sneaker.',
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
    description: 'The Chuck 70 is built off the original 1970s design.',
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
    description: 'The 990v5 restores the great performance and iconic style of the 990.',
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
    description: 'The most New Balance shoe ever.',
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
    description: 'The Old Skool, the Vans classic skate shoe.',
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
    description: 'The Authentic is the original Vans silhouette.',
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
    description: 'Keep your look legit. The Classic Leather shoes.',
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
    description: 'Celebrate the 10th anniversary of the Nano.',
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
    description: 'Inspired by the original that debuted in 1985.',
    primary_image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    min_price: 9999,
    max_price: 14999,
    store_count: 4,
    avg_rating: 4.8,
    search_keywords: 'air jordan 1 low casual basketball chicago red white black'
  }
];

/**
 * Generates mock products based on a search query
 * Ensures that something is always returned for any search
 * @param {string} query - The search query
 * @returns {Array} Array of generated product objects
 */
const generateMockProducts = (query) => {
  if (!query) return [];
  
  // Generic shoe images to rotate
  const genericImages = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400'
  ];
  
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Bata', 'Woodland', 'Sketchers', 'Fila', 'Timberland', 'Clarks', 'Crocs', 'Asics'];
  const types = ['Running', 'Walking', 'Casual', 'Sports', 'Sneakers', 'Loafers', 'Boots'];
  
  // Try to find a brand in the query, or treat query as brand
  const matchedBrand = brands.find(b => query.toLowerCase().includes(b.toLowerCase()));
  const brandName = matchedBrand || query.split(' ')[0].charAt(0).toUpperCase() + query.split(' ')[0].slice(1);
  
  const generated = [];
  // Determine number of results based on query length hash or random
  const count = 4 + (query.length % 5); // 4 to 8 results
  
  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const priceBase = 2000 + (query.length * 100);
    const price = Math.floor(Math.random() * 10000) + priceBase;
    const modelNum = Math.floor(Math.random() * 1000);
    const image = genericImages[i % genericImages.length];
    
    generated.push({
      id: 5000 + i + (query.length * 10), // Unique-ish ID
      name: `${brandName} ${type} ${modelNum}`,
      brand: brandName,
      model: `${type} ${modelNum}`,
      category: 'shoes',
      subcategory: type.toLowerCase(),
      description: `Premium ${brandName} ${type} shoes designed for comfort and style. Perfect for everyday wear.`,
      primary_image_url: image, // Use rotating generic images
      min_price: price,
      max_price: price + Math.floor(Math.random() * 2000),
      store_count: Math.floor(Math.random() * 5) + 2,
      avg_rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
      total_reviews: Math.floor(Math.random() * 200) + 10,
      search_keywords: `${brandName.toLowerCase()} ${type.toLowerCase()} shoes`
    });
  }
  
  return generated;
};

module.exports = {
  mockProducts,
  generateMockProducts
};
