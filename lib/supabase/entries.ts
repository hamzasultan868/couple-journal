'use client'

import { supabase } from './client'
import type { JournalEntry } from './types'
import imageCompression from 'browser-image-compression'

export async function createEntry(
  coupleId: string,
  text: string,
  authorId: string,
  authorName: string,
  authorPhoto: string | null,
  images: File[] = []
): Promise<JournalEntry> {
  // Upload images
  const imageUrls = await Promise.all(
    images.map(image => uploadImage(coupleId, image))
  )
  
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      couple_id: coupleId,
      text,
      image_urls: imageUrls,
      created_at: now,
      updated_at: now,
      author_id: authorId,
      author_name: authorName,
      author_photo: authorPhoto,
      contributors: [authorId],
    })
    .select()
    .single()
  
  if (error) throw error
  
  return {
    id: data.id,
    coupleId: data.couple_id,
    text: data.text,
    imageUrls: data.image_urls,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    authorId: data.author_id,
    authorName: data.author_name,
    authorPhoto: data.author_photo,
    contributors: data.contributors,
  }
}

export async function updateEntry(
  entryId: string,
  updates: Partial<JournalEntry>,
  userId: string
): Promise<void> {
  // Get current entry to merge contributors
  const { data: currentEntry } = await supabase
    .from('journal_entries')
    .select('contributors')
    .eq('id', entryId)
    .single()
  
  const contributors = currentEntry
    ? [...new Set([...currentEntry.contributors, userId])]
    : [userId]
  
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }
  
  if (updates.text !== undefined) {
    updateData.text = updates.text
    updateData.contributors = contributors
  }
  
  const { error } = await supabase
    .from('journal_entries')
    .update(updateData)
    .eq('id', entryId)
  
  if (error) throw error
}

export async function deleteEntry(entryId: string, imageUrls: string[]): Promise<void> {
  // Delete images from storage
  await Promise.all(
    imageUrls.map(async (url) => {
      try {
        // Extract the path from the URL
        const path = url.split('/storage/v1/object/public/')[1]
        if (path) {
          await supabase.storage.from('journal-images').remove([path])
        }
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    })
  )
  
  // Delete entry document
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
  
  if (error) throw error
}

export async function getEntriesByCoupleId(coupleId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return data.map(entry => ({
    id: entry.id,
    coupleId: entry.couple_id,
    text: entry.text,
    imageUrls: entry.image_urls,
    createdAt: new Date(entry.created_at),
    updatedAt: new Date(entry.updated_at),
    authorId: entry.author_id,
    authorName: entry.author_name,
    authorPhoto: entry.author_photo,
    contributors: entry.contributors,
  }))
}

export function subscribeToEntries(
  coupleId: string,
  callback: (entries: JournalEntry[]) => void
): () => void {
  // Initial fetch
  getEntriesByCoupleId(coupleId).then(callback).catch(console.error)
  
  // Subscribe to real-time updates
  const channel = supabase
    .channel(`entries:${coupleId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'journal_entries',
        filter: `couple_id=eq.${coupleId}`,
      },
      () => {
        // Refetch all entries when any change occurs
        getEntriesByCoupleId(coupleId).then(callback).catch(console.error)
      }
    )
    .subscribe()
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel)
  }
}

async function uploadImage(coupleId: string, file: File): Promise<string> {
  // Compress image
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: 'image/jpeg',
  }
  
  const compressedFile = await imageCompression(file, options)
  
  // Upload to Supabase Storage
  const filename = `${Date.now()}_${file.name}`
  const filepath = `couples/${coupleId}/images/${filename}`
  
  const { data, error } = await supabase.storage
    .from('journal-images')
    .upload(filepath, compressedFile, {
      contentType: 'image/jpeg',
      upsert: false,
    })
  
  if (error) throw error
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('journal-images')
    .getPublicUrl(data.path)
  
  return urlData.publicUrl
}
