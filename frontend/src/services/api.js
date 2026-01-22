import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    
    return response
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
    }
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          toast.error(data.error || 'Invalid request')
          break
        case 404:
          toast.error(data.error || 'Resource not found')
          break
        case 429:
          toast.error('Too many requests. Please try again later.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data.error || 'Something went wrong')
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      // Other error
      toast.error('Something went wrong. Please try again.')
    }
    
    return Promise.reject(error)
  }
)

// API service functions
export const searchAPI = {
  // Search products
  searchProducts: async (params) => {
    const response = await api.get('/search', { params })
    return response.data
  },

  // Get search suggestions
  getSuggestions: async (query) => {
    const response = await api.get('/search/suggestions', { 
      params: { q: query } 
    })
    return response.data
  },

  // Get trending searches
  getTrending: async () => {
    const response = await api.get('/search/trending')
    return response.data
  }
}

export const productAPI = {
  // Get product by ID
  getProduct: async (id) => {
    const response = await api.get(`/product/${id}`)
    return response.data
  },

  // Get all products with filters
  getProducts: async (params) => {
    const response = await api.get('/product', { params })
    return response.data
  },

  // Get product filters (categories, brands)
  getFilters: async () => {
    const response = await api.get('/product/filters')
    return response.data
  }
}

export const compareAPI = {
  // Compare prices for a product
  compareProduct: async (productId) => {
    const response = await api.get(`/compare/${productId}`)
    return response.data
  },

  // Compare multiple products
  compareMultiple: async (productIds) => {
    const response = await api.post('/compare/multiple', { productIds })
    return response.data
  },

  // Get price alerts
  getPriceAlerts: async (productId) => {
    const response = await api.get(`/compare/${productId}/alerts`)
    return response.data
  }
}

// Utility functions
export const apiUtils = {
  // Check API health
  checkHealth: async () => {
    try {
      const response = await axios.get('/health')
      return response.data
    } catch (error) {
      throw new Error('API is not available')
    }
  },

  // Format price
  formatPrice: (price, currency = 'INR') => {
    if (!price) return 'N/A'
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    
    return formatter.format(price)
  },

  // Calculate discount percentage
  calculateDiscount: (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  },

  // Format relative time
  formatRelativeTime: (date) => {
    if (!date) return 'Unknown'
    
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now - past) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return past.toLocaleDateString()
  },

  // Debounce function for search
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

export default api