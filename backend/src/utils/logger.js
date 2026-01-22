/**
 * Winston Logger Configuration
 * 
 * Centralized logging system with different levels and outputs
 * - Console logging for development
 * - File logging for production
 * - Error tracking and structured logs
 */

const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const logDir = process.env.LOG_FILE_PATH || './logs';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`;
    })
  ),
  defaultMeta: { 
    service: 'shoe-comparison-api',
    version: '1.0.0'
  },
  transports: [
    // Error logs
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Scraping specific logs
    new winston.transports.File({ 
      filename: path.join(logDir, 'scraping.log'),
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 3,
    })
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    )
  }));
}

// Create specialized loggers for different modules
const createModuleLogger = (module) => {
  return {
    info: (message, meta = {}) => logger.info(message, { module, ...meta }),
    error: (message, meta = {}) => logger.error(message, { module, ...meta }),
    warn: (message, meta = {}) => logger.warn(message, { module, ...meta }),
    debug: (message, meta = {}) => logger.debug(message, { module, ...meta }),
  };
};

module.exports = logger;
module.exports.createModuleLogger = createModuleLogger;