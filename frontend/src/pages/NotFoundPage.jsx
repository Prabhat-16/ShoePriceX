import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-primary-200 mb-4">404</div>
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-primary-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back on track.
          </p>

          <div className="space-y-4">
            <Link
              to="/"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            
            <Link
              to="/search"
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Shoes</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-ghost w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>
              If you think this is a mistake, please{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 underline">
                contact us
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage