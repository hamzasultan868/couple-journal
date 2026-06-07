'use client'

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if configuration is valid
if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.warn('[Supabase] URL is not configured. API requests will fail.')
}
if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.warn('[Supabase] Anon key is not configured. API requests will fail.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
