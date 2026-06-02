// components/CoupleIllustration.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const loveQuotes = [
  "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "The best thing to hold onto in life is each other.",
  "You are my today and all of my tomorrows.",
  "I love you not only for what you are, but for what I am when I am with you.",
  "Every love story is beautiful, but ours is my favorite.",
  "Together is a wonderful place to be.",
  "I choose you. And I'll choose you over and over and over. Without pause, without a doubt, in a heartbeat. I'll keep choosing you.",
  "You're my favorite notification.",
  "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.",
]

interface CoupleIllustrationProps {
  className?: string
}

export function CoupleIllustration({ className = "" }: CoupleIllustrationProps) {
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % loveQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative w-full h-full min-h-[600px] flex flex-col items-center justify-center p-8 ${className}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#EC4899' : i % 3 === 1 ? '#A855F7' : '#3B82F6',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Glowing orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: 100 + Math.random() * 200,
              height: 100 + Math.random() * 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0
                  ? 'rgba(236, 72, 153, 0.1)'
                  : i % 3 === 1
                  ? 'rgba(168, 85, 247, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)'
              } 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Illustration */}
      <motion.svg
        viewBox="0 0 800 600"
        className="w-full max-w-3xl relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="person1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="person2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <motion.circle
          cx="400"
          cy="300"
          r="250"
          fill="url(#glowGradient)"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Floating hearts background */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const radius = 200
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <path
                d={`M${400 + Math.cos(angle) * radius} ${300 + Math.sin(angle) * radius}
                   c-4,-8 -16,-8 -20,0 c0,8 8,12 10,16 c2,-4 10,-8 10,-16z`}
                fill="#EC4899"
                opacity="0.3"
              />
            </motion.g>
          )
        })}

        {/* Person 1 - Left */}
        <motion.g
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Body */}
          <motion.ellipse
            cx="250"
            cy="350"
            rx="80"
            ry="120"
            fill="url(#person1Gradient)"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Head */}
          <motion.circle
            cx="250"
            cy="220"
            r="60"
            fill="#FFD4A3"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Hair */}
          <motion.ellipse
            cx="250"
            cy="200"
            rx="65"
            ry="50"
            fill="#8B4513"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
          />
          
          {/* Eyes */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
          >
            <circle cx="235" cy="215" r="4" fill="#2D3748" />
            <circle cx="265" cy="215" r="4" fill="#2D3748" />
          </motion.g>
          
          {/* Smile */}
          <motion.path
            d="M 235 235 Q 250 245 265 235"
            stroke="#EC4899"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={{ d: ["M 235 235 Q 250 245 265 235", "M 235 235 Q 250 250 265 235", "M 235 235 Q 250 245 265 235"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Arms */}
          <motion.ellipse
            cx="180"
            cy="350"
            rx="25"
            ry="90"
            fill="url(#person1Gradient)"
            style={{ transformOrigin: '180px 350px' }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.ellipse
            cx="320"
            cy="350"
            rx="25"
            ry="90"
            fill="url(#person1Gradient)"
            style={{ transformOrigin: '320px 350px' }}
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.g>

        {/* Person 2 - Right */}
        <motion.g
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {/* Body */}
          <motion.ellipse
            cx="550"
            cy="350"
            rx="80"
            ry="120"
            fill="url(#person2Gradient)"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
          />
          
          {/* Head */}
          <motion.circle
            cx="550"
            cy="220"
            r="60"
            fill="#FFD4A3"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
          />
          
          {/* Hair */}
          <motion.path
            d="M 490 200 Q 550 150 610 200 L 610 220 Q 550 180 490 220 Z"
            fill="#3D2817"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
          />
          
          {/* Eyes */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
          >
            <circle cx="535" cy="215" r="4" fill="#2D3748" />
            <circle cx="565" cy="215" r="4" fill="#2D3748" />
          </motion.g>
          
          {/* Smile */}
          <motion.path
            d="M 535 235 Q 550 245 565 235"
            stroke="#A855F7"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={{ d: ["M 535 235 Q 550 245 565 235", "M 535 235 Q 550 250 565 235", "M 535 235 Q 550 245 565 235"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          {/* Arms */}
          <motion.ellipse
            cx="480"
            cy="350"
            rx="25"
            ry="90"
            fill="url(#person2Gradient)"
            style={{ transformOrigin: '480px 350px' }}
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.ellipse
            cx="620"
            cy="350"
            rx="25"
            ry="90"
            fill="url(#person2Gradient)"
            style={{ transformOrigin: '620px 350px' }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
        </motion.g>

        {/* Central Heart */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, type: "spring" }}
        >
          <motion.path
            d="M 400 280 
               L 380 260 C 370 250 350 250 340 260 C 330 270 330 285 340 295 
               L 400 355 
               L 460 295 C 470 285 470 270 460 260 C 450 250 430 250 420 260 
               L 400 280 Z"
            fill="url(#heartGradient)"
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          {/* Heart sparkles */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            const radius = 60
            return (
              <motion.circle
                key={i}
                cx={400 + Math.cos(angle) * radius}
                cy={300 + Math.sin(angle) * radius}
                r="3"
                fill="#FCD34D"
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            )
          })}
        </motion.g>

        {/* Connecting line/bond */}
        <motion.path
          d="M 330 350 Q 400 330 470 350"
          stroke="url(#heartGradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="10 5"
          animate={{
            strokeDashoffset: [0, -30],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.svg>

      {/* Love Quote Carousel */}
      <div className="relative z-10 mt-8 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.p
              className="text-xl md:text-2xl font-serif italic text-gray-700 dark:text-gray-200 px-6"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                background: 'linear-gradient(90deg, #EC4899, #A855F7, #3B82F6, #EC4899)',
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              "{loveQuotes[quoteIndex]}"
            </motion.p>
            
            {/* Quote indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {loveQuotes.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setQuoteIndex(i)}
                  className="w-2 h-2 rounded-full cursor-pointer"
                  animate={{
                    scale: i === quoteIndex ? 1.5 : 1,
                    backgroundColor: i === quoteIndex ? '#EC4899' : '#D1D5DB',
                  }}
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative elements at corners */}
      <motion.div
        className="absolute top-4 left-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path
            d="M30 10 L32 25 L45 20 L35 30 L48 35 L33 33 L35 48 L30 35 L25 48 L27 33 L12 35 L25 30 L15 20 L28 25 Z"
            fill="#EC4899"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-4 right-4"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path
            d="M30 10 L32 25 L45 20 L35 30 L48 35 L33 33 L35 48 L30 35 L25 48 L27 33 L12 35 L25 30 L15 20 L28 25 Z"
            fill="#A855F7"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.3" />
          <circle cx="25" cy="25" r="15" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.3" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-4"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#EC4899" strokeWidth="2" opacity="0.3" />
          <circle cx="25" cy="25" r="15" fill="none" stroke="#EC4899" strokeWidth="2" opacity="0.3" />
        </svg>
      </motion.div>
    </div>
  )
}
