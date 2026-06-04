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
  
  const { data, error } = await (supabase
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
    } as any)
    .select()
    .single() as any)
  
  if (error) throw error
  
  return {
    id: (data as any).id,
    coupleId: (data as any).couple_id,
    text: (data as any).text,
    imageUrls: (data as any).image_urls,
    createdAt: new Date((data as any).created_at),
    updatedAt: new Date((data as any).updated_at),
    authorId: (data as any).author_id,
    authorName: (data as any).author_name,
    authorPhoto: (data as any).author_photo,
    contributors: (data as any).contributors,
  }
}

export async function updateEntry(
  entryId: string,
  updates: Partial<JournalEntry>,
  userId: string
): Promise<void> {
  // Get current entry to merge contributors
  const { data: currentEntry } = await (supabase
    .from('journal_entries')
    .select('contributors')
    .eq('id', entryId)
    .single() as any)
  
  const contributors = currentEntry
    ? [...new Set([...(currentEntry as any).contributors, userId])]
    : [userId]
  
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }
  
  if (updates.text !== undefined) {
    updateData.text = updates.text
    updateData.contributors = contributors
  }
  
  const { error } = await ((supabase
    .from('journal_entries') as any)
    .update(updateData)
    .eq('id', entryId))
  
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
  const { error } = await (supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId) as any)
  
  if (error) throw error
}

export async function getEntriesByCoupleId(coupleId: string): Promise<JournalEntry[]> {
  const { data, error } = await (supabase
    .from('journal_entries')
    .select('*')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false }) as any)
  
  if (error) throw error
  
  return (data as any[]).map(entry => ({
    id: (entry as any).id,
    coupleId: (entry as any).couple_id,
    text: (entry as any).text,
    imageUrls: (entry as any).image_urls,
    createdAt: new Date((entry as any).created_at),
    updatedAt: new Date((entry as any).updated_at),
    authorId: (entry as any).author_id,
    authorName: (entry as any).author_name,
    authorPhoto: (entry as any).author_photo,
    contributors: (entry as any).contributors,
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
