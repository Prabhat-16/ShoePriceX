import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ComparePage from './pages/ComparePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

// Context Providers
import { SearchProvider } from './context/SearchContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const location = useLocation()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  }

  return (
    <ThemeProvider>
      <SearchProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
          {/* Navigation */}
          <Navbar />
          
          {/* Main Content */}
          <main className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <HomePage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <SearchResultsPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/product/:id" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductDetailPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/compare/:id" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ComparePage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AboutPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <NotFoundPage />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </main>
          
          {/* Footer */}
          <Footer />

          {/* Background Elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Animated Background Orbs */}
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-primary-200/20 dark:bg-primary-800/20 rounded-full blur-xl"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200/20 dark:bg-secondary-800/20 rounded-full blur-xl"
              animate={{
                y: [0, 20, 0],
                x: [0, -15, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent-200/20 dark:bg-accent-800/20 rounded-full blur-xl"
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />
          </div>
        </div>
      </SearchProvider>
    </ThemeProvider>
  )
}

export default App