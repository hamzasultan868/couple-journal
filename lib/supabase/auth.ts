'use client'

import { supabase } from './client'
import type { User, Database } from './types'

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !data) return null
  
  return {
    id: (data as any).id,
    email: (data as any).email,
    displayName: (data as any).display_name,
    photoURL: (data as any).photo_url,
    coupleId: (data as any).couple_id,
  }
}

export async function createOrUpdateUser(user: {
  id: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}): Promise<User> {
  if (!user.id) {
    throw new Error('User ID is required')
  }

  console.log('[createOrUpdateUser] Upserting user:', user.id)
  
  const { data, error } = await (supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      display_name: user.displayName,
      photo_url: user.photoURL,
    } as any)
    .select()
    .single() as any)
  
  if (error) {
    console.error('[createOrUpdateUser] Upsert error:', error)
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
  
  if (!data) {
    throw new Error('No user data returned from upsert')
  }
  
  console.log('[createOrUpdateUser] User upserted successfully:', (data as any).id)
  
  return {
    id: (data as any).id,
    email: (data as any).email,
    displayName: (data as any).display_name,
    photoURL: (data as any).photo_url,
    coupleId: (data as any).couple_id,
  }
}

export async function updateUserCoupleId(userId: string, coupleId: string): Promise<void> {
  if (!userId || !coupleId) {
    throw new Error('User ID and Couple ID are required')
  }
  
  console.log('[updateUserCoupleId] Updating user', userId, 'with couple_id:', coupleId)
  
  const { error } = await ((supabase
    .from('users') as any)
    .update({ couple_id: coupleId })
    .eq('id', userId))
  
  if (error) {
    console.error('[updateUserCoupleId] Update error:', error)
    throw new Error(`Failed to update user couple ID: ${error.message}`)
  }
  
  console.log('[updateUserCoupleId] User couple_id updated successfully')
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error || !data) return null
  
  return {
    id: (data as any).id,
    email: (data as any).email,
    displayName: (data as any).display_name,
    photoURL: (data as any).photo_url,
    coupleId: (data as any).couple_id,
  }
}
