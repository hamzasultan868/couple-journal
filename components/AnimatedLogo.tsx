// components/AnimatedLogo.tsx
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface AnimatedLogoProps {
  className?: string
  size?: number
}

export function AnimatedLogo({ className = "", size = 200 }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
    >
      {/* Outer glow circle */}
      <motion.circle
        cx="100"
        cy="100"
        r="95"
        fill="url(#outerGlow)"
        initial={{ opacity: 0.3 }}
        animate={{ 
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.05 : 1
        }}
      />

      {/* Main heart - left side */}
      <motion.path
        d="M100 160C100 160 40 120 40 80C40 60 55 45 75 45C85 45 95 50 100 60"
        stroke="url(#gradientPink)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: 1,
          stroke: isHovered ? "url(#gradientPinkBright)" : "url(#gradientPink)"
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Main heart - right side */}
      <motion.path
        d="M100 60C105 50 115 45 125 45C145 45 160 60 160 80C160 120 100 160 100 160"
        stroke="url(#gradientPurple)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: 1,
          stroke: isHovered ? "url(#gradientPurpleBright)" : "url(#gradientPurple)"
        }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Inner decorative hearts */}
      {[
        { x: 70, y: 70, delay: 1, rotate: -15 },
        { x: 100, y: 85, delay: 1.2, rotate: 0 },
        { x: 130, y: 70, delay: 1.4, rotate: 15 },
      ].map((heart, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            scale: isHovered ? 1.2 : 1,
            rotate: heart.rotate
          }}
          transition={{ delay: heart.delay, duration: 0.5 }}
        >
          <path
            d={`M${heart.x} ${heart.y + 3}C${heart.x} ${heart.y + 3} ${heart.x - 3} ${heart.y} ${heart.x - 3} ${heart.y - 2}C${heart.x - 3} ${heart.y - 4} ${heart.x - 1} ${heart.y - 5} ${heart.x} ${heart.y - 4}C${heart.x + 1} ${heart.y - 5} ${heart.x + 3} ${heart.y - 4} ${heart.x + 3} ${heart.y - 2}C${heart.x + 3} ${heart.y} ${heart.x} ${heart.y + 3} ${heart.x} ${heart.y + 3}Z`}
            fill={i === 1 ? "url(#gradientAccent)" : (i === 0 ? "#EC4899" : "#A855F7")}
          />
        </motion.g>
      ))}

      {/* Sparkles */}
      {[
        { x: 50, y: 50, delay: 2 },
        { x: 150, y: 50, delay: 2.2 },
        { x: 100, y: 30, delay: 2.4 },
        { x: 60, y: 140, delay: 2.6 },
        { x: 140, y: 140, delay: 2.8 },
      ].map((sparkle, i) => (
        <motion.g
          key={`sparkle-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isHovered ? [0, 1, 0] : [0, 0.6, 0],
            scale: isHovered ? [0, 1.5, 0] : [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            delay: sparkle.delay,
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <path
            d={`M${sparkle.x} ${sparkle.y - 4}L${sparkle.x} ${sparkle.y + 4}M${sparkle.x - 4} ${sparkle.y}L${sparkle.x + 4} ${sparkle.y}M${sparkle.x - 3} ${sparkle.y - 3}L${sparkle.x + 3} ${sparkle.y + 3}M${sparkle.x - 3} ${sparkle.y + 3}L${sparkle.x + 3} ${sparkle.y - 3}`}
            stroke="#FCD34D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      {/* Infinity symbol behind the heart */}
      <motion.path
        d="M60 100C60 90 65 85 72 85C79 85 84 90 90 100C96 110 101 115 108 115C115 115 120 110 120 100C120 90 125 85 132 85C139 85 144 90 144 100C144 110 139 115 132 115C125 115 120 110 114 100C108 90 103 85 96 85C89 85 84 90 84 100"
        stroke="url(#gradientInfinity)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: isHovered ? 1 : 0,
          opacity: isHovered ? 0.4 : 0
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Gradients */}
      <defs>
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EC4899" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="gradientPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>

        <linearGradient id="gradientPinkBright" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        <linearGradient id="gradientPurpleBright" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        <linearGradient id="gradientAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        <linearGradient id="gradientInfinity" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
