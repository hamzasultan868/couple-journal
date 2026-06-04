// components/EntryCard.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import type { JournalEntry } from '@/lib/firebase/types'
import { useState, useRef } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import Image from 'next/image'
import { Trash2, Heart } from 'lucide-react'
import { Button } from './ui/button'
import { useStore } from '@/lib/store'

interface EntryCardProps {
  entry: JournalEntry
  onDelete?: (id: string) => void
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { user } = useStore()
  const isAuthor = user?.uid === entry.authorId
  const hasMultipleContributors = entry.contributors.length > 1

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 8
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 8
    setTilt({ x, y })
  }

  const handleLike = () => {
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
        onMouseMove={handleMouseMove}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 border transition-shadow duration-300 ${
            hasMultipleContributors
              ? 'border-pink-200 dark:border-pink-800'
              : 'border-gray-100 dark:border-gray-800'
          }`}
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            boxShadow: hovered
              ? hasMultipleContributors
                ? '0 20px 40px rgba(244,63,94,0.15), 0 0 30px rgba(168,85,247,0.1)'
                : '0 20px 40px rgba(0,0,0,0.1)'
              : '0 4px 16px rgba(0,0,0,0.06)',
            y: hovered ? -3 : 0,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Avatar className="ring-2 ring-pink-200 dark:ring-pink-800 ring-offset-2">
                  {entry.authorPhoto && <AvatarImage src={entry.authorPhoto} />}
                  <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-white font-semibold">
                    {getInitials(entry.authorName)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{entry.authorName}</p>
                <p className="text-xs text-gray-400">{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Like button */}
              <motion.button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/50 transition-colors"
                onClick={handleLike}
                whileTap={{ scale: 0.85 }}
              >
                <motion.div
                  animate={liked ? {
                    scale: [1, 1.4, 0.9, 1.1, 1],
                    rotate: [0, -15, 10, -5, 0],
                  } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      liked ? 'fill-rose-500 text-rose-500' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {liked && (
                    <motion.span
                      key="count"
                      initial={{ opacity: 0, scale: 0.5, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="text-xs font-semibold text-rose-500"
                    >
                      {likeCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {isAuthor && onDelete && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-500 transition-colors"
                    onClick={() => onDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Text content */}
          {entry.text && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed text-sm">
              {entry.text}
            </p>
          )}

          {/* Images */}
          {entry.imageUrls.length > 0 && (
            <div className={`grid gap-2 mb-3 ${
              entry.imageUrls.length === 1 ? 'grid-cols-1' :
              entry.imageUrls.length === 2 ? 'grid-cols-2' :
              'grid-cols-2 md:grid-cols-3'
            }`}>
              {entry.imageUrls.map((url, idx) => (
                <motion.div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedImage(url)}
                >
                  <Image src={url} alt={`Memory ${idx + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Multi-contributor badge */}
          {hasMultipleContributors && (
            <div className="flex items-center gap-2 pt-3 border-t border-pink-100 dark:border-pink-900/50">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
              </motion.div>
              <p className="text-xs text-pink-500 dark:text-pink-400 font-medium">
                Both of you contributed to this memory
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black/90 border-0">
          {selectedImage && (
            <motion.div
              className="relative w-full h-[80vh]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image src={selectedImage} alt="Full size" fill className="object-contain rounded-lg" />
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
