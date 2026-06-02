// components/ThemeToggle.tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { Switch } from './ui/switch'
import { useStore } from '@/lib/store'
import { useEffect } from 'react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <div className="flex items-center gap-3">
      <Sun className="h-5 w-5 text-muted-foreground" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      />
      <Moon className="h-5 w-5 text-muted-foreground" />
    </div>
  )
}
