import React, { createContext, useContext, useEffect } from 'react'

// Create context
const ThemeContext = createContext()

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme provider component - Dark mode only
export const ThemeProvider = ({ children }) => {
  // Always dark mode
  const isDark = true
  const theme = 'dark'

  // Apply dark theme immediately on mount
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
    // Remove any light theme classes
    root.classList.remove('light')
    // Set localStorage to dark
    localStorage.setItem('theme', 'dark')
  }, [])

  // No toggle function needed since we're always dark
  const toggleTheme = () => {
    // Do nothing - always stay dark
  }

  const setTheme = () => {
    // Do nothing - always stay dark
  }

  const value = {
    isDark,
    theme,
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}