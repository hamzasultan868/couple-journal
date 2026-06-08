// components/EntryCard.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import type { JournalEntry } from '@/lib/supabase/types'
import { useState } from 'react'
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
  const { user } = useStore()
  const isAuthor = user?.id === entry.authorId
  const hasMultipleContributors = entry.contributors.length > 1

  const handleLike = () => {
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br border transition-all duration-300 ${
          hasMultipleContributors
            ? 'from-white/15 to-white/5 border-pink-500/30 hover:border-pink-500/50 hover:from-white/20'
            : 'from-white/10 to-white/5 border-white/20 hover:border-white/30 hover:from-white/15'
        }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="ring-2 ring-pink-500/50">
                {entry.authorPhoto && <AvatarImage src={entry.authorPhoto} />}
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold">
                  {getInitials(entry.authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white text-sm">{entry.authorName}</p>
                <p className="text-xs text-gray-300">{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Like button */}
              <motion.button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
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
                      liked ? 'fill-pink-500 text-pink-500' : 'text-gray-300'
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
                      className="text-xs font-semibold text-pink-400"
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
                    className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors text-gray-300"
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
            <p className="text-gray-100 mb-4 whitespace-pre-wrap leading-relaxed text-sm">
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
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(url)}
                >
                  <Image src={url} alt={`Memory ${idx + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110 rounded-xl" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Multi-contributor badge */}
          {hasMultipleContributors && (
            <div className="flex items-center gap-2 pt-3 border-t border-pink-500/20">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
              </motion.div>
              <p className="text-xs text-pink-300 font-medium">
                Both of you contributed to this memory
              </p>
            </div>
          )}
        </div>
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
