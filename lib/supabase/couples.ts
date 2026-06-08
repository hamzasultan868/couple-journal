'use client'

import { supabase } from './client'
import type { Couple } from './types'
import { generateInviteCode } from '../utils'
import { updateUserCoupleId } from './auth'

export async function createCouple(
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<Couple> {
  if (!userId) {
    throw new Error('User ID is required to create a couple')
  }
  
  const inviteCode = generateInviteCode()
  console.log('[createCouple] Creating couple with invite code:', inviteCode)
  
  try {
    // Add timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const { data, error } = await (supabase
      .from('couples')
      .insert({
        invite_code: inviteCode,
        partner1_id: userId,
        partner1_name: userName,
      } as any)
      .select()
      .single() as any)
    
    clearTimeout(timeoutId)
    
    if (error) {
      console.error('[createCouple] Insert error:', error)
      
      // Provide more specific error messages
      if (error.message?.includes('duplicate key')) {
        throw new Error('This invite code already exists. Please try again.')
      } else if (error.message?.includes('permission')) {
        throw new Error('You do not have permission to create a couple. Please check your account.')
      } else if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.')
      }
      
      throw new Error(`Failed to create couple: ${error.message}`)
    }
    
    if (!data) {
      throw new Error('No data returned from couple creation')
    }
    
    console.log('[createCouple] Couple created:', (data as any).id)
    
    // Update user's couple_id
    try {
      await updateUserCoupleId(userId, (data as any).id)
      console.log('[createCouple] User couple_id updated')
    } catch (updateError) {
      console.error('[createCouple] Error updating user couple_id:', updateError)
      // Don't throw here - couple was created successfully
    }
    
    return {
      id: (data as any).id,
      inviteCode: (data as any).invite_code,
      createdAt: new Date((data as any).created_at),
      updatedAt: new Date((data as any).updated_at),
      partner1Id: (data as any).partner1_id,
      partner1Name: (data as any).partner1_name,
      partner2Id: (data as any).partner2_id,
      partner2Name: (data as any).partner2_name,
    }
  } catch (error) {
    console.error('[createCouple] Unexpected error:', error)
    
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network connection error. Please check your internet and try again.')
    }
    
    throw error
  }
}

export async function joinCoupleByCode(
  code: string,
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<Couple | null> {
  if (!code || !userId) {
    console.warn('[joinCoupleByCode] Missing code or userId')
    return null
  }
  
  console.log('[joinCoupleByCode] Attempting to join with code:', code)
  
  try {
    // Find couple by invite code
    const { data: coupleData, error } = await ((supabase
      .from('couples') as any)
      .select('*')
      .eq('invite_code', code)
      .single())
    
    if (error) {
      console.error('[joinCoupleByCode] Error finding couple:', error)
      return null
    }
    
    if (!coupleData) {
      console.warn('[joinCoupleByCode] No couple found with code:', code)
      return null
    }
    
    // Check if couple is already full
    if ((coupleData as any).partner2_id) {
      console.warn('[joinCoupleByCode] Couple is already full')
      return null
    }
    
    console.log('[joinCoupleByCode] Found couple, adding second partner')
    
    // Add second partner
    const { data: updatedCouple, error: updateError } = await ((supabase
      .from('couples') as any)
      .update({
        partner2_id: userId,
        partner2_name: userName,
        partner2_photo: userPhoto,
      })
      .eq('id', (coupleData as any).id)
      .select()
      .single())
    
    if (updateError) {
      console.error('[joinCoupleByCode] Error updating couple:', updateError)
      throw updateError
    }
    
    if (!updatedCouple) {
      throw new Error('No data returned from couple update')
    }
    
    await updateUserCoupleId(userId, (coupleData as any).id)
    
    console.log('[joinCoupleByCode] Successfully joined couple:', (updatedCouple as any).id)
    
    return {
      id: (updatedCouple as any).id,
      inviteCode: (updatedCouple as any).invite_code,
      createdAt: new Date((updatedCouple as any).created_at),
      updatedAt: new Date((updatedCouple as any).updated_at),
      partner1Id: (updatedCouple as any).partner1_id,
      partner1Name: (updatedCouple as any).partner1_name,
      partner2Id: (updatedCouple as any).partner2_id,
      partner2Name: (updatedCouple as any).partner2_name,
    }
  } catch (error) {
    console.error('[joinCoupleByCode] Unexpected error:', error)
    throw error
  }
}

export async function joinCoupleByEmail(
  partnerEmail: string,
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<Couple | null> {
  if (!partnerEmail || !userId) {
    console.warn('[joinCoupleByEmail] Missing email or userId')
    return null
  }
  
  console.log('[joinCoupleByEmail] Attempting to join with partner email:', partnerEmail)
  
  try {
    // Find user by email
    const { data: partnerUser, error: userError } = await ((supabase
      .from('users') as any)
      .select('*')
      .eq('email', partnerEmail)
      .single())
    
    if (userError) {
      console.error('[joinCoupleByEmail] Error finding user:', userError)
      return null
    }
    
    if (!partnerUser) {
      console.warn('[joinCoupleByEmail] Partner not found with email:', partnerEmail)
      return null
    }
    
    if (!(partnerUser as any).couple_id) {
      console.warn('[joinCoupleByEmail] Partner has not created a couple yet')
      return null
    }
    
    console.log('[joinCoupleByEmail] Found partner, retrieving couple')
    
    // Get the couple
    const { data: coupleData, error } = await ((supabase
      .from('couples') as any)
      .select('*')
      .eq('id', (partnerUser as any).couple_id)
      .single())
    
    if (error) {
      console.error('[joinCoupleByEmail] Error finding couple:', error)
      return null
    }
    
    if (!coupleData) {
      console.warn('[joinCoupleByEmail] Couple not found')
      return null
    }
    
    // Check if couple is already full
    if ((coupleData as any).partner2_id) {
      console.warn('[joinCoupleByEmail] Couple is already full')
      return null
    }
    
    console.log('[joinCoupleByEmail] Adding second partner')
    
    // Add second partner
    const { data: updatedCouple, error: updateError } = await ((supabase
      .from('couples') as any)
      .update({
        partner2_id: userId,
        partner2_name: userName,
      })
      .eq('id', (coupleData as any).id)
      .select()
      .single())
    
    if (updateError) {
      console.error('[joinCoupleByEmail] Error updating couple:', updateError)
      throw updateError
    }
    
    if (!updatedCouple) {
      throw new Error('No data returned from couple update')
    }
    
    await updateUserCoupleId(userId, (coupleData as any).id)
    
    console.log('[joinCoupleByEmail] Successfully joined couple:', (updatedCouple as any).id)
    
    return {
      id: (updatedCouple as any).id,
      inviteCode: (updatedCouple as any).invite_code,
      createdAt: new Date((updatedCouple as any).created_at),
      updatedAt: new Date((updatedCouple as any).updated_at),
      partner1Id: (updatedCouple as any).partner1_id,
      partner1Name: (updatedCouple as any).partner1_name,
      partner2Id: (updatedCouple as any).partner2_id,
      partner2Name: (updatedCouple as any).partner2_name,
    }
  } catch (error) {
    console.error('[joinCoupleByEmail] Unexpected error:', error)
    throw error
  }
}

export async function getCoupleById(coupleId: string): Promise<Couple | null> {
  if (!coupleId) {
    console.warn('[getCoupleById] coupleId is empty')
    return null
  }
  
  console.log('[getCoupleById] Fetching couple:', coupleId)
  
  try {
    const { data, error } = await ((supabase
      .from('couples') as any)
      .select('*')
      .eq('id', coupleId)
      .single())
    
    if (error) {
      console.error('[getCoupleById] Error:', error)
      return null
    }
    
    if (!data) {
      console.warn('[getCoupleById] No data returned')
      return null
    }
    
    console.log('[getCoupleById] Couple found:', (data as any).id)
    
    return {
      id: (data as any).id,
      inviteCode: (data as any).invite_code,
      createdAt: new Date((data as any).created_at),
      updatedAt: new Date((data as any).updated_at),
      partner1Id: (data as any).partner1_id,
      partner1Name: (data as any).partner1_name,
      partner2Id: (data as any).partner2_id,
      partner2Name: (data as any).partner2_name,
    }
  } catch (error) {
    console.error('[getCoupleById] Unexpected error:', error)
    return null
  }
}
