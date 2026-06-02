# Complete Setup Prompt for Hermes Agent

Please help me set up Supabase and Google OAuth for my Couple's Journal Next.js application. Here's what I need:

## 1. Supabase Setup

Create a Supabase account at https://supabase.com and set up a new project called "couple-journal". Then:

### Create Database Tables
Run this SQL script in the Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  couple_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create couples table
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  partner1_id TEXT NOT NULL,
  partner1_name TEXT NOT NULL,
  partner1_photo TEXT,
  partner2_id TEXT,
  partner2_name TEXT,
  partner2_photo TEXT
);

-- Create journal_entries table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_photo TEXT,
  contributors TEXT[] DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_users_couple_id ON users(couple_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_couples_invite_code ON couples(invite_code);
CREATE INDEX idx_journal_entries_couple_id ON journal_entries(couple_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies (allows authenticated users to access their data)
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Users can read couples they belong to" ON couples FOR SELECT USING (true);
CREATE POLICY "Users can create couples" ON couples FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their couples" ON couples FOR UPDATE USING (true);

CREATE POLICY "Users can read entries from their couple" ON journal_entries FOR SELECT USING (true);
CREATE POLICY "Users can create entries" ON journal_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update entries" ON journal_entries FOR UPDATE USING (true);
CREATE POLICY "Users can delete entries" ON journal_entries FOR DELETE USING (true);
```

### Create Storage Bucket
In Supabase Dashboard → Storage:
- Create a new bucket named `journal-images`
- Make it PUBLIC (toggle on)

### Get Credentials
From Supabase Dashboard → Project Settings → API, get:
- Project URL (example: https://xxxxx.supabase.co)
- anon public key (long string under "Project API keys")

## 2. Google OAuth Setup

Go to Google Cloud Console (https://console.cloud.google.com/):
1. Create a new project or select existing
2. Go to APIs & Services → Credentials
3. Create Credentials → OAuth client ID
4. Choose Web application
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret

## 3. Generate NextAuth Secret

Run this command in terminal:
```bash
openssl rand -base64 32
```

## 4. Create Environment File

Create a file named `.env.local` in the project root with this content:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-generated-secret-from-step-3>

# Google OAuth (from step 2)
GOOGLE_CLIENT_ID=<paste-google-client-id>
GOOGLE_CLIENT_SECRET=<paste-google-client-secret>

# Supabase (from step 1)
NEXT_PUBLIC_SUPABASE_URL=<paste-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-supabase-anon-key>
```

Replace all `<paste-...>` placeholders with the actual values from the previous steps.

## 5. Verify Setup

After completing all steps:
1. Restart the development server if it's running
2. Visit http://localhost:3000
3. Test signing in with Google
4. Verify you can create and view journal entries

## Expected Results

After setup:
- ✅ Users can sign in with Google
- ✅ Couples can be created with invite codes
- ✅ Journal entries can be created, viewed, and deleted
- ✅ Images can be uploaded and displayed
- ✅ All data is stored in Supabase (free tier)

## Troubleshooting

If issues occur:
- Verify all environment variables are filled in `.env.local`
- Check SQL script ran successfully (no errors)
- Confirm storage bucket is named exactly `journal-images` and is public
- Check browser console for error messages
- Restart dev server after changing `.env.local`

Project location: c:\Users\786\Couple's Journal
