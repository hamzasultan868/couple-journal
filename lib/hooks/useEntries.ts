// lib/hooks/useEntries.ts
'use client'

import { useEffect } from 'react'
import { subscribeToEntries } from '../supabase/entries'
import { useStore } from '../store'

export function useEntries() {
  const { couple, entries, setEntries } = useStore()

  useEffect(() => {
    if (!couple?.id) return

    const unsubscribe = subscribeToEntries(couple.id, (newEntries) => {
      setEntries(newEntries)
    })

    return () => unsubscribe()
  }, [couple?.id, setEntries])

  return { entries }
}
