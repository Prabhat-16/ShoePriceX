import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ExternalLink, 
  TrendingUp, 
  Crown,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react'

import { compareAPI, apiUtils } from '../services/api'

const ComparePage = () => {
  const { id } = useParams()
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComparison = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const response = await compareAPI.compareProduct(id)
        setComparison(response.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load price comparison')
      } finally {
        setLoading(false)
      }
    }

    fetchComparison()
  }, [id])

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'in_stock': return 'text-success-600'
      case 'limited_stock': return 'text-warning-600'
      case 'out_of_stock': return 'text-error-600'
      default: return 'text-gray-600'
    }
  }

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'in_stock': return 'In Stock'
      case 'limited_stock': return 'Limited Stock'
      case 'out_of_stock': return 'Out of Stock'
      default: return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading price comparison...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Comparison Not Available
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!comparison) return null

  const { product, comparison: prices, summary } = comparison

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Price Comparison
              </h1>
              <p className="text-gray-600">
                Compare prices for <span className="font-medium">{product.name}</span> across {summary.store_count} stores
              </p>
            </div>
            
            <Link
              to={`/product/${product.id}`}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product Summary */}
        <div className="card p-6 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={product.primary_image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
              <div className="text-sm text-gray-600">{product.model}</div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Price Range</div>
              <div className="text-2xl font-bold text-primary-600">
                {apiUtils.formatPrice(summary.lowest_price)}
              </div>
              <div className="text-sm text-gray-500">
                to {apiUtils.formatPrice(summary.highest_price)}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-success-600 mb-2">
              {apiUtils.formatPrice(summary.lowest_price)}
            </div>
            <div className="text-sm text-gray-600">Best Price</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {apiUtils.formatPrice(summary.max_savings)}
            </div>
            <div className="text-sm text-gray-600">Max Savings</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {summary.store_count}
            </div>
            <div className="text-sm text-gray-600">Stores</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {apiUtils.formatPrice(summary.avg_price)}
            </div>
            <div className="text-sm text-gray-600">Avg Price</div>
          </div>
        </div>

        {/* Price Comparison Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <span>Store Comparison</span>
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Savings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prices.map((price, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`hover:bg-gray-50 ${
                      price.is_lowest_price ? 'bg-success-50 border-l-4 border-success-500' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {price.is_lowest_price && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                        <img
                          src={price.store_logo || `https://logo.clearbit.com/${price.store_name.toLowerCase()}.com`}
                          alt={price.store_name}
                          className="w-8 h-8 rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/32x32?text=' + price.store_name[0]
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{price.store_name}</div>
                          {price.is_lowest_price && (
                            <div className="text-xs text-success-600 font-medium">Best Price</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {apiUtils.formatPrice(price.price)}
                        </div>
                        {price.original_price && price.original_price > price.price && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 line-through">
                              {apiUtils.formatPrice(price.original_price)}
                            </span>
                            <span className="text-sm font-medium text-success-600">
                              {price.discount_percentage}% off
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {price.savings_vs_highest > 0 
                          ? `Save ${apiUtils.formatPrice(price.savings_vs_highest)}`
                          : '-'
                        }
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          price.availability === 'in_stock' ? 'bg-success-500' :
                          price.availability === 'limited_stock' ? 'bg-warning-500' :
                          'bg-error-500'
                        }`}></div>
                        <span className={`text-sm font-medium ${getAvailabilityColor(price.availability)}`}>
                          {getAvailabilityText(price.availability)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{apiUtils.formatRelativeTime(price.last_scraped)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={price.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          price.availability === 'out_of_stock'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : price.is_lowest_price
                            ? 'bg-success-600 hover:bg-success-700 text-white'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                        {...(price.availability === 'out_of_stock' && { 
                          onClick: (e) => e.preventDefault() 
                        })}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          {price.availability === 'out_of_stock' ? 'Out of Stock' : 'Buy Now'}
                        </span>
                        {price.availability !== 'out_of_stock' && (
                          <ExternalLink className="w-4 h-4" />
                        )}
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Deal Highlight */}
        {prices.length > 0 && (
          <div className="mt-8 card p-6 bg-gradient-to-r from-success-50 to-primary-50 border border-success-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Best Deal Found!</h3>
                  <p className="text-gray-600">
                    Get {product.name} for just {apiUtils.formatPrice(summary.lowest_price)} at{' '}
                    <span className="font-medium">
                      {prices.find(p => p.is_lowest_price)?.store_name}
                    </span>
                  </p>
                </div>
              </div>
              
              <a
                href={prices.find(p => p.is_lowest_price)?.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Buy Best Deal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Last Updated Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              Prices last updated: {apiUtils.formatRelativeTime(summary.last_updated)}
            </span>
          </div>
          <p className="mt-1">
            Prices are updated regularly. Click "Buy Now" to see current prices on the store website.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComparePage