// app/couple/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useStore } from '@/lib/store'
import { createCouple, joinCoupleByCode, joinCoupleByEmail } from '@/lib/supabase/couples'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IslaIllustration } from '@/components/IslaIllustration'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import { Copy, Loader2, Heart } from 'lucide-react'
import { useConfetti } from '@/lib/hooks/useConfetti'
import { useAuth } from '@/lib/hooks/useAuth'
import { AnimatedHeart, AnimatedLogo, LoadingAnimation } from '@/components'

export default function CouplePage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const { user, isLoading: authLoading } = useAuth()
  const { couple, setCouple } = useStore()
  const { toast } = useToast()
  const { triggerConfetti } = useConfetti()
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [inviteCode, setInviteCode] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [myInviteCode, setMyInviteCode] = useState<string | null>(null)

  useEffect(() => {
    // If NextAuth session is still loading, wait
    if (sessionStatus === 'loading') return

    // If no session and auth is done loading, redirect to auth
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth')
    } 
    // If user has couple, redirect to dashboard
    else if (couple && !authLoading) {
      router.push('/dashboard')
    }
  }, [session, sessionStatus, couple, authLoading, router])

  const handleCreateCouple = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const newCouple = await createCouple(user.id, user.displayName || 'You', user.photoURL)
      setCouple(newCouple)
      setMyInviteCode(newCouple.inviteCode)
      triggerConfetti()
      toast({
        title: 'Couple created!',
        description: 'Share your invite code with your partner',
      })
      // Redirect to dashboard after couple is created
      setTimeout(() => router.push('/dashboard'), 500)
    } catch (error) {
      console.error('Error creating couple:', error)
      toast({
        title: 'Failed to create couple',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinByCode = async () => {
    if (!user || !inviteCode.trim()) return
    setIsLoading(true)
    try {
      const joinedCouple = await joinCoupleByCode(inviteCode.trim(), user.id, user.displayName || 'You', user.photoURL)
      if (joinedCouple) {
        setCouple(joinedCouple)
        triggerConfetti()
        toast({
          title: 'Joined successfully!',
          description: 'You are now connected with your partner',
        })
        router.push('/dashboard')
      } else {
        toast({
          title: 'Invalid code',
          description: 'Could not find a couple with this code',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error joining couple:', error)
      toast({
        title: 'Failed to join',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinByEmail = async () => {
    if (!user || !partnerEmail.trim()) return
    setIsLoading(true)
    try {
      const joinedCouple = await joinCoupleByEmail(partnerEmail.trim(), user.id, user.displayName || 'You', user.photoURL)
      if (joinedCouple) {
        setCouple(joinedCouple)
        triggerConfetti()
        toast({
          title: 'Joined successfully!',
          description: 'You are now connected with your partner',
        })
        router.push('/dashboard')
      } else {
        toast({
          title: 'Not found',
          description: 'Could not find your partner or they have not created a couple yet',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error joining couple:', error)
      toast({
        title: 'Failed to join',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyInviteCode = () => {
    if (myInviteCode) {
      navigator.clipboard.writeText(myInviteCode)
      toast({
        title: 'Copied!',
        description: 'Invite code copied to clipboard',
      })
    }
  }

  // Show loading while user data is being fetched from Supabase
  if (authLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
          <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <Heart className="h-12 w-12 fill-rose-400 text-rose-400 drop-shadow-[0_0_16px_rgba(244,63,94,0.6)]" />
          <p className="text-sm text-gray-400 font-medium">Preparing your journal...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-800/20"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <IslaIllustration className="w-24 h-24 mx-auto mb-6" />
        </motion.div>

        {mode === 'choose' && (
          <>
            <h1 className="font-serif text-3xl font-bold text-center text-foreground mb-2">
              Connect with Your Partner
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Create a new couple journal or join your partner&apos;s
            </p>
            
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl p-4 mb-8 border border-rose-200 dark:border-rose-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">🎯 Here&apos;s how it works:</span><br/>
                1️⃣ Create a couple or join your partner<br/>
                2️⃣ Share the invite code<br/>
                3️⃣ Write entries, upload photos, build your love story together
              </p>
            </div>

            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setMode('create')}
                  className="w-full h-12 text-base bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg"
                  size="lg"
                >
                  <AnimatedHeart size={20} variant="beating" color="gradient" className="mr-2" />
                  Create New Couple
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setMode('join')}
                  variant="outline"
                  className="w-full h-12 text-base border-2"
                  size="lg"
                >
                  Join Existing Couple
                </Button>
              </motion.div>
            </div>
          </>
        )}

        {mode === 'create' && !myInviteCode && (
          <>
            <h1 className="font-serif text-3xl font-bold text-center text-foreground mb-2">
              Create Your Couple Journal
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Get started and invite your partner to write and share memories together
            </p>
            
            <div className="bg-rose-50 dark:bg-rose-950/20 rounded-lg p-4 mb-6 border border-rose-200 dark:border-rose-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold block mb-2">✨ What happens next:</span>
                You&apos;ll get a unique invite code to share with your partner. They&apos;ll enter it to join your couple, and you&apos;ll unlock the full dashboard to write journals, upload photos, and build your love story together.
              </p>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCreateCouple}
                disabled={isLoading}
                className="w-full h-12 text-base bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Generate Invite Code'
                )}
              </Button>
            </motion.div>

            <Button
              onClick={() => setMode('choose')}
              variant="ghost"
              className="w-full mt-4"
            >
              Back
            </Button>
          </>
        )}

        {mode === 'create' && myInviteCode && (
          <>
            <h1 className="font-serif text-3xl font-bold text-center text-foreground mb-2">
              Your Couple is Created! 💕
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Share this code with your partner so they can join
            </p>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-8 text-center mb-6 border border-pink-200 dark:border-pink-800">
              <p className="text-sm text-muted-foreground mb-2">Your Invite Code</p>
              <motion.p 
                className="text-6xl font-bold font-mono tracking-wider bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {myInviteCode}
              </motion.p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={copyInviteCode}
                  variant="outline"
                  className="mt-4"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </Button>
              </motion.div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold block mb-2">📋 Share this code with your partner:</span>
                They can enter this code in the &quot;Join Existing Couple&quot; section to connect with you.
              </p>
            </div>

            <p className="text-sm text-center text-muted-foreground mb-6">
              ⏳ Waiting for your partner to join...
            </p>

            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-sage-500 to-emerald-500 hover:from-sage-600 hover:to-emerald-600"
            >
              Start Writing While You Wait
            </Button>
          </>
        )}

        {mode === 'join' && (
          <>
            <h1 className="font-serif text-3xl font-bold text-center text-foreground mb-2">
              Join Your Partner&apos;s Journal
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Your partner has created a couple journal. Enter their invite code to connect!
            </p>
            
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 mb-6 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold block mb-2">💌 Ask your partner for:</span>
                A 6-digit invite code that they got after creating their couple journal
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="code" className="font-semibold">Invite Code (6 digits)</Label>
                <Input
                  id="code"
                  placeholder="123456"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-wider"
                />
                <Button
                  onClick={handleJoinByCode}
                  disabled={isLoading || inviteCode.length !== 6}
                  className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join with Code'
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-semibold">Partner&apos;s Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="partner@example.com"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                />
                <Button
                  onClick={handleJoinByEmail}
                  disabled={isLoading || !partnerEmail.includes('@')}
                  variant="outline"
                  className="w-full mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join with Email'
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={() => setMode('choose')}
              variant="ghost"
              className="w-full mt-4"
            >
              Back
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
