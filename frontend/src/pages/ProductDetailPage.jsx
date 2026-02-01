import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ExternalLink,
  Star,
  TrendingUp,
  ShoppingCart,
  Heart,
  Share2,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react'

import { productAPI, apiUtils } from '../services/api'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const response = await productAPI.getProduct(id)
        setProduct(response.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - Compare prices across multiple stores`,
          url: window.location.href
        })
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Product Not Found
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!product) return null

  const images = [
    product.primary_image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-gray-200">Search</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-dark-800 rounded-2xl overflow-hidden shadow-soft border border-dark-700"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                      ? 'border-primary-500'
                      : 'border-dark-700 hover:border-dark-500'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-primary-400 mb-2">{product.brand}</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {product.name}
              </h1>

              {product.avg_rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.avg_rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-dark-600'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.avg_rating.toFixed(1)} ({product.total_reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="bg-dark-800 rounded-xl p-6 shadow-soft border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary-400">
                    {apiUtils.formatPrice(product.lowest_price)}
                  </div>
                  <div className="text-sm text-gray-400">Lowest Price</div>
                </div>
                {product.highest_price && product.lowest_price !== product.highest_price && (
                  <div className="text-right">
                    <div className="text-xl font-semibold text-gray-300">
                      {apiUtils.formatPrice(product.highest_price)}
                    </div>
                    <div className="text-sm text-gray-400">Highest Price</div>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-success-900/20 rounded-lg border border-success-900/30">
                <div className="flex items-center space-x-2 text-success-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Save up to {apiUtils.formatPrice(product.highest_price - product.lowest_price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Link
                to={`/compare/${product.id}`}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Compare Prices</span>
              </Link>

              <button
                onClick={handleShare}
                className="btn-secondary px-4"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button className="btn-secondary px-4">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Product Details */}
            {product.description && (
              <div className="bg-dark-800 rounded-xl p-6 shadow-soft border border-dark-700">
                <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                <p className="text-gray-400 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="bg-dark-800 rounded-xl p-6 shadow-soft border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Brand</div>
                  <div className="font-medium text-gray-200">{product.brand}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Model</div>
                  <div className="font-medium text-gray-200">{product.model || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-medium capitalize text-gray-200">{product.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-medium capitalize text-gray-200">{product.gender || 'Unisex'}</div>
                </div>
                {product.color && (
                  <div>
                    <div className="text-sm text-gray-500">Color</div>
                    <div className="font-medium text-gray-200">{product.color}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Store Prices */}
        {product.prices && product.prices.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Available at These Stores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.prices.map((price, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 card-hover bg-dark-800 border border-dark-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={price.store_logo || `https://logo.clearbit.com/${price.store_name.toLowerCase()}.com`}
                        alt={price.store_name}
                        className="w-8 h-8 rounded bg-white p-0.5"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/32x32?text=' + price.store_name[0]
                        }}
                      />
                      <span className="font-semibold text-white">{price.store_name}</span>
                    </div>
                    <span className={`text-sm font-medium ${getAvailabilityColor(price.availability)}`}>
                      {getAvailabilityText(price.availability)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-white">
                      {apiUtils.formatPrice(price.price)}
                    </div>
                    {price.original_price && price.original_price > price.price && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 line-through">
                          {apiUtils.formatPrice(price.original_price)}
                        </span>
                        <span className="text-sm font-medium text-success-400">
                          {price.discount_percentage}% off
                        </span>
                      </div>
                    )}
                  </div>

                  {price.delivery_time && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{price.delivery_time}</span>
                    </div>
                  )}

                  <a
                    href={price.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage