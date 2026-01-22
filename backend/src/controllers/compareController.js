/**
 * Compare Controller
 * 
 * Handles price comparison requests across different stores
 * Provides detailed comparison data and analytics
 */

const productService = require('../services/productService');
const logger = require('../utils/logger').createModuleLogger('compareController');

class CompareController {
  /**
   * Get price comparison for a specific product
   * GET /api/compare/:productId
   */
  async compareProductPrices(req, res, next) {
    try {
      const { productId } = req.params;
      const startTime = Date.now();
      
      logger.info('Price comparison requested', { productId });
      
      const comparison = await productService.getProductComparison(parseInt(productId));
      const responseTime = Date.now() - startTime;
      
      if (!comparison) {
        logger.warn('Product not found for comparison', { productId });
        return res.status(404).json({
          success: false,
          error: 'Product not found',
          productId
        });
      }
      
      logger.info('Price comparison completed', {
        productId,
        storeCount: comparison.comparison.length,
        lowestPrice: comparison.summary.lowest_price,
        maxSavings: comparison.summary.max_savings,
        responseTime: `${responseTime}ms`
      });
      
      res.status(200).json({
        success: true,
        message: `Price comparison for ${comparison.product.name}`,
        data: comparison,
        meta: {
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          comparison_count: comparison.comparison.length
        }
      });
      
    } catch (error) {
      logger.error('Compare product prices error', {
        error: error.message,
        productId: req.params.productId,
        stack: error.stack
      });
      next(error);
    }
  }

  /**
   * Compare multiple products side by side
   * POST /api/compare/multiple
   * Body: { productIds: [1, 2, 3] }
   */
  async compareMultipleProducts(req, res, next) {
    try {
      const { productIds } = req.body;
      const startTime = Date.now();
      
      // Validate input
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Product IDs array is required'
        });
      }
      
      if (productIds.length > 5) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 5 products can be compared at once'
        });
      }
      
      logger.info('Multiple product comparison requested', { 
        productIds,
        count: productIds.length 
      });
      
      // Get comparison data for each product
      const comparisons = await Promise.all(
        productIds.map(async (id) => {
          try {
            return await productService.getProductComparison(parseInt(id));
          } catch (error) {
            logger.warn('Failed to get comparison for product', { 
              productId: id, 
              error: error.message 
            });
            return null;
          }
        })
      );
      
      // Filter out null results (products not found)
      const validComparisons = comparisons.filter(comp => comp !== null);
      const responseTime = Date.now() - startTime;
      
      if (validComparisons.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No valid products found for comparison'
        });
      }
      
      // Create side-by-side comparison structure
      const sideByComparison = {
        products: validComparisons.map(comp => ({
          id: comp.product.id,
          name: comp.product.name,
          brand: comp.product.brand,
          model: comp.product.model,
          image: comp.product.primary_image_url,
          lowest_price: comp.summary.lowest_price,
          highest_price: comp.summary.highest_price,
          store_count: comp.summary.store_count,
          max_savings: comp.summary.max_savings,
          best_store: comp.comparison.find(item => item.is_lowest_price)?.store_name || null,
          best_store_url: comp.comparison.find(item => item.is_lowest_price)?.product_url || null
        })),
        
        store_comparison: this.createStoreComparisonMatrix(validComparisons),
        
        summary: {
          total_products: validComparisons.length,
          overall_best_deal: this.findOverallBestDeal(validComparisons),
          price_ranges: validComparisons.map(comp => ({
            product_id: comp.product.id,
            min: comp.summary.lowest_price,
            max: comp.summary.highest_price,
            savings: comp.summary.max_savings
          }))
        }
      };
      
      logger.info('Multiple product comparison completed', {
        requestedCount: productIds.length,
        validCount: validComparisons.length,
        responseTime: `${responseTime}ms`
      });
      
      res.status(200).json({
        success: true,
        message: `Comparison of ${validComparisons.length} products`,
        data: sideByComparison,
        meta: {
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          requested_products: productIds.length,
          valid_products: validComparisons.length
        }
      });
      
    } catch (error) {
      logger.error('Compare multiple products error', {
        error: error.message,
        productIds: req.body.productIds
      });
      next(error);
    }
  }

  /**
   * Get price alerts and notifications setup
   * GET /api/compare/:productId/alerts
   */
  async getPriceAlerts(req, res, next) {
    try {
      const { productId } = req.params;
      
      // This would typically involve user authentication and stored alerts
      // For now, return price trend information that could be used for alerts
      
      const product = await productService.getProductById(parseInt(productId));
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      // Calculate price trends and alert suggestions
      const priceHistory = product.price_history || [];
      const currentPrices = product.prices || [];
      
      const alertSuggestions = {
        current_lowest: Math.min(...currentPrices.map(p => p.price)),
        suggested_alert_price: this.calculateSuggestedAlertPrice(priceHistory, currentPrices),
        price_trend: this.analyzePriceTrend(priceHistory),
        volatility: this.calculatePriceVolatility(priceHistory)
      };
      
      res.status(200).json({
        success: true,
        data: {
          product: {
            id: product.id,
            name: product.name,
            brand: product.brand
          },
          alert_suggestions: alertSuggestions,
          current_prices: currentPrices.map(p => ({
            store: p.store_name,
            price: p.price,
            last_updated: p.last_scraped
          }))
        }
      });
      
    } catch (error) {
      logger.error('Get price alerts error', {
        error: error.message,
        productId: req.params.productId
      });
      next(error);
    }
  }

  /**
   * Helper method to create store comparison matrix
   */
  createStoreComparisonMatrix(comparisons) {
    const allStores = new Set();
    
    // Collect all unique stores
    comparisons.forEach(comp => {
      comp.comparison.forEach(item => {
        allStores.add(item.store_name);
      });
    });
    
    const storeArray = Array.from(allStores);
    
    return storeArray.map(storeName => {
      const storeData = {
        store_name: storeName,
        products: []
      };
      
      comparisons.forEach(comp => {
        const storePrice = comp.comparison.find(item => item.store_name === storeName);
        storeData.products.push({
          product_id: comp.product.id,
          price: storePrice ? storePrice.price : null,
          availability: storePrice ? storePrice.availability : 'not_available',
          url: storePrice ? storePrice.product_url : null,
          is_lowest: storePrice ? storePrice.is_lowest_price : false
        });
      });
      
      return storeData;
    });
  }

  /**
   * Helper method to find overall best deal
   */
  findOverallBestDeal(comparisons) {
    let bestDeal = null;
    let lowestPrice = Infinity;
    
    comparisons.forEach(comp => {
      const bestPriceItem = comp.comparison.find(item => item.is_lowest_price);
      if (bestPriceItem && bestPriceItem.price < lowestPrice) {
        lowestPrice = bestPriceItem.price;
        bestDeal = {
          product_id: comp.product.id,
          product_name: comp.product.name,
          store_name: bestPriceItem.store_name,
          price: bestPriceItem.price,
          url: bestPriceItem.product_url
        };
      }
    });
    
    return bestDeal;
  }

  /**
   * Helper method to calculate suggested alert price
   */
  calculateSuggestedAlertPrice(priceHistory, currentPrices) {
    if (priceHistory.length === 0) {
      const currentLowest = Math.min(...currentPrices.map(p => p.price));
      return Math.round(currentLowest * 0.9); // 10% below current lowest
    }
    
    const historicalPrices = priceHistory.map(h => h.min_price);
    const historicalLowest = Math.min(...historicalPrices);
    const currentLowest = Math.min(...currentPrices.map(p => p.price));
    
    return Math.min(historicalLowest, Math.round(currentLowest * 0.95));
  }

  /**
   * Helper method to analyze price trend
   */
  analyzePriceTrend(priceHistory) {
    if (priceHistory.length < 2) return 'insufficient_data';
    
    const recentPrices = priceHistory.slice(0, 7).map(h => h.avg_price);
    const olderPrices = priceHistory.slice(-7).map(h => h.avg_price);
    
    const recentAvg = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((sum, price) => sum + price, 0) / olderPrices.length;
    
    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (changePercent > 5) return 'increasing';
    if (changePercent < -5) return 'decreasing';
    return 'stable';
  }

  /**
   * Helper method to calculate price volatility
   */
  calculatePriceVolatility(priceHistory) {
    if (priceHistory.length < 3) return 'low';
    
    const prices = priceHistory.map(h => h.avg_price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = (standardDeviation / mean) * 100;
    
    if (coefficientOfVariation > 15) return 'high';
    if (coefficientOfVariation > 8) return 'medium';
    return 'low';
  }
}

module.exports = new CompareController();