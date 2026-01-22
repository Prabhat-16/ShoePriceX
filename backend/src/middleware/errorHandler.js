/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for the entire application
 * Provides consistent error responses and logging
 */

const logger = require('../utils/logger').createModuleLogger('errorHandler');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error with request context
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // MySQL/Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    const message = 'Duplicate entry found';
    error = { message, statusCode: 409 };
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    const message = 'Database table not found';
    error = { message, statusCode: 500 };
  }

  if (err.code === 'ECONNREFUSED') {
    const message = 'Database connection refused';
    error = { message, statusCode: 503 };
  }

  // Validation errors (Joi)
  if (err.isJoi) {
    const message = err.details.map(detail => detail.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Rate limit errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later';
    error = { message, statusCode: 429 };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

module.exports = errorHandler;