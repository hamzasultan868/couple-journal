// components/EmptyState.tsx
'use client'

import { IslaIllustration } from './IslaIllustration'
import { motion } from 'framer-motion'
import { Sparkles, PenTool, Camera, Share2 } from 'lucide-react'
import { AnimatedHeart } from './AnimatedHeart'

interface EmptyStateProps {
  message?: string
}

const features = [
  { icon: PenTool, label: 'Write journals', color: 'from-blue-400 to-blue-600' },
  { icon: Camera, label: 'Upload photos', color: 'from-purple-400 to-purple-600' },
  { icon: Share2, label: 'Share moments', color: 'from-pink-400 to-pink-600' },
]

export function EmptyState({
  message = "No memories yet – write your first one together"
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <IslaIllustration className="w-48 h-48 mb-6" />
      </motion.div>

      <div className="glass rounded-3xl p-8 max-w-md backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/20 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AnimatedHeart size={32} variant="pulse" color="gradient" />
          </motion.div>
          <Sparkles className="h-6 w-6 text-purple-500" />
        </div>
        
        <p className="text-xl text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold mb-2">
          Start Your Love Story
        </p>
        
        <p className="text-center text-muted-foreground mb-6">
          {message}
        </p>
        
        {/* Features showcase */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {features.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`flex flex-col items-center p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10 dark:bg-opacity-20`}
            >
              <Icon className={`h-5 w-5 mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`} />
              <p className="text-xs font-medium text-center text-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.p 
          className="text-center text-sm text-muted-foreground italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click the ❤️ button below to create your first memory
        </motion.p>
      </div>
    </motion.div>
  )
}
