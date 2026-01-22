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
  res.json({
    success: true,
    message: `Mock search results for: ${q}`,
    data: {
      products: [],
      pagination: { page: 1, limit: 20, total: 0 },
      note: 'Database connection required for real data'
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