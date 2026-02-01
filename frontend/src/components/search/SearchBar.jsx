import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2
} from 'lucide-react'

import { useSearch } from '../../context/SearchContext'
import { searchAPI, apiUtils } from '../../services/api'

const SearchBar = ({ size = 'default', placeholder = 'Search for shoes, brands, or models...' }) => {
  const [localQuery, setLocalQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  const {
    query,
    setQuery,
    suggestions,
    setSuggestions,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    trending,
    setTrending
  } = useSearch()

  // Debounced suggestion fetching
  const debouncedGetSuggestions = useRef(
    apiUtils.debounce(async (searchQuery) => {
      if (searchQuery.length >= 2) {
        setLoadingSuggestions(true)
        try {
          const response = await searchAPI.getSuggestions(searchQuery)
          setSuggestions(response.data.suggestions || [])
        } catch (error) {
          console.error('Failed to fetch suggestions:', error)
          setSuggestions([])
        } finally {
          setLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
      }
    }, 300)
  ).current

  // Load trending searches on mount
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await searchAPI.getTrending()
        setTrending(response.data.trending_searches || [])
      } catch (error) {
        console.error('Failed to fetch trending searches:', error)
      }
    }

    if (trending.length === 0) {
      loadTrending()
    }
  }, [trending.length, setTrending])

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setLocalQuery(value)
    setQuery(value)

    if (value.trim()) {
      debouncedGetSuggestions(value.trim())
    } else {
      setSuggestions([])
    }
  }

  // Handle search submission
  const handleSearch = (searchQuery = localQuery) => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return

    addRecentSearch(trimmedQuery)
    setQuery(trimmedQuery)
    setLocalQuery(trimmedQuery)
    setShowSuggestions(false)

    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion.text)
  }

  // Handle recent search click
  const handleRecentSearchClick = (recentQuery) => {
    handleSearch(recentQuery)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  // Handle clear input
  const handleClear = () => {
    setLocalQuery('')
    setQuery('')
    setSuggestions([])
    searchRef.current?.focus()
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync with global query state
  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  const sizeClasses = {
    small: 'h-10 text-sm',
    default: 'h-12 text-base',
    large: 'h-14 text-lg'
  }

  const showDropdown = showSuggestions && (
    suggestions.length > 0 ||
    recentSearches.length > 0 ||
    trending.length > 0
  )

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={`
              w-full pl-12 pr-12 border border-dark-600 rounded-xl
              focus:outline-none focus:ring-4 focus:ring-primary-900/50 focus:border-primary-500
              transition-all duration-200 bg-dark-800 text-gray-100 placeholder-gray-500
              ${sizeClasses[size]}
            `}
          />

          {/* Clear Button */}
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-800 rounded-xl shadow-strong border border-dark-600 z-50 max-h-96 overflow-y-auto"
          >
            {/* Loading State */}
            {loadingSuggestions && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                <span className="ml-2 text-sm text-gray-500">Loading suggestions...</span>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-200">
                          {suggestion.text}
                        </div>
                        {suggestion.brand && (
                          <div className="text-xs text-gray-500">
                            in {suggestion.brand}
                          </div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !loadingSuggestions && (
              <div className="p-2 border-t border-dark-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Recent Searches
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((recentQuery, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={() => handleRecentSearchClick(recentQuery)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{recentQuery}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {trending.length > 0 && !loadingSuggestions && suggestions.length === 0 && (
              <div className="p-2 border-t border-dark-700">
                <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
                  Trending
                </div>
                {trending.slice(0, 5).map((trendingItem, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={() => handleRecentSearchClick(trendingItem.query)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-300">{trendingItem.query}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {trendingItem.search_count} searches
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar