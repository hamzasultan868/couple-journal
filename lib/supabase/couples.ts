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
  
  const { data, error } = await supabase
    .from('couples')
    .insert({
      invite_code: inviteCode,
      created_by: userId,
      partner1_id: userId,
      partner1_name: userName,
      partner1_photo: userPhoto,
    })
    .select()
    .single()
  
  if (error) throw error
  
  await updateUserCoupleId(userId, data.id)
  
  return {
    id: data.id,
    inviteCode: data.invite_code,
    createdAt: new Date(data.created_at),
    createdBy: data.created_by,
    partner1Id: data.partner1_id,
    partner1Name: data.partner1_name,
    partner1Photo: data.partner1_photo,
    partner2Id: data.partner2_id,
    partner2Name: data.partner2_name,
    partner2Photo: data.partner2_photo,
  }
}

export async function joinCoupleByCode(
  code: string,
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<Couple | null> {
  // Find couple by invite code
  const { data: coupleData, error } = await supabase
    .from('couples')
    .select('*')
    .eq('invite_code', code)
    .single()
  
  if (error || !coupleData) return null
  
  // Check if couple is already full
  if (coupleData.partner2_id) return null
  
  // Add second partner
  const { data: updatedCouple, error: updateError } = await supabase
    .from('couples')
    .update({
      partner2_id: userId,
      partner2_name: userName,
      partner2_photo: userPhoto,
    })
    .eq('id', coupleData.id)
    .select()
    .single()
  
  if (updateError) throw updateError
  
  await updateUserCoupleId(userId, coupleData.id)
  
  return {
    id: updatedCouple.id,
    inviteCode: updatedCouple.invite_code,
    createdAt: new Date(updatedCouple.created_at),
    createdBy: updatedCouple.created_by,
    partner1Id: updatedCouple.partner1_id,
    partner1Name: updatedCouple.partner1_name,
    partner1Photo: updatedCouple.partner1_photo,
    partner2Id: updatedCouple.partner2_id,
    partner2Name: updatedCouple.partner2_name,
    partner2Photo: updatedCouple.partner2_photo,
  }
}

export async function joinCoupleByEmail(
  partnerEmail: string,
  userId: string,
  userName: string,
  userPhoto: string | null
): Promise<Couple | null> {
  // Find user by email
  const { data: partnerUser, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', partnerEmail)
    .single()
  
  if (userError || !partnerUser || !partnerUser.couple_id) return null
  
  // Get the couple
  const { data: coupleData, error } = await supabase
    .from('couples')
    .select('*')
    .eq('id', partnerUser.couple_id)
    .single()
  
  if (error || !coupleData) return null
  
  // Check if couple is already full
  if (coupleData.partner2_id) return null
  
  // Add second partner
  const { data: updatedCouple, error: updateError } = await supabase
    .from('couples')
    .update({
      partner2_id: userId,
      partner2_name: userName,
      partner2_photo: userPhoto,
    })
    .eq('id', coupleData.id)
    .select()
    .single()
  
  if (updateError) throw updateError
  
  await updateUserCoupleId(userId, coupleData.id)
  
  return {
    id: updatedCouple.id,
    inviteCode: updatedCouple.invite_code,
    createdAt: new Date(updatedCouple.created_at),
    createdBy: updatedCouple.created_by,
    partner1Id: updatedCouple.partner1_id,
    partner1Name: updatedCouple.partner1_name,
    partner1Photo: updatedCouple.partner1_photo,
    partner2Id: updatedCouple.partner2_id,
    partner2Name: updatedCouple.partner2_name,
    partner2Photo: updatedCouple.partner2_photo,
  }
}

export async function getCoupleById(coupleId: string): Promise<Couple | null> {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .eq('id', coupleId)
    .single()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    inviteCode: data.invite_code,
    createdAt: new Date(data.created_at),
    createdBy: data.created_by,
    partner1Id: data.partner1_id,
    partner1Name: data.partner1_name,
    partner1Photo: data.partner1_photo,
    partner2Id: data.partner2_id,
    partner2Name: data.partner2_name,
    partner2Photo: data.partner2_photo,
  }
}
