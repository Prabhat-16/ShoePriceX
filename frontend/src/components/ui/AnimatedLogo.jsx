import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

const AnimatedLogo = ({ size = 'default', showText = true, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizes = {
    small: { icon: 'w-6 h-6', text: 'text-lg', container: 'space-x-2' },
    default: { icon: 'w-8 h-8', text: 'text-xl', container: 'space-x-2' },
    large: { icon: 'w-12 h-12', text: 'text-3xl', container: 'space-x-3' },
    hero: { icon: 'w-16 h-16', text: 'text-5xl', container: 'space-x-4' }
  }

  const currentSize = sizes[size]

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  }

  const iconVariants = {
    hidden: { 
      opacity: 0, 
      rotate: -180,
      scale: 0.5
    },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      rotate: [0, -10, 10, -5, 5, 0],
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  }

  const textVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: (i) => ({
      y: [-2, -4, -2],
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeInOut"
      }
    })
  }

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0.5, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (!mounted) {
    return (
      <div className={`flex items-center ${currentSize.container} ${className}`}>
        <div className={`${currentSize.icon} bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center`}>
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        {showText && (
          <span className={`${currentSize.text} font-bold gradient-text`}>
            ShoePriceX
          </span>
        )}
      </div>
    )
  }

  const logoText = "ShoePriceX"

  return (
    <motion.div
      className={`flex items-center ${currentSize.container} ${className} cursor-pointer`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Icon Container with Glow Effect */}
      <div className="relative">
        {/* Glow Effect */}
        <motion.div
          className={`absolute inset-0 ${currentSize.icon} bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg blur-md`}
          variants={glowVariants}
          initial="hidden"
          animate="visible"
        />
        
        {/* Main Icon */}
        <motion.div
          className={`relative ${currentSize.icon} bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden`}
          variants={iconVariants}
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
          
          <ShoppingBag className={`${size === 'hero' ? 'w-8 h-8' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5'} text-white relative z-10`} />
        </motion.div>
      </div>

      {/* Animated Text */}
      {showText && (
        <motion.div
          className="overflow-hidden"
          variants={textVariants}
        >
          <div className={`${currentSize.text} font-bold flex`}>
            {logoText.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="gradient-text inline-block"
                variants={letterVariants}
                custom={i}
                whileHover="hover"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Floating Particles */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full"
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, (i - 1) * 20],
                y: [0, -20 - i * 5],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}

export default AnimatedLogo