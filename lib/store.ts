'use client'

// lib/store.ts
import { create } from 'zustand'
import type { User, Couple, JournalEntry } from './supabase/types'

interface AppState {
  user: User | null
  couple: Couple | null
  entries: JournalEntry[]
  isLoading: boolean
  theme: 'light' | 'dark'
  
  setUser: (user: User | null) => void
  setCouple: (couple: Couple | null) => void
  setEntries: (entries: JournalEntry[]) => void
  setIsLoading: (isLoading: boolean) => void
  toggleTheme: () => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  couple: null,
  entries: [],
  isLoading: true,
  theme: 'light',
  
  setUser: (user) => set({ user }),
  setCouple: (couple) => set({ couple }),
  setEntries: (entries) => set({ entries }),
  setIsLoading: (isLoading) => set({ isLoading }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))
