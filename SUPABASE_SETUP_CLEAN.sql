-- Supabase Setup Script - CLEAN MIGRATION (Drop & Recreate)
-- Run this if you get type errors with existing tables
-- WARNING: This will DELETE ALL DATA - backup first if needed!

-- 1. Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 2. Create couples table (UUID for table id, TEXT for user ids)
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner1_id TEXT NOT NULL,
  partner1_name TEXT NOT NULL,
  partner2_id TEXT,
  partner2_name TEXT,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create users table (TEXT for user id to match auth.users)
CREATE TABLE users (
  id TEXT PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create journal_entries table
CREATE TABLE journal_entries (
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
CREATE INDEX idx_users_couple_id ON users(couple_id);
CREATE INDEX idx_couples_partner1_id ON couples(partner1_id);
CREATE INDEX idx_couples_partner2_id ON couples(partner2_id);
CREATE INDEX idx_couples_invite_code ON couples(invite_code);
CREATE INDEX idx_journal_entries_couple_id ON journal_entries(couple_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_author_id ON journal_entries(author_id);

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

-- 10. Create updated_at trigger for automatic timestamp updates
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

-- 11. Verify tables created successfully
SELECT 'Users table' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'Couples table' as table_name, COUNT(*) as row_count FROM couples
UNION ALL
SELECT 'Journal entries table' as table_name, COUNT(*) as row_count FROM journal_entries;
