// components/LoadingAnimation.tsx
'use client'

import { motion } from 'framer-motion'

interface LoadingAnimationProps {
  message?: string
}

export function LoadingAnimation({ message = "Loading..." }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div className="relative w-32 h-32">
        {/* Orbiting hearts */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              width: 16,
              height: 16,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                left: Math.cos(angle * Math.PI / 180) * 50 - 8,
                top: Math.sin(angle * Math.PI / 180) * 50 - 8,
              }}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={`hsl(${(angle + i * 72) % 360}, 70%, 60%)`}
                />
              </svg>
            </motion.div>
          </motion.div>
        ))}

        {/* Center heart */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
            <defs>
              <linearGradient id="centerHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="url(#centerHeartGradient)"
            />
          </svg>
        </motion.div>

        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              borderColor: `rgba(236, 72, 153, ${0.3 - i * 0.1})`,
            }}
            initial={{ width: 32, height: 32, opacity: 1 }}
            animate={{
              width: [32, 120, 120],
              height: [32, 120, 120],
              opacity: [1, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      <motion.p
        className="text-lg font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.p>
    </div>
  )
}
