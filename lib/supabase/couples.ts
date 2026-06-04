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
  const inviteCode = generateInviteCode()
  
  const { data, error } = await (supabase
    .from('couples')
    .insert({
      invite_code: inviteCode,
      created_by: userId,
      partner1_id: userId,
      partner1_name: userName,
      partner1_photo: userPhoto,
    } as any)
    .select()
    .single() as any)
  
  if (error) throw error
  
  await updateUserCoupleId(userId, (data as any).id)
  
  return {
    id: (data as any).id,
    inviteCode: (data as any).invite_code,
    createdAt: new Date((data as any).created_at),
    createdBy: (data as any).created_by,
    partner1Id: (data as any).partner1_id,
    partner1Name: (data as any).partner1_name,
    partner1Photo: (data as any).partner1_photo,
    partner2Id: (data as any).partner2_id,
    partner2Name: (data as any).partner2_name,
    partner2Photo: (data as any).partner2_photo,
  }
}

export async function joinCoupleByCode(
  code: string,
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<Couple | null> {
  // Find couple by invite code
  const { data: coupleData, error } = await ((supabase
    .from('couples') as any)
    .select('*')
    .eq('invite_code', code)
    .single())
  
  if (error || !coupleData) return null
  
  // Check if couple is already full
  if ((coupleData as any).partner2_id) return null
  
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
  
  if (updateError) throw updateError
  
  await updateUserCoupleId(userId, (coupleData as any).id)
  
  return {
    id: (updatedCouple as any).id,
    inviteCode: (updatedCouple as any).invite_code,
    createdAt: new Date((updatedCouple as any).created_at),
    createdBy: (updatedCouple as any).created_by,
    partner1Id: (updatedCouple as any).partner1_id,
    partner1Name: (updatedCouple as any).partner1_name,
    partner1Photo: (updatedCouple as any).partner1_photo,
    partner2Id: (updatedCouple as any).partner2_id,
    partner2Name: (updatedCouple as any).partner2_name,
    partner2Photo: (updatedCouple as any).partner2_photo,
  }
}

export async function joinCoupleByEmail(
  partnerEmail: string,
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<Couple | null> {
  // Find user by email
  const { data: partnerUser, error: userError } = await ((supabase
    .from('users') as any)
    .select('*')
    .eq('email', partnerEmail)
    .single())
  
  if (userError || !partnerUser || !(partnerUser as any).couple_id) return null
  
  // Get the couple
  const { data: coupleData, error } = await ((supabase
    .from('couples') as any)
    .select('*')
    .eq('id', (partnerUser as any).couple_id)
    .single())
  
  if (error || !coupleData) return null
  
  // Check if couple is already full
  if ((coupleData as any).partner2_id) return null
  
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
  
  if (updateError) throw updateError
  
  await updateUserCoupleId(userId, (coupleData as any).id)
  
  return {
    id: (updatedCouple as any).id,
    inviteCode: (updatedCouple as any).invite_code,
    createdAt: new Date((updatedCouple as any).created_at),
    createdBy: (updatedCouple as any).created_by,
    partner1Id: (updatedCouple as any).partner1_id,
    partner1Name: (updatedCouple as any).partner1_name,
    partner1Photo: (updatedCouple as any).partner1_photo,
    partner2Id: (updatedCouple as any).partner2_id,
    partner2Name: (updatedCouple as any).partner2_name,
    partner2Photo: (updatedCouple as any).partner2_photo,
  }
}

export async function getCoupleById(coupleId: string): Promise<Couple | null> {
  const { data, error } = await ((supabase
    .from('couples') as any)
    .select('*')
    .eq('id', coupleId)
    .single())
  
  if (error || !data) return null
  
  return {
    id: (data as any).id,
    inviteCode: (data as any).invite_code,
    createdAt: new Date((data as any).created_at),
    createdBy: (data as any).created_by,
    partner1Id: (data as any).partner1_id,
    partner1Name: (data as any).partner1_name,
    partner1Photo: (data as any).partner1_photo,
    partner2Id: (data as any).partner2_id,
    partner2Name: (data as any).partner2_name,
    partner2Photo: (data as any).partner2_photo,
  }
}
