'use client'

import { useEffect, useState, useRef } from 'react'

export function CursorGlowOptimized() {
  const [position, setPosition] = useState({ x: -200, y: -200 })
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    let mouseX = -200
    let mouseY = -200
    let targetX = mouseX
    let targetY = mouseY

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setVisible(true)

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

    const onMouseDown = () => setClicking(true)
    const onMouseUp = () => setClicking(false)
    const onMouseLeave = () => setVisible(false)
    const onMouseEnter = () => setVisible(true)

    // Smooth animation loop with low frequency
    const animate = () => {
      targetX += (mouseX - targetX) * 0.2
      targetY += (mouseY - targetY) * 0.2

      setPosition({ x: targetX, y: targetY })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const outerSize = clicking ? 20 : hovering ? 48 : 36
  const innerSize = clicking ? 6 : 7

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed pointer-events-none z-[9999] rounded-full border-2 transition-all duration-150"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${outerSize}px`,
          height: `${outerSize}px`,
          transform: 'translate(-50%, -50%)',
          opacity: visible ? 1 : 0,
          borderColor: hovering ? 'rgba(244,63,94,0.8)' : 'rgba(168,85,247,0.5)',
          boxShadow: hovering
            ? '0 0 12px rgba(244,63,94,0.4), inset 0 0 8px rgba(244,63,94,0.1)'
            : '0 0 8px rgba(168,85,247,0.3)',
          transition: 'opacity 0.3s ease-out, border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />

      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${innerSize}px`,
          height: `${innerSize}px`,
          transform: 'translate(-50%, -50%)',
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? 'rgba(244,63,94,0.6)' : 'rgba(168,85,247,0.6)',
          transition: 'opacity 0.3s ease-out, background-color 0.2s ease',
        }}
      />
    </>
  )
}
