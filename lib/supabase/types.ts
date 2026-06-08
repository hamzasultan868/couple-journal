export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          photo_url: string | null
          couple_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          photo_url?: string | null
          couple_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          photo_url?: string | null
          couple_id?: string | null
          created_at?: string
        }
      }
      couples: {
        Row: {
          id: string
          invite_code: string
          created_at: string
          updated_at: string
          partner1_id: string
          partner1_name: string
          partner2_id: string | null
          partner2_name: string | null
        }
        Insert: {
          id?: string
          invite_code: string
          created_at?: string
          updated_at?: string
          partner1_id: string
          partner1_name: string
          partner2_id?: string | null
          partner2_name?: string | null
        }
        Update: {
          id?: string
          invite_code?: string
          created_at?: string
          updated_at?: string
          partner1_id?: string
          partner1_name?: string
          partner2_id?: string | null
          partner2_name?: string | null
        }
      }
      journal_entries: {
        Row: {
          id: string
          couple_id: string
          text: string
          image_urls: string[]
          created_at: string
          updated_at: string
          author_id: string
          author_name: string
          author_photo: string | null
          contributors: string[]
        }
        Insert: {
          id?: string
          couple_id: string
          text: string
          image_urls?: string[]
          created_at?: string
          updated_at?: string
          author_id: string
          author_name: string
          author_photo?: string | null
          contributors?: string[]
        }
        Update: {
          id?: string
          couple_id?: string
          text?: string
          image_urls?: string[]
          created_at?: string
          updated_at?: string
          author_id?: string
          author_name?: string
          author_photo?: string | null
          contributors?: string[]
        }
      }
    }
  }
}

// App-level types
export interface User {
  id: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  coupleId: string | null
}

export interface Couple {
  id: string
  inviteCode: string
  createdAt: Date
  updatedAt: Date
  partner1Id: string
  partner1Name: string
  partner2Id: string | null
  partner2Name: string | null
}

export interface JournalEntry {
  id: string
  coupleId: string
  text: string
  imageUrls: string[]
  createdAt: Date
  updatedAt: Date
  authorId: string
  authorName: string
  authorPhoto: string | null
  contributors: string[]
}
