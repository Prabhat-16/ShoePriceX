import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  filters: {
    brand: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  suggestions: [],
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  trending: []
}

// Action types
const SEARCH_ACTIONS = {
  SET_QUERY: 'SET_QUERY',
  SET_LOADING: 'SET_LOADING',
  SET_RESULTS: 'SET_RESULTS',
  SET_ERROR: 'SET_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  ADD_RECENT_SEARCH: 'ADD_RECENT_SEARCH',
  CLEAR_RECENT_SEARCHES: 'CLEAR_RECENT_SEARCHES',
  SET_TRENDING: 'SET_TRENDING',
  RESET_SEARCH: 'RESET_SEARCH'
}

// Reducer function
function searchReducer(state, action) {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_QUERY:
      return {
        ...state,
        query: action.payload
      }
    
    case SEARCH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      }
    
    case SEARCH_ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        loading: false,
        error: null
      }
    
    case SEARCH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case SEARCH_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      }
    
    case SEARCH_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      }
    
    case SEARCH_ACTIONS.SET_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.payload
      }
    
    case SEARCH_ACTIONS.ADD_RECENT_SEARCH:
      const newRecentSearches = [
        action.payload,
        ...state.recentSearches.filter(search => search !== action.payload)
      ].slice(0, 10) // Keep only last 10 searches
      
      return {
        ...state,
        recentSearches: newRecentSearches
      }
    
    case SEARCH_ACTIONS.CLEAR_RECENT_SEARCHES:
      return {
        ...state,
        recentSearches: []
      }
    
    case SEARCH_ACTIONS.SET_TRENDING:
      return {
        ...state,
        trending: action.payload
      }
    
    case SEARCH_ACTIONS.RESET_SEARCH:
      return {
        ...initialState,
        recentSearches: state.recentSearches,
        trending: state.trending
      }
    
    default:
      return state
  }
}

// Create context
const SearchContext = createContext()

// Custom hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

// Search provider component
export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState)

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
  }, [state.recentSearches])

  // Action creators
  const actions = {
    setQuery: (query) => {
      dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: query })
    },

    setLoading: (loading) => {
      dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: loading })
    },

    setResults: (results) => {
      dispatch({ type: SEARCH_ACTIONS.SET_RESULTS, payload: results })
    },

    setError: (error) => {
      dispatch({ type: SEARCH_ACTIONS.SET_ERROR, payload: error })
    },

    setFilters: (filters) => {
      dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: filters })
    },

    setPagination: (pagination) => {
      dispatch({ type: SEARCH_ACTIONS.SET_PAGINATION, payload: pagination })
    },

    setSuggestions: (suggestions) => {
      dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: suggestions })
    },

    addRecentSearch: (query) => {
      if (query && query.trim()) {
        dispatch({ type: SEARCH_ACTIONS.ADD_RECENT_SEARCH, payload: query.trim() })
      }
    },

    clearRecentSearches: () => {
      dispatch({ type: SEARCH_ACTIONS.CLEAR_RECENT_SEARCHES })
    },

    setTrending: (trending) => {
      dispatch({ type: SEARCH_ACTIONS.SET_TRENDING, payload: trending })
    },

    resetSearch: () => {
      dispatch({ type: SEARCH_ACTIONS.RESET_SEARCH })
    }
  }

  const value = {
    ...state,
    ...actions
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}