'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorGlow() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const cursorX = useMotionValue(-200)
  const cursorY = useMotionValue(-200)

  const springConfig = { stiffness: 600, damping: 35, mass: 0.5 }
  const dotSpring = { stiffness: 1000, damping: 50, mass: 0.2 }

  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)
  const dotX = useSpring(cursorX, dotSpring)
  const dotY = useSpring(cursorY, dotSpring)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setVisible(true)
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      const target = e.target as HTMLElement
      const isInteractive = !!(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select')
      )
      setHovering(isInteractive)
    }

    const down = () => setClicking(true)
    const up   = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-normal"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: hovering ? 48 : clicking ? 20 : 36,
          height: hovering ? 48 : clicking ? 20 : 36,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full rounded-full border-2 transition-all duration-150"
          style={{
            borderColor: hovering
              ? 'rgba(244,63,94,0.8)'
              : 'rgba(168,85,247,0.5)',
            boxShadow: hovering
              ? '0 0 12px rgba(244,63,94,0.4), inset 0 0 8px rgba(244,63,94,0.1)'
              : '0 0 8px rgba(168,85,247,0.3)',
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          width: clicking ? 6 : 7,
          height: clicking ? 6 : 7,
          background: hovering
            ? 'radial-gradient(circle, #f43f5e, #ec4899)'
            : 'radial-gradient(circle, #a855f7, #6366f1)',
          boxShadow: hovering
            ? '0 0 6px rgba(244,63,94,0.7)'
            : '0 0 6px rgba(168,85,247,0.7)',
        }}
      />

      {/* Ambient glow trail */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full blur-xl"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? (hovering ? 0.25 : 0.12) : 0,
          width: hovering ? 80 : 60,
          height: hovering ? 80 : 60,
          background: hovering
            ? 'radial-gradient(circle, rgba(244,63,94,0.6), transparent)'
            : 'radial-gradient(circle, rgba(168,85,247,0.4), transparent)',
        }}
      />
    </>
  )
}
