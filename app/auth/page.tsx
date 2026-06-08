// app/auth/page.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { useAuth } from '@/lib/hooks/useAuth'
import { Loader2, Heart, Lock, Camera, Sparkles, ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

function MagneticButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 22 })
  const sy = useSpring(y, { stiffness: 250, damping: 22 })
  const handleMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.35)
    y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }, [x, y])
  const handleLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('mousemove', handleMove as any)
    el.addEventListener('mouseleave', handleLeave)
    return () => { el.removeEventListener('mousemove', handleMove as any); el.removeEventListener('mouseleave', handleLeave) }
  }, [handleMove, handleLeave])
  return <motion.div ref={ref} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>{children}</motion.div>
}

const perks = [
  { icon: Lock, label: 'Completely Private', sub: 'Just you and your partner', gradient: 'from-rose-500 to-pink-500' },
  { icon: Camera, label: 'Unlimited Memories', sub: 'Photos, texts, and moments', gradient: 'from-violet-500 to-purple-500' },
  { icon: Sparkles, label: 'Beautiful Timeline', sub: 'Relive your love story', gradient: 'from-indigo-500 to-blue-500' },
]

export default function AuthPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [hoverCard, setHoverCard] = useState(false)

  useEffect(() => {
    // If session is still loading, wait
    if (sessionStatus === 'loading') return

    // If user has valid session and data is loaded
    if (sessionStatus === 'authenticated' && !authLoading && user) {
      if ((user as any).coupleId) router.push('/dashboard')
      else router.push('/couple')
    }
  }, [session, sessionStatus, user, authLoading, router])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    console.log('[Auth] Starting Google sign-in...')
    try {
      const result = await signIn('google', { callbackUrl: '/couple', redirect: true })
      console.log('[Auth] SignIn result:', result)
      if (result?.error) {
        console.error('[Auth] SignIn error:', result.error)
        toast({ title: 'Sign in failed', description: `Error: ${result.error}. Make sure Google OAuth is configured.`, variant: 'destructive' })
      } else if (result?.ok === false) {
        console.error('[Auth] SignIn failed:', result)
        toast({ title: 'Sign in failed', description: 'Could not sign in with Google. Please check browser console for details.', variant: 'destructive' })
      }
    } catch (error) {
      console.error('[Auth] SignIn exception:', error)
      toast({ title: 'Sign in failed', description: 'Could not sign in with Google. Please try again.', variant: 'destructive' })
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Aurora bg */}
      <div className="absolute inset-0 aurora-bg" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-rose-400/20 blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-400/20 blur-[100px] animate-blob animation-delay-2000" />

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${10 + i * 11}%` }}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.3, 0.3, 0] }}
            transition={{ duration: 15 + i * 2, repeat: Infinity, delay: i * 2, ease: 'linear' }}
          >
            <Heart size={14 + (i % 3) * 8} className="fill-pink-300/50 text-pink-300/50" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:text-left"
        >
          {/* Logo */}
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="h-9 w-9 fill-rose-500 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
            </motion.div>
            <span className="font-serif text-3xl font-bold gradient-text">Couple&apos;s Journal</span>
          </motion.div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
            Your private space<br />
            <span className="gradient-text animate-gradient-text">to write, share,</span><br />
            and remember.
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto lg:mx-0">
            A beautiful journal built exclusively for couples. Encrypted, intimate, and always yours.
          </p>

          {/* Perks */}
          <div className="space-y-4">
            {perks.map(({ icon: Icon, label, sub, gradient }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 p-4 glass-card rounded-2xl border border-white/60 dark:border-white/10 hover:shadow-lg transition-shadow"
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                </div>
                <motion.div
                  className="ml-auto"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 + i }}
                >
                  <ArrowRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — sign in card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
          onMouseEnter={() => setHoverCard(true)}
          onMouseLeave={() => setHoverCard(false)}
        >
          {/* Glow behind card */}
          <motion.div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-0"
            animate={{ opacity: hoverCard ? 0.4 : 0 }}
            style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)' }}
          />

          <div className="relative glass-card rounded-3xl p-8 shadow-2xl border border-white/80 dark:border-white/10">
            {/* Heart illustration */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/40 dark:to-pink-900/40 flex items-center justify-center">
                  <Heart className="h-14 w-14 fill-rose-400 text-rose-400 drop-shadow-[0_0_16px_rgba(244,63,94,0.5)]" />
                </div>
                {/* Orbiting sparkle */}
                <motion.div
                  className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '-20px 50px' }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
              </motion.div>
            </div>

            <h2 className="font-serif text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Welcome</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
              Sign in to continue your love story
            </p>

            <MagneticButton className="w-full">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full h-14 text-base rounded-2xl bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 border-0 font-semibold transition-shadow"
                size="lg"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity=".9" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" opacity=".8" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity=".7" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </MagneticButton>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-3 text-gray-400 font-medium">or</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              New here?{' '}
              <Link href="/auth" className="font-semibold text-rose-500 hover:text-rose-600 transition-colors fancy-underline">
                Create your journal
              </Link>
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {['🔐 End-to-end encrypted', '💸 Always free', '🚫 No ads'].map(badge => (
                <span key={badge} className="text-xs text-gray-400 font-medium">{badge}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
