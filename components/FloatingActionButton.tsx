// components/FloatingActionButton.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, Camera, Image as ImageIcon, X } from 'lucide-react'
import { Button } from './ui/button'
import { AnimatedHeart } from './AnimatedHeart'

interface FloatingActionButtonProps {
  onWriteText: () => void
  onAddPhoto: () => void
  onImportScreenshot: () => void
}

export function FloatingActionButton({
  onWriteText,
  onAddPhoto,
  onImportScreenshot,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: PenLine,
      label: 'Write text',
      onClick: onWriteText,
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: Camera,
      label: 'Add photo',
      onClick: onAddPhoto,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: ImageIcon,
      label: 'Import screenshot',
      onClick: onImportScreenshot,
      gradient: 'from-blue-500 to-blue-600',
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 flex flex-col gap-3"
          >
            {actions.map((action, idx) => (
              <motion.div
                key={action.label}
                initial={{ scale: 0, x: 20, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                exit={{ scale: 0, x: 20, opacity: 0 }}
                transition={{ 
                  delay: idx * 0.08,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
                className="flex items-center gap-3"
              >
                <motion.span 
                  className="glass px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800/20"
                  whileHover={{ scale: 1.05 }}
                >
                  {action.label}
                </motion.span>
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="icon"
                    className={`h-14 w-14 rounded-full shadow-xl bg-gradient-to-br ${action.gradient} hover:shadow-2xl text-white border-2 border-white/20`}
                    onClick={() => {
                      action.onClick()
                      setIsOpen(false)
                    }}
                  >
                    <action.icon className="h-6 w-6" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1, rotate: isOpen ? 0 : 10 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <Button
          size="icon"
          className={`h-16 w-16 rounded-full shadow-2xl transition-all ${
            isOpen 
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
          } text-white border-4 border-white/20`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <AnimatedHeart size={28} variant="beating" color="gradient" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}
