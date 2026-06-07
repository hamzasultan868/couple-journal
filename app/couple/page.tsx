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
import { Copy, Loader2, Heart, Sparkles, Users, Mail } from 'lucide-react'
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
    if (!user) {
      console.log('[handleCreateCouple] User not loaded yet, skipping')
      toast({
        title: 'Please wait',
        description: 'Still loading your profile...',
        variant: 'destructive',
      })
      return
    }
    
    if (!user.id) {
      console.log('[handleCreateCouple] User ID missing')
      toast({
        title: 'Error',
        description: 'User information is missing. Please refresh and try again.',
        variant: 'destructive',
      })
      return
    }
    
    setIsLoading(true)
    console.log('[handleCreateCouple] Starting couple creation for user:', user.id)
    
    try {
      const newCouple = await createCouple(user.id, user.displayName || 'You', user.photoURL)
      console.log('[handleCreateCouple] Couple created successfully:', newCouple.id)
      
      setCouple(newCouple)
      setMyInviteCode(newCouple.inviteCode)
      triggerConfetti()
      
      toast({
        title: 'Couple created!',
        description: 'Share your invite code with your partner',
      })
      
      // Redirect to dashboard after couple is created
      setTimeout(() => {
        console.log('[handleCreateCouple] Redirecting to dashboard')
        router.push('/dashboard')
      }, 500)
    } catch (error) {
      console.error('[handleCreateCouple] Error creating couple:', error)
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      toast({
        title: 'Failed to create couple',
        description: errorMessage,
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Premium animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50 dark:from-slate-950 dark:via-pink-950 dark:to-purple-950">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg w-full"
      >
        {mode === 'choose' && (
          <>
            {/* Premium header section */}
            <div className="text-center mb-12">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full backdrop-blur-xl border border-pink-300/30 dark:border-pink-700/30 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-pink-500" />
                </div>
              </motion.div>
              <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Begin Together
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
                Start your shared love story
              </p>
            </div>

            {/* Steps cards */}
            <div className="grid gap-3 mb-8">
              {[
                { icon: Users, label: 'Create or Join', desc: 'Connect with your partner' },
                { icon: Copy, label: 'Share Code', desc: 'One unique invite code' },
                { icon: Sparkles, label: 'Build Together', desc: 'Create beautiful memories' }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-4 backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/20 dark:border-white/10 hover:border-pink-300/50 dark:hover:border-pink-500/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{step.label}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setMode('create')}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                size="lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Create New Couple
              </Button>

              <Button
                onClick={() => setMode('join')}
                variant="outline"
                className="w-full h-14 text-base font-semibold glass backdrop-blur-xl border-2 border-white/30 dark:border-white/20 hover:border-pink-300 dark:hover:border-pink-500 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
                size="lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Existing Couple
              </Button>
            </div>
          </>
        )}

        {mode === 'create' && !myInviteCode && (
          <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                Create Your Couple
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Start a beautiful shared journal
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20 space-y-3">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-2">What Happens Next</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    We&apos;ll generate a unique 6-digit code that you can share with your partner. They&apos;ll enter it to connect, and together you&apos;ll unlock the full dashboard to write journals, upload photos, and build your love story.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateCouple}
              disabled={isLoading}
              className="w-full h-12 font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Code...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  Generate Invite Code
                </>
              )}
            </Button>

            <Button
              onClick={() => setMode('choose')}
              variant="ghost"
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}

        {mode === 'create' && myInviteCode && (
          <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
                You&apos;re All Set
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Share this code with your partner</p>
            </div>

            {/* Invite code display */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 dark:from-pink-500/10 dark:to-purple-500/10 rounded-3xl p-8 border border-pink-300/30 dark:border-pink-500/20 text-center"
            >
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wider">Invite Code</p>
              <motion.p 
                className="text-6xl font-mono font-bold text-slate-900 dark:text-white tracking-widest mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {myInviteCode}
              </motion.p>
              <p className="text-xs text-slate-500 dark:text-slate-500">This is your unique 6-digit code</p>
            </motion.div>

            <Button
              onClick={copyInviteCode}
              className="w-full h-12 font-semibold bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copy Code
            </Button>

            <div className="bg-blue-500/10 dark:bg-blue-500/5 rounded-2xl p-4 border border-blue-300/30 dark:border-blue-500/20">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <span className="font-semibold block mb-2">Next Step</span>
                Share this code with your partner so they can join your couple journal. Once they enter the code, you&apos;ll be connected and can start creating memories together.
              </p>
            </div>

            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full h-12 font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {mode === 'join' && (
          <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                Join Your Partner
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Enter your partner&apos;s code to connect
              </p>
            </div>

            {/* Tabs for code/email */}
            <div className="space-y-4">
              {/* Code input */}
              <div className="space-y-3">
                <Label htmlFor="code" className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Copy className="w-4 h-4 text-pink-500" />
                  6-Digit Code
                </Label>
                <Input
                  id="code"
                  placeholder="Enter code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-3xl font-mono tracking-widest h-14 glass backdrop-blur border-white/30 dark:border-white/20"
                />
                <Button
                  onClick={handleJoinByCode}
                  disabled={isLoading || inviteCode.length !== 6}
                  className="w-full h-12 font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-5 w-5" />
                      Join with Code
                    </>
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 text-sm text-slate-500 dark:text-slate-500 bg-white/80 dark:bg-white/10">or</span>
                </div>
              </div>

              {/* Email input */}
              <div className="space-y-3">
                <Label htmlFor="email" className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  Partner&apos;s Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="partner@example.com"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="h-12 glass backdrop-blur border-white/30 dark:border-white/20"
                />
                <Button
                  onClick={handleJoinByEmail}
                  disabled={isLoading || !partnerEmail.includes('@')}
                  variant="outline"
                  className="w-full h-12 font-semibold glass backdrop-blur border-white/30 dark:border-white/20 hover:border-purple-300 dark:hover:border-purple-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Join with Email
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={() => setMode('choose')}
              variant="ghost"
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
