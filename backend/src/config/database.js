/**
 * Database Configuration and Connection Management
 * 
 * Handles MySQL connection pooling, query execution, and connection lifecycle
 * Uses connection pooling for better performance and resource management
 */

const mysql = require('mysql2/promise');
const logger = require('../utils/logger').createModuleLogger('database');

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  /**
   * Initialize database connection pool
   * @returns {Promise<mysql.Pool>} Database connection pool
   */
  async connect() {
    try {
      // Validate required environment variables
      const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
        // Enable multiple statements for complex queries
        multipleStatements: false,
        // Timezone configuration
        timezone: '+00:00',
        // Character set
        charset: 'utf8mb4'
      });

      // Test connection
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      
      this.isConnected = true;
      logger.info('Database connected successfully', {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        connectionLimit: 10
      });
      
      return this.pool;
    } catch (error) {
      this.isConnected = false;
      logger.error('Database connection failed', { 
        error: error.message,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
      });
      throw error;
    }
  }

  /**
   * Execute a SQL query with parameters
   * @param {string} sql - SQL query string
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query results
   */
  async query(sql, params = []) {
    if (!this.pool || !this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }

    const startTime = Date.now();
    
    try {
      const [results] = await this.pool.execute(sql, params);
      const duration = Date.now() - startTime;
      
      logger.debug('Query executed successfully', {
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        paramCount: params.length,
        duration: `${duration}ms`,
        resultCount: Array.isArray(results) ? results.length : 1
      });
      
      return results;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('Database query error', {
        error: error.message,
        sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
        params: params.length > 0 ? '[PARAMS_PROVIDED]' : '[]',
        duration: `${duration}ms`
      });
      
      throw error;
    }
  }

  /**
   * Execute a transaction with multiple queries
   * @param {Function} callback - Function containing transaction logic
   * @returns {Promise<any>} Transaction result
   */
  async transaction(callback) {
    if (!this.pool || !this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }

    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      logger.debug('Transaction started');
      
      const result = await callback(connection);
      
      await connection.commit();
      logger.debug('Transaction committed successfully');
      
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error('Transaction rolled back', { error: error.message });
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get database health status
   * @returns {Promise<Object>} Health status information
   */
  async getHealthStatus() {
    try {
      if (!this.pool || !this.isConnected) {
        return { status: 'disconnected', message: 'Database not connected' };
      }

      const connection = await this.pool.getConnection();
      const startTime = Date.now();
      
      await connection.ping();
      const responseTime = Date.now() - startTime;
      
      // Get connection pool status
      const poolStatus = {
        totalConnections: this.pool.pool._allConnections.length,
        freeConnections: this.pool.pool._freeConnections.length,
        acquiringConnections: this.pool.pool._acquiringConnections.length
      };
      
      connection.release();
      
      return {
        status: 'connected',
        responseTime: `${responseTime}ms`,
        pool: poolStatus,
        database: process.env.DB_NAME
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Close database connection pool
   */
  async close() {
    if (this.pool) {
      try {
        await this.pool.end();
        this.isConnected = false;
        logger.info('Database connection pool closed');
      } catch (error) {
        logger.error('Error closing database connection', { error: error.message });
        throw error;
      }
    }
  }

  /**
   * Check if database is connected
   * @returns {boolean} Connection status
   */
  isHealthy() {
    return this.isConnected && this.pool !== null;
  }
}

// Export singleton instance
module.exports = new Database();