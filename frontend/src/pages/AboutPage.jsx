import React from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Users,
  Zap,
  Shield,
  Heart,
  TrendingUp,
  Search,
  Clock
} from 'lucide-react'

const AboutPage = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Our intelligent search algorithm finds the exact shoes you\'re looking for across multiple stores.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Comparison',
      description: 'Compare prices in real-time and get notified when prices drop on your favorite shoes.'
    },
    {
      icon: Shield,
      title: 'Trusted Sources',
      description: 'We only track prices from verified and trusted online retailers for your safety.'
    },
    {
      icon: Clock,
      title: 'Price History',
      description: 'View historical price trends to make informed purchasing decisions.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Products Tracked' },
    { number: '5+', label: 'Partner Stores' },
    { number: '₹2,500', label: 'Average Savings' },
    { number: '50,000+', label: 'Happy Users' }
  ]

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
      description: 'Former e-commerce executive with 10+ years of experience in retail technology.'
    },
    {
      name: 'Rahul Patel',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      description: 'Tech enthusiast specializing in web scraping and data analytics.'
    },
    {
      name: 'Anita Kumar',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      description: 'UX designer passionate about creating user-friendly shopping experiences.'
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
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="bg-dark-900 py-20 relative overflow-hidden">
        {/* Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-900/20 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">ShoePriceX</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're on a mission to help shoe enthusiasts find the best deals across
              multiple online stores, saving both time and money in the process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-8 h-8 text-primary-500" />
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                Shopping for shoes online shouldn't be a hassle. We believe everyone deserves
                access to the best prices without spending hours comparing different websites.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                That's why we created ShoePriceX - a comprehensive platform that does the
                hard work for you, tracking prices across major retailers and presenting
                them in an easy-to-understand format.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600"
                alt="Team working"
                className="rounded-2xl shadow-strong"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-900/50 rounded-full opacity-50"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary-900/50 rounded-full opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-400">
              Here's what we've achieved together
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We've built features that actually matter to shoe shoppers
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
                <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-dark-600">
                  <feature.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400">
              The passionate people behind ShoePriceX
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card p-8 text-center card-hover bg-dark-800 border border-dark-700"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-dark-700"
                />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <div className="text-primary-400 font-medium mb-4">
                  {member.role}
                </div>
                <p className="text-gray-400">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Our Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto border border-dark-600">
                  <Users className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">User-First</h3>
                <p className="text-gray-400">
                  Every decision we make is centered around providing the best experience for our users.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto border border-dark-600">
                  <Zap className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Innovation</h3>
                <p className="text-gray-400">
                  We continuously improve our technology to provide faster and more accurate results.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto border border-dark-600">
                  <Heart className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Transparency</h3>
                <p className="text-gray-400">
                  We believe in honest pricing information and clear communication with our users.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-primary-100/90 mb-8">
              Join thousands of smart shoppers who save money with ShoePriceX
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-colors"
              >
                Start Comparing Prices
              </a>
              <a
                href="/contact"
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-colors backdrop-blur-sm"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage