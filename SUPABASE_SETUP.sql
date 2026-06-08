-- Supabase Setup Script for Couple's Journal
-- Run this SQL in your Supabase SQL Editor to set up all required tables

-- 1. Create couples table FIRST (no FK to users yet)
CREATE TABLE IF NOT EXISTS couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner1_id TEXT NOT NULL,
  partner1_name TEXT NOT NULL,
  partner2_id TEXT,
  partner2_name TEXT,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create users table (can now reference couples)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add foreign key constraints to couples table
ALTER TABLE couples
  ADD CONSTRAINT fk_couples_partner1_id 
    FOREIGN KEY (partner1_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_couples_partner2_id 
    FOREIGN KEY (partner2_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  text TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  author_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_photo TEXT,
  contributors TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_couple_id ON users(couple_id);
CREATE INDEX IF NOT EXISTS idx_couples_partner1_id ON couples(partner1_id);
CREATE INDEX IF NOT EXISTS idx_couples_partner2_id ON couples(partner2_id);
CREATE INDEX IF NOT EXISTS idx_couples_invite_code ON couples(invite_code);
CREATE INDEX IF NOT EXISTS idx_journal_entries_couple_id ON journal_entries(couple_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_author_id ON journal_entries(author_id);

-- 6. Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. Create RLS Policies for couples table
CREATE POLICY "Users can view couples they are part of" ON couples
  FOR SELECT USING (
    auth.uid() = partner1_id OR auth.uid() = partner2_id
  );

CREATE POLICY "Users can update couples they are part of" ON couples
  FOR UPDATE USING (
    auth.uid() = partner1_id OR auth.uid() = partner2_id
  );

CREATE POLICY "Users can insert couples (create new couple)" ON couples
  FOR INSERT WITH CHECK (auth.uid() = partner1_id);

-- 9. Create RLS Policies for journal_entries table
CREATE POLICY "Users can view entries from their couple" ON journal_entries
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM couples 
      WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert entries to their couple" ON journal_entries
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    couple_id IN (
      SELECT id FROM couples 
      WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own entries" ON journal_entries
  FOR UPDATE USING (
    auth.uid() = author_id OR
    couple_id IN (
      SELECT id FROM couples 
      WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own entries" ON journal_entries
  FOR DELETE USING (auth.uid() = author_id);

-- 10. Create storage bucket for journal images (if not exists)
-- Note: You'll need to do this via Supabase UI:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create new bucket named "journal-images"
-- 3. Make it PUBLIC
-- 4. Add these policies (via SQL):

-- Policy to allow authenticated users to upload
-- Policy to allow public read access
-- Policy to allow users to delete their own uploads

-- 11. Optional: Create storage policies via Supabase UI
-- Note: Storage policies should be created through the Supabase Dashboard UI:
-- 1. Go to Storage → journal-images bucket → Policies tab
-- 2. Add Policy: "Users can upload" - INSERT - authenticated users
-- 3. Add Policy: "Public read" - SELECT - anyone
-- 4. Add Policy: "Users can delete own" - DELETE - authenticated users

-- 12. Create updated_at trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Verify tables exist
SELECT 'Users table' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'Couples table' as table_name, COUNT(*) as row_count FROM couples
UNION ALL
SELECT 'Journal entries table' as table_name, COUNT(*) as row_count FROM journal_entries;
