// app/settings/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, LogOut, Trash2, Copy } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { IslaIllustration } from '@/components/IslaIllustration'
import { AnimatedHeart } from '@/components'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const router = useRouter()
  const { user, couple } = useStore()
  const { toast } = useToast()

  // Prevent rendering on server
  if (typeof window === 'undefined') {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth' })
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully',
    })
  }

  const copyInviteCode = () => {
    if (couple?.inviteCode) {
      navigator.clipboard.writeText(couple.inviteCode)
      toast({
        title: 'Copied!',
        description: 'Invite code copied to clipboard',
      })
    }
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  const isPartner1 = user.id === couple?.partner1Id
  const partnerName = isPartner1 ? couple?.partner2Name : couple?.partner1Name
  const partnerPhoto = isPartner1 ? couple?.partner2Photo : couple?.partner1Photo

  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:opacity-20" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 dark:opacity-20" />
      </div>

      {/* Header */}
      <header className="relative glass border-b border-white/20 dark:border-gray-800/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Section */}
          <motion.div 
            className="glass rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/20"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <AnimatedHeart size={20} variant="beating" color="pink" />
              Your Couple
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                <Avatar className="h-16 w-16 border-2 border-pink-200 dark:border-pink-800">
                  {user.photoURL && <AvatarImage src={user.photoURL} />}
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white text-lg">
                    {getInitials(user.displayName || 'You')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <p className="font-semibold text-lg">{user.displayName || 'You'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {partnerName && (
              <>
                <div className="flex items-center justify-center my-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AnimatedHeart size={20} variant="pulse" color="gradient" />
                  </motion.div>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }}>
                    <Avatar className="h-16 w-16 border-2 border-purple-200 dark:border-purple-800">
                      {partnerPhoto && <AvatarImage src={partnerPhoto} />}
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-lg">
                        {getInitials(partnerName)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg">{partnerName}</p>
                    <p className="text-sm text-muted-foreground">Your partner</p>
                  </div>
                </div>
              </>
            )}

            {couple && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Invite Code</p>
                    <p className="font-mono text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {couple.inviteCode}
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" onClick={copyInviteCode} className="border-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Appearance */}
          <motion.div 
            className="glass rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/20"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h2 className="font-serif text-xl font-semibold mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <ThemeToggle />
            </div>
          </motion.div>

          {/* About */}
          <motion.div 
            className="glass rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/20"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <IslaIllustration className="w-20 h-20" />
              </motion.div>
              <div>
                <h2 className="font-serif text-xl font-semibold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Meet Isla
                </h2>
                <p className="text-sm text-muted-foreground">
                  I&apos;m here to help you and your partner create beautiful memories together. 
                  This journal is your private space to share thoughts, photos, and moments 
                  that matter. ✨
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="glass rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-800/20 space-y-3"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div whileHover={{ x: 5 }}>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start border-2"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </motion.div>

            <motion.div whileHover={{ x: 5 }}>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive border-2 border-destructive/20"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Delete Account
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center text-sm text-muted-foreground py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-semibold">Couple&apos;s Journal v1.0</p>
            <p className="mt-1 flex items-center justify-center gap-1">
              Made with <AnimatedHeart size={16} variant="beating" color="pink" className="inline" /> for couples
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
