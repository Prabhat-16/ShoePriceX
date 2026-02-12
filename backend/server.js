const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const logger = require('./src/utils/logger').createModuleLogger('server');
const database = require('./src/config/database');

// Import routes
const searchRoutes = require('./src/routes/searchRoutes');
const productRoutes = require('./src/routes/productRoutes');
const compareRoutes = require('./src/routes/compareRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/search', searchRoutes);
app.use('/api/product', productRoutes);
app.use('/api/compare', compareRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await database.getHealthStatus();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStatus
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const startServer = async () => {
  try {
    // Attempt to connect to database
    try {
      await database.connect();
      logger.info('Database connected');
    } catch (dbError) {
      logger.error('Failed to connect to database, starting in offline mode', { error: dbError.message });
    }

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();
