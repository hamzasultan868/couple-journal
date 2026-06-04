// app/dashboard/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useEntries } from '@/lib/hooks/useEntries'
import { useStore } from '@/lib/store'
import { EntryCard } from '@/components/EntryCard'
import { EmptyState } from '@/components/EmptyState'
import { FloatingActionButton } from '@/components/FloatingActionButton'
import { NewEntryDialog } from '@/components/NewEntryDialog'
import { deleteEntry } from '@/lib/supabase/entries'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Settings, Heart, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { LoadingAnimation } from '@/components'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { entries } = useEntries()
  const { couple } = useStore()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'text' | 'photo' | 'screenshot'>('text')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    } else if (!isLoading && user && !couple) {
      router.push('/couple')
    }
  }, [user, couple, isLoading, router])

  const handleDelete = async (entryId: string) => {
    const entry = entries.find(e => e.id === entryId)
    if (!entry) return

    try {
      await deleteEntry(entryId, entry.imageUrls)
      toast({
        title: 'Memory deleted',
        description: 'The entry has been removed',
      })
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading || !user || !couple) {
    return (
      <div className="flex items-center justify-center min-h-screen aurora-bg">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <Heart className="h-12 w-12 fill-rose-400 text-rose-400 drop-shadow-[0_0_16px_rgba(244,63,94,0.6)]" />
          <p className="text-sm text-gray-400 font-medium">Loading your memories...</p>
        </motion.div>
      </div>
    )
  }

  const partnerName = user.id === couple.partner1Id ? couple.partner2Name : couple.partner1Name

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 aurora-bg -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-pink-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob dark:opacity-20" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 dark:opacity-20" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/25 dark:border-gray-800/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-serif text-2xl md:text-3xl font-bold gradient-text">Our Journal</h1>
            {partnerName && (
              <motion.p
                className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                You &amp; {partnerName}
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Heart className="inline h-3 w-3 fill-rose-400 text-rose-400" />
                </motion.span>
              </motion.p>
            )}
          </motion.div>

          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-pink-100 dark:border-pink-900/50 text-xs font-medium text-pink-500"
              >
                <Sparkles className="h-3 w-3" />
                {entries.length} {entries.length === 1 ? 'memory' : 'memories'}
              </motion.div>
            )}
            <Link href="/settings">
              <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/60 dark:hover:bg-gray-800/60">
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <main className="relative container mx-auto px-4 py-8 pb-28 max-w-2xl">
        {entries.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence>
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {entries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.08, 0.5), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <EntryCard entry={entry} onDelete={handleDelete} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* FAB */}
      <FloatingActionButton
        onWriteText={() => {
          setDialogMode('text')
          setDialogOpen(true)
        }}
        onAddPhoto={() => {
          setDialogMode('photo')
          setDialogOpen(true)
        }}
        onImportScreenshot={() => {
          setDialogMode('screenshot')
          setDialogOpen(true)
        }}
      />

      <NewEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialMode={dialogMode}
      />
    </div>
  )
}
