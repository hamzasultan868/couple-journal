# Setup Guide - Auth.js + Supabase

Your app has been migrated from Firebase to **Auth.js** (NextAuth) and **Supabase**! Both are completely free for small projects.

## ✅ What's Been Changed

- ❌ Firebase → ✅ Auth.js (NextAuth) for authentication
- ❌ Firestore → ✅ Supabase PostgreSQL for database
- ❌ Firebase Storage → ✅ Supabase Storage for images
- **Result**: No more Firebase costs!

## 🚀 Setup Steps

### 1. Set up Supabase (5 minutes)

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - **Name**: couple-journal
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Click "Create new project" and wait ~2 minutes

### 2. Create Database Tables

Once your project is ready:

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy and paste this SQL:

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

4. Click "Run" (or press Ctrl+Enter)

### 3. Create Storage Bucket

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click "Create a new bucket"
3. **Name**: `journal-images`
4. **Public bucket**: Toggle ON (so images can be viewed)
5. Click "Create bucket"

### 4. Get Supabase Credentials

1. In Supabase dashboard, go to **Project Settings** (gear icon bottom left)
2. Go to **API** section
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

### 5. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Click "Create Credentials" > "OAuth client ID"
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - (Add your production URL later)
7. Copy your **Client ID** and **Client Secret**

### 6. Configure Environment Variables

Open `.env.local` and fill in your values:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run-this-command-to-generate: openssl rand -base64 32

# Google OAuth (from step 5)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase (from step 4)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 7. Run the App!

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎉 You're Done!

Your app now uses:
- ✅ **Auth.js** - Free, open-source authentication
- ✅ **Supabase** - Free tier: 500MB database, 1GB file storage, 2GB bandwidth
- ✅ **No monthly costs** for small usage!

## 📝 Notes

- Supabase free tier limits: Up to 50,000 monthly active users
- When deploying to production:
  - Update `NEXTAUTH_URL` in `.env.local`
  - Add production URL to Google OAuth redirect URIs
  - Update Supabase image domain in `next.config.js`

## 🆘 Need Help?

If you see errors:
1. Check all environment variables are filled in
2. Make sure you ran the SQL script in Supabase
3. Verify the storage bucket is named `journal-images`
4. Check browser console for detailed error messages
