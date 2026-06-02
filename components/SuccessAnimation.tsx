// components/SuccessAnimation.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SuccessAnimationProps {
  onComplete?: () => void
}

export function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => {
      onComplete?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti */}
      {showConfetti && [...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: 200,
            y: 200,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: 200 + (Math.random() - 0.5) * 600,
            y: 200 + Math.random() * 600,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: "easeOut",
          }}
        >
          <div
            style={{
              width: 8 + Math.random() * 8,
              height: 8 + Math.random() * 8,
              backgroundColor: ['#EC4899', '#A855F7', '#3B82F6', '#FCD34D', '#10B981'][Math.floor(Math.random() * 5)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            }}
          />
        </motion.div>
      ))}

      {/* Center animation */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Check mark circle */}
        <motion.div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 50%, #3B82F6 100%)',
          }}
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Check mark */}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Orbiting hearts */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              width: 20,
              height: 20,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: 0.8 + i * 0.2,
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                left: Math.cos(angle * Math.PI / 180) * 80 - 10,
                top: Math.sin(angle * Math.PI / 180) * 80 - 10,
              }}
              animate={{
                scale: [0, 1, 0.8],
              }}
              transition={{
                duration: 0.5,
                delay: 0.8 + i * 0.1,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={['#EC4899', '#A855F7', '#3B82F6'][i]}
                />
              </svg>
            </motion.div>
          </motion.div>
        ))}

        {/* Sparkles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * Math.PI / 180
          return (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: Math.cos(angle) * 100 - 2,
                marginTop: Math.sin(angle) * 100 - 2,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.5 + i * 0.1,
              }}
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Success text */}
      <motion.div
        className="absolute top-2/3 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Success!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your memory has been saved ✨
        </p>
      </motion.div>
    </div>
  )
}
