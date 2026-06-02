// lib/hooks/useConfetti.ts
'use client'

export function useConfetti() {
  const triggerConfetti = () => {
    // Create confetti particles
    const colors = ['#ff6b8a', '#ffc7d1', '#a3ada3', '#ff3d6b']
    const confettiCount = 50
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.style.position = 'fixed'
      confetti.style.width = '10px'
      confetti.style.height = '10px'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = Math.random() * window.innerWidth + 'px'
      confetti.style.top = '-10px'
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
      confetti.style.pointerEvents = 'none'
      confetti.style.zIndex = '9999'
      confetti.style.opacity = '1'
      confetti.style.transition = 'all 3s ease-out'
      
      document.body.appendChild(confetti)
      
      setTimeout(() => {
        confetti.style.top = window.innerHeight + 'px'
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`
        confetti.style.opacity = '0'
      }, 10)
      
      setTimeout(() => {
        document.body.removeChild(confetti)
      }, 3000)
    }
  }
  
  return { triggerConfetti }
}
