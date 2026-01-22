import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  ShoppingBag, 
  Zap, 
  Shield, 
  Clock,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

import SearchBar from '../components/search/SearchBar'
import { useSearch } from '../context/SearchContext'
import { searchAPI, apiUtils } from '../services/api'

const HomePage = () => {
  const [popularBrands, setPopularBrands] = useState([])
  const [featuredDeals, setFeaturedDeals] = useState([])
  const [stats, setStats] = useState({
    totalProducts: '10,000+',
    storesTracked: '5',
    avgSavings: '₹2,500'
  })
  
  const { trending, setTrending } = useSearch()

  // Load trending data on mount
  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        const response = await searchAPI.getTrending()
        setTrending(response.data.trending_searches || [])
        setPopularBrands(response.data.popular_brands || [])
      } catch (error) {
        console.error('Failed to load trending data:', error)
        // Set fallback data for demo
        setTrending([
          { query: 'nike air max', search_count: 150 },
          { query: 'adidas ultraboost', search_count: 120 },
          { query: 'running shoes', search_count: 100 }
        ])
      }
    }

    loadTrendingData()
  }, [setTrending])

  // Mock featured deals (would come from API in real app)
  useEffect(() => {
    setFeaturedDeals([
      {
        id: 1,
        name: 'Nike Air Max 270',
        brand: 'Nike',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        originalPrice: 12995,
        currentPrice: 8999,
        discount: 31,
        stores: 4
      },
      {
        id: 2,
        name: 'Adidas Ultraboost 22',
        brand: 'Adidas',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
        originalPrice: 16999,
        currentPrice: 11999,
        discount: 29,
        stores: 3
      },
      {
        id: 3,
        name: 'Puma RS-X',
        brand: 'Puma',
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
        originalPrice: 8999,
        currentPrice: 6499,
        discount: 28,
        stores: 5
      }
    ])
  }, [])

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find shoes across multiple stores with our intelligent search engine'
    },
    {
      icon: Zap,
      title: 'Real-time Prices',
      description: 'Get up-to-date pricing information from all major retailers'
    },
    {
      icon: Shield,
      title: 'Best Deals',
      description: 'We highlight the lowest prices and best offers available'
    },
    {
      icon: Clock,
      title: 'Price History',
      description: 'Track price trends and get notified when prices drop'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Find the{' '}
              <span className="gradient-text">Best Shoe Deals</span>
              <br />
              Across All Stores
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Compare prices from Amazon, Flipkart, Myntra, and official brand stores. 
              Save money and time with our intelligent price comparison platform.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto mb-12"
            >
              <SearchBar 
                size="large" 
                placeholder="Search for Nike Air Max, Adidas Ultraboost, or any shoe..."
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {Object.entries(stats).map(([key, value], index) => (
                <div key={key} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {value}
                  </div>
                  <div className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-primary-200 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-32 h-32 bg-secondary-200 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ShoePriceX?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make shoe shopping smarter, faster, and more affordable
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card p-8 text-center card-hover"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Deals Section */}
      {featuredDeals.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Deals
              </h2>
              <p className="text-xl text-gray-600">
                Hot deals and trending shoes with the best prices
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  variants={itemVariants}
                  className="card overflow-hidden card-hover"
                >
                  <div className="relative">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="price-lowest">
                        {deal.discount}% OFF
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-1">{deal.brand}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {deal.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {apiUtils.formatPrice(deal.currentPrice)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {apiUtils.formatPrice(deal.originalPrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {deal.stores} stores
                        </div>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm ml-1">4.5</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to={`/product/${deal.id}`}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Trending Searches Section */}
      {trending.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trending Searches
              </h2>
              <p className="text-xl text-gray-600">
                See what others are searching for
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              {trending.slice(0, 10).map((item, index) => (
                <Link
                  key={index}
                  to={`/search?q=${encodeURIComponent(item.query)}`}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-primary-100 rounded-full transition-colors group"
                >
                  <TrendingUp className="w-4 h-4 text-primary-500 group-hover:text-primary-600" />
                  <span className="text-gray-700 group-hover:text-primary-700 font-medium">
                    {item.query}
                  </span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {item.search_count}
                  </span>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Save on Your Next Shoe Purchase?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of smart shoppers who save money with ShoePriceX
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Start Searching</span>
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage