// components/AnimatedHeart.tsx
'use client'

import { motion } from 'framer-motion'

interface AnimatedHeartProps {
  className?: string
  size?: number
  variant?: 'beating' | 'floating' | 'pulse' | 'fill'
  color?: 'pink' | 'purple' | 'blue' | 'gradient'
}

export function AnimatedHeart({ 
  className = "", 
  size = 24,
  variant = 'beating',
  color = 'gradient'
}: AnimatedHeartProps) {
  
  const animations = {
    beating: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
    },
    floating: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
    fill: {
      pathLength: [0, 1],
      fill: ["transparent", "currentColor"],
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  }

  const colors = {
    pink: '#EC4899',
    purple: '#A855F7',
    blue: '#3B82F6',
    gradient: 'url(#heartGradient)'
  }

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={animations[variant]}
    >
      <motion.path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color === 'gradient' ? 'url(#heartGradient)' : colors[color]}
        stroke={color === 'gradient' ? 'url(#heartGradient)' : colors[color]}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Sparkle effect */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <path
          d="M12 3L13 6L12 9L11 6L12 3ZM19 8L16 9L13 8L16 7L19 8ZM19 16L16 15L13 16L16 17L19 16ZM5 8L8 9L11 8L8 7L5 8ZM5 16L8 15L11 16L8 17L5 16Z"
          fill="#FCD34D"
        />
      </motion.g>

      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
