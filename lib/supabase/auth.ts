'use client'

import { supabase } from './client'
import type { User } from './types'

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    coupleId: data.couple_id,
  }
}

export async function createOrUpdateUser(user: {
  id: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      display_name: user.displayName,
      photo_url: user.photoURL,
    })
    .select()
    .single()
  
  if (error) throw error
  
  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    coupleId: data.couple_id,
  }
}

export async function updateUserCoupleId(userId: string, coupleId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ couple_id: coupleId })
    .eq('id', userId)
  
  if (error) throw error
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    photoURL: data.photo_url,
    coupleId: data.couple_id,
  }
}
