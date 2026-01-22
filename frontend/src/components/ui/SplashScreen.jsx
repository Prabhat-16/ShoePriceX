import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

const SplashScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLogo(true), 500)
    const timer2 = setTimeout(() => setCurrentStep(1), 1500)
    const timer3 = setTimeout(() => setCurrentStep(2), 3000)
    const timer4 = setTimeout(() => onComplete(), 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  const logoText = "ShoePriceX"

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  }

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -90,
      scale: 0.5
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    })
  }

  const iconVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  }

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 1, 0.7, 1, 0.5],
      scale: [1, 1.2, 1.1, 1.3, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-primary-500/20 rounded-full blur-xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-500/20 rounded-full blur-xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -25, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-24 h-24 bg-accent-500/20 rounded-full blur-xl"
            animate={{
              y: [0, -40, 0],
              x: [0, 30, 0],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center">
          {/* Logo Icon */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                className="mb-8 flex justify-center"
                variants={iconVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl blur-lg"
                    variants={glowVariants}
                    initial="hidden"
                    animate="visible"
                  />
                  
                  {/* Main Icon */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 rounded-2xl"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut"
                      }}
                    />
                    <ShoppingBag className="w-12 h-12 text-white relative z-10" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Text */}
          <div className="flex justify-center items-center space-x-2">
            {logoText.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent"
                variants={letterVariants}
                custom={i}
                style={{
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl text-gray-400 font-light">
              Compare Shoe Prices Across All Stores
            </p>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-primary-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SplashScreen