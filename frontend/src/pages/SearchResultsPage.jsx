import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  Star, 
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

import { useSearch } from '../context/SearchContext'
import { searchAPI, apiUtils } from '../services/api'
import SearchBar from '../components/search/SearchBar'

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    categories: [],
    priceRanges: []
  })

  const {
    query,
    setQuery,
    results,
    setResults,
    loading,
    setLoading,
    error,
    setError,
    filters,
    setFilters,
    pagination,
    setPagination,
    addRecentSearch
  } = useSearch()

  // Get search parameters from URL
  const urlQuery = searchParams.get('q') || ''
  const urlPage = parseInt(searchParams.get('page')) || 1
  const urlBrand = searchParams.get('brand') || ''
  const urlCategory = searchParams.get('category') || ''
  const urlMinPrice = searchParams.get('minPrice') || ''
  const urlMaxPrice = searchParams.get('maxPrice') || ''
  const urlSortBy = searchParams.get('sortBy') || 'relevance'

  // Perform search when URL parameters change
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery)
      setFilters({
        brand: urlBrand,
        category: urlCategory,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
        sortBy: urlSortBy
      })
      performSearch(urlQuery, {
        page: urlPage,
        brand: urlBrand,
        category: urlCategory,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
        sortBy: urlSortBy
      })
    }
  }, [urlQuery, urlPage, urlBrand, urlCategory, urlMinPrice, urlMaxPrice, urlSortBy])

  // Perform search function
  const performSearch = async (searchQuery, searchFilters = {}) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const params = {
        q: searchQuery,
        page: searchFilters.page || 1,
        limit: 20,
        ...searchFilters
      }

      const response = await searchAPI.searchProducts(params)
      
      setResults(response.data.products || [])
      setPagination(response.data.pagination || {})
      addRecentSearch(searchQuery)

      // Extract available filters from results
      if (response.data.products) {
        extractFilters(response.data.products)
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search products')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Extract available filters from search results
  const extractFilters = (products) => {
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
    
    setAvailableFilters({
      brands: brands.map(brand => ({ name: brand, count: products.filter(p => p.brand === brand).length })),
      categories: categories.map(cat => ({ name: cat, count: products.filter(p => p.category === cat).length })),
      priceRanges: [
        { label: 'Under ₹2,000', min: 0, max: 2000 },
        { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
        { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
        { label: 'Above ₹10,000', min: 10000, max: 999999 }
      ]
    })
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams)
    if (value) {
      newSearchParams.set(filterType, value)
    } else {
      newSearchParams.delete(filterType)
    }
    newSearchParams.set('page', '1') // Reset to first page
    setSearchParams(newSearchParams)
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', newPage.toString())
    setSearchParams(newSearchParams)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Retry search
  const retrySearch = () => {
    if (query) {
      performSearch(query, filters)
    }
  }

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
        duration: 0.3
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <SearchBar placeholder="Search for shoes, brands, or models..." />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Search Results Summary */}
          {query && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Search Results for "{query}"
                </h1>
                {!loading && (
                  <p className="text-gray-600 mt-1">
                    {pagination.total || 0} products found
                    {filters.brand && ` in ${filters.brand}`}
                    {filters.category && ` • ${filters.category}`}
                  </p>
                )}
              </div>
              
              {!loading && results.length > 0 && (
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden lg:block"
              >
                <div className="card p-6 sticky top-32">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                  
                  {/* Brand Filter */}
                  {availableFilters.brands.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
                      <div className="space-y-2">
                        {availableFilters.brands.slice(0, 8).map((brand) => (
                          <label key={brand.name} className="flex items-center">
                            <input
                              type="radio"
                              name="brand"
                              value={brand.name}
                              checked={filters.brand === brand.name}
                              onChange={(e) => handleFilterChange('brand', e.target.value)}
                              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {brand.name} ({brand.count})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {availableFilters.priceRanges.map((range, index) => (
                        <label key={index} className="flex items-center">
                          <input
                            type="radio"
                            name="priceRange"
                            value={`${range.min}-${range.max}`}
                            checked={filters.minPrice == range.min && filters.maxPrice == range.max}
                            onChange={() => {
                              handleFilterChange('minPrice', range.min.toString())
                              handleFilterChange('maxPrice', range.max.toString())
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => {
                      setFilters({
                        brand: '',
                        category: '',
                        minPrice: '',
                        maxPrice: '',
                        sortBy: 'relevance'
                      })
                      setSearchParams({ q: query })
                    }}
                    className="w-full btn-ghost text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
                  <p className="text-gray-600">Searching for the best deals...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={retrySearch} className="btn-primary flex items-center space-x-2 mx-auto">
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && results.length === 0 && query && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No shoes found for "{query}"
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setFilters({
                        brand: '',
                        category: '',
                        minPrice: '',
                        maxPrice: '',
                        sortBy: 'relevance'
                      })
                      setSearchParams({ q: query })
                    }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                  <Link to="/" className="btn-primary">
                    Back to Home
                  </Link>
                </div>
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && !error && results.length > 0 && (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {results.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className={`card card-hover ${
                        viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                      }`}
                    >
                      {viewMode === 'grid' ? (
                        // Grid View
                        <>
                          <div className="relative">
                            <img
                              src={product.primary_image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                            {product.min_price && product.max_price && product.min_price !== product.max_price && (
                              <div className="absolute top-4 left-4">
                                <span className="price-lowest">
                                  Best Deal
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-6">
                            <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                {product.min_price && (
                                  <div className="text-2xl font-bold text-gray-900">
                                    {apiUtils.formatPrice(product.min_price)}
                                  </div>
                                )}
                                {product.max_price && product.min_price !== product.max_price && (
                                  <div className="text-sm text-gray-500">
                                    up to {apiUtils.formatPrice(product.max_price)}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {product.store_count} stores
                                </div>
                                {product.avg_rating && (
                                  <div className="flex items-center text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm ml-1">{product.avg_rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Link
                                to={`/product/${product.id}`}
                                className="btn-primary flex-1 text-center"
                              >
                                View Details
                              </Link>
                              <Link
                                to={`/compare/${product.id}`}
                                className="btn-secondary px-4"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </>
                      ) : (
                        // List View
                        <div className="flex items-center w-full">
                          <img
                            src={product.primary_image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1 ml-4">
                            <div className="text-sm text-gray-500">{product.brand}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{product.store_count} stores</span>
                              {product.avg_rating && (
                                <div className="flex items-center text-yellow-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="ml-1">{product.avg_rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right mr-4">
                            {product.min_price && (
                              <div className="text-xl font-bold text-gray-900">
                                {apiUtils.formatPrice(product.min_price)}
                              </div>
                            )}
                            {product.max_price && product.min_price !== product.max_price && (
                              <div className="text-sm text-gray-500">
                                up to {apiUtils.formatPrice(product.max_price)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Link
                              to={`/product/${product.id}`}
                              className="btn-primary"
                            >
                              View Details
                            </Link>
                            <Link
                              to={`/compare/${product.id}`}
                              className="btn-secondary px-4"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center mt-12 space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, pagination.page - 2) + i
                        if (pageNum > pagination.totalPages) return null
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              pageNum === pagination.page
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage