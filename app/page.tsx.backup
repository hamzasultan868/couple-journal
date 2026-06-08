// app/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Shield, Camera, MessageCircle, Calendar, ArrowRight,
  Heart, Sparkles, Star, BookOpen, Lock, Zap, Users, Image as ImageIcon, Bookmark
} from 'lucide-react'
import {
  motion, useScroll, useTransform, useMotionValue, useSpring,
  AnimatePresence, useInView
} from 'framer-motion'
import Link from 'next/link'

/* ─────────────────────────────
   AURORA — mouse-reactive background
───────────────────────────────*/
function AuroraBackground() {
  const [pos, setPos] = useState({ x: 50, y: 40 })

  useEffect(() => {
    let raf: number
    let tx = 50, ty = 40, cx = 50, cy = 40

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 100
      ty = (e.clientY / window.innerHeight) * 100
    }
    const tick = () => {
      cx += (tx - cx) * 0.04
      cy += (ty - cy) * 0.04
      setPos({ x: cx, y: cy })
      raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('mousemove', onMove)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove) }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 aurora-bg" />
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[120px] opacity-30"
        style={{
          background: 'radial-gradient(circle, #f9a8d4 0%, #f43f5e 40%, transparent 70%)',
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 1.2s cubic-bezier(0.16,1,0.3,1), top 1.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #c084fc 0%, #7c3aed 40%, transparent 70%)',
          left: `${100 - pos.x}%`,
          top: `${100 - pos.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 1.8s cubic-bezier(0.16,1,0.3,1), top 1.8s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-15 animate-blob animation-delay-4000"
        style={{
          background: 'radial-gradient(circle, #67e8f9, #6366f1)',
          left: '55%', top: '60%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}

/* ─────────────────────────────
   MAGNETIC BUTTON WRAPPER
───────────────────────────────*/
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
    return () => {
      el.removeEventListener('mousemove', handleMove as any)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [handleMove, handleLeave])

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────
   PARTICLE BURST ON CLICK
───────────────────────────────*/
function ParticleBurst({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<{ id: number; angle: number; dist: number }[]>([])

  useEffect(() => {
    if (trigger === 0) return
    const p = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 12) * 360,
      dist: 40 + Math.random() * 40,
    }))
    setParticles(p)
    const t = setTimeout(() => setParticles([]), 800)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <AnimatePresence>
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180
        return (
          <motion.span
            key={p.id}
            className="absolute pointer-events-none text-sm z-10"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(rad) * p.dist,
              y: Math.sin(rad) * p.dist,
              scale: 0.2,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', position: 'absolute' }}
          >
            {[<Heart key="h" className="h-3 w-3 text-rose-400 fill-rose-400" />, <Sparkles key="s" className="h-3 w-3 text-violet-400" />, <Star key="st" className="h-3 w-3 text-pink-400 fill-pink-400" />, <Zap key="z" className="h-3 w-3 text-amber-400 fill-amber-400" />][p.id % 4]}
          </motion.span>
        )
      })}
    </AnimatePresence>
  )
}

/* ─────────────────────────────
   ANIMATED COUNTER
───────────────────────────────*/
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / 60
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(timer) } else { setVal(Math.floor(start)) }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

/* ─────────────────────────────
   FEATURE CARD
───────────────────────────────*/
const featureCards = [
  {
    icon: Shield,
    badgeIcon: Lock,
    title: 'Private & Encrypted',
    description: 'Your moments are end-to-end protected. Only you and your partner can see what you share.',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.3)',
    delay: 0,
  },
  {
    icon: Camera,
    badgeIcon: Camera,
    title: 'Photos & Memories',
    description: 'Upload unlimited photos, create albums, and build a visual love story you can revisit forever.',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'rgba(168,85,247,0.3)',
    delay: 0.1,
  },
  {
    icon: MessageCircle,
    badgeIcon: MessageCircle,
    title: 'Intimate Messages',
    description: 'Write heartfelt notes, share feelings, and stay emotionally connected across any distance.',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'rgba(99,102,241,0.3)',
    delay: 0.2,
  },
  {
    icon: Calendar,
    badgeIcon: Calendar,
    title: 'Timeline of Love',
    description: 'Your entire relationship, beautifully arranged chronologically. Scroll through your love story.',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
    delay: 0.3,
  },
]

function FeatureCard({ card }: { card: typeof featureCards[0] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 14
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 14
    setTilt({ x, y })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: card.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      onMouseMove={handleMouseMove}
      className="relative group"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="glass-card rounded-2xl p-7 h-full border border-white/60 dark:border-white/10 transition-shadow duration-300"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          boxShadow: hovered
            ? `0 24px 48px rgba(0,0,0,0.12), 0 0 40px ${card.glow}`
            : '0 4px 24px rgba(0,0,0,0.06)',
          y: hovered ? -6 : 0,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} mb-5 shadow-lg`}
          animate={hovered ? { scale: 1.12, rotate: [0, -6, 6, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <card.icon className="h-7 w-7 text-white" />
        </motion.div>

        <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-white">{card.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{card.description}</p>

        <motion.span
          className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm shadow"
          animate={hovered ? { y: [0, -4, 0], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
        >
          <card.badgeIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────
   FLOATING HEARTS
───────────────────────────────*/
function FloatingHearts() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${8 + i * 9}%` }}
          initial={{ y: '110vh', opacity: 0, rotate: Math.random() * 40 - 20 }}
          animate={{ y: '-10vh', opacity: [0, 0.35, 0.35, 0] }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear',
          }}
        >
          <Heart
            className="fill-pink-300/40 text-pink-300/40"
            size={16 + (i % 3) * 12}
          />
        </motion.div>
      ))}
    </div>
  )
}

/* ─────────────────────────────
   JOURNAL PREVIEW (hero visual)
───────────────────────────────*/
function JournalPreview() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    })
  }

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-sm mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
    >
      <div className="absolute inset-0 rounded-3xl blur-3xl opacity-40 animate-pulse-glow"
        style={{ background: 'linear-gradient(135deg, #f43f5e40, #a855f740)' }} />

      <motion.div
        className="relative glass-card rounded-3xl p-6 shadow-2xl border border-white/80 dark:border-white/10"
        animate={{ rotateX: -mousePos.y * 0.4, rotateY: mousePos.x * 0.4 }}
        transition={{ duration: 0.1, ease: 'linear' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center px-3">
            <span className="text-xs text-gray-400 font-mono">couples-journal.app</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">A</div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Our Journal</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              You & Alex <Heart className="inline h-3 w-3 fill-pink-400 text-pink-400" />
            </p>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-4 mb-3 border border-pink-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">A</div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Alex</p>
              <p className="text-[10px] text-gray-400">2 hours ago</p>
            </div>
            <motion.div className="ml-auto" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>
              <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
            </motion.div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            &quot;Can&apos;t stop thinking about our walk last night 🌙 You always make everything feel magical...&quot;
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-4 border border-purple-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">J</div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Jordan</p>
              <p className="text-[10px] text-gray-400">Yesterday</p>
            </div>
            <Camera className="ml-auto h-4 w-4 text-purple-400" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['from-pink-200 to-rose-300', 'from-purple-200 to-violet-300', 'from-blue-200 to-indigo-300'].map((g, i) => (
              <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${g} flex items-center justify-center text-white`}>
                <Sparkles className="h-4 w-4 opacity-70" />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-xl flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1], boxShadow: ['0 4px 20px rgba(244,63,94,0.3)', '0 8px 32px rgba(244,63,94,0.5)', '0 4px 20px rgba(244,63,94,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="h-5 w-5 text-white fill-white" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────
   SCROLL PROGRESS
───────────────────────────────*/
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  )
}

/* ─────────────────────────────
   TESTIMONIALS
───────────────────────────────*/
const quotes = [
  { text: "We&apos;ve been using this for 2 years and it&apos;s become our most treasured keepsake.", author: "Sarah & Mike" },
  { text: "Distance feels shorter when we share moments here every day.", author: "Priya & James" },
  { text: "I proposed by sharing a journal entry. Best decision of my life.", author: "Leo & Maya" },
]

function TestimonialsSlider() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % quotes.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-44 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center px-8 max-w-2xl"
        >
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 italic font-serif mb-4">
            &ldquo;{quotes[idx].text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
            <span className="text-sm font-medium text-pink-500">{quotes[idx].author}</span>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-0 flex gap-2 justify-center">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'bg-pink-500 w-5' : 'bg-gray-300 dark:bg-gray-600 w-2'}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────
   MAIN PAGE
───────────────────────────────*/
export default function LandingPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    if (!isLoading && user) router.push('/dashboard')
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Heart className="h-12 w-12 fill-pink-400 text-pink-400" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <ScrollProgress />
      <AuroraBackground />
      <FloatingHearts />

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 glass border-b border-white/20 dark:border-white/5"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.04 }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }}>
              <Heart className="h-6 w-6 fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
            </motion.div>
            <span className="font-serif text-xl font-bold gradient-text">Couple&apos;s Journal</span>
          </motion.div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm text-gray-600 dark:text-gray-400 fancy-underline font-medium">Sign in</Link>
            <MagneticButton>
              <Link href="/auth">
                <Button className="rounded-full bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow px-5">
                  Get started free
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-pink-200/60 dark:border-pink-500/20 mb-8 shadow-sm"
              >
                <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="text-base">
                  💕
                </motion.span>
                <span className="text-sm font-medium text-pink-600 dark:text-pink-400">The private space made for two</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-gray-900 dark:text-white">Your love story,</span>
                <br />
                <span className="gradient-text animate-gradient-text">beautifully alive.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
              >
                A private, encrypted journal for you and your partner. Share thoughts, photos, and memories — all in one deeply personal space.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <MagneticButton>
                  <div className="relative overflow-visible">
                    <Link href="/auth">
                      <Button
                        size="lg"
                        className="h-14 px-8 text-base rounded-2xl bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 border-0 font-semibold transition-shadow"
                        onClick={() => setBurst(b => b + 1)}
                      >
                        Start your story
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <ParticleBurst trigger={burst} />
                  </div>
                </MagneticButton>

                <MagneticButton>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700 font-semibold"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    See how it works
                  </Button>
                </MagneticButton>
              </motion.div>

              {/* Social proof */}
              <motion.div
                className="flex items-center gap-4 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                <div className="flex -space-x-2">
                  {['from-rose-400 to-pink-500', 'from-violet-400 to-purple-500', 'from-indigo-400 to-blue-500', 'from-amber-400 to-orange-400'].map((g, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {['S', 'J', 'M', 'A'][i]}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1 font-medium">Loved by 10,000+ couples</span>
                </div>
              </motion.div>
            </div>

            {/* Right: app preview */}
            <div className="hidden lg:flex justify-center">
              <JournalPreview />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-200/60 dark:border-purple-500/20 mb-6 text-sm font-medium text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" /> Everything you need
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Built for the way{' '}
              <span className="gradient-text animate-gradient-text">couples actually live</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureCards.map(card => <FeatureCard key={card.title} card={card} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-purple-50/50 to-indigo-50/80 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20" />
        <div className="container mx-auto max-w-5xl relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Up and running in <span className="gradient-text">60 seconds</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-400 via-violet-400 to-indigo-400"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1.2, ease: 'easeInOut' }}
              />
            </div>
            {[
              { step: 1, icon: BookOpen, title: 'Create your space', desc: 'Sign up in seconds with Google. Instant, secure, zero friction.' },
              { step: 2, icon: Heart, title: 'Invite your partner', desc: 'Send a unique link. When they join, your shared journal activates.' },
              { step: 3, icon: Sparkles, title: 'Start writing', desc: "Add thoughts, photos, and notes. It&apos;s your canvas together." },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <motion.div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-6" whileHover={{ scale: 1.1 }}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 to-violet-500 blur-md opacity-40 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-violet-500 flex items-center justify-center shadow-xl text-white">
                    <Icon className="h-8 w-8" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-2 border-rose-400 flex items-center justify-center text-xs font-bold text-rose-500">{step}</span>
                  </div>
                </motion.div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.08 * i }}>
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>
            <TestimonialsSlider />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-8">
            {[
              { to: 10000, suffix: '+', label: 'Happy Couples', Icon: Users, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40' },
              { to: 1000000, suffix: '+', label: 'Memories Shared', Icon: Bookmark, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/40' },
              { to: 5000000, suffix: '+', label: 'Photos Uploaded', Icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40' },
            ].map(({ to, suffix, label, Icon, color, bg }, i) => (
              <motion.div
                key={label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${bg} mb-4`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <p className="font-serif text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <Counter to={to} suffix={suffix} />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-violet-600" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-2000" />
        <div className="container mx-auto max-w-3xl text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-6 shadow-lg"
            >
              <Heart className="h-10 w-10 text-white fill-white" />
            </motion.div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your story deserves<br />a beautiful home.
            </h2>
            <p className="text-white/80 text-xl mb-10">Free forever. No credit card. No ads. Just you two.</p>
            <MagneticButton>
              <div className="relative overflow-visible inline-block">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="h-16 px-12 text-lg rounded-2xl bg-white text-rose-600 hover:bg-gray-50 border-0 font-bold shadow-2xl hover:shadow-white/30 transition-all"
                    onClick={() => setBurst(b => b + 1)}
                  >
                    Begin your journey
                    <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                  </Button>
                </Link>
                <ParticleBurst trigger={burst} />
              </div>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 bg-white/50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>
              <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            </motion.div>
            <span className="font-serif font-bold text-gray-700 dark:text-gray-300">Couple&apos;s Journal</span>
          </div>
          <p className="text-sm text-gray-400">Made with love · Private &amp; secure · Always free</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="fancy-underline hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Privacy</a>
            <a href="#" className="fancy-underline hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Terms</a>
            <a href="#" className="fancy-underline hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
