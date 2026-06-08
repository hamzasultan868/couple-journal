## Supabase Setup Guide - Couple's Journal

If journal entries aren't saving and photos fail to upload, it's likely because your Supabase database isn't properly configured. Follow these steps:

### Step 1: Create Storage Bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **couple-journal**
3. Go to **Storage** (left sidebar)
4. Click **Create a new bucket**
5. Name it: `journal-images`
6. **IMPORTANT**: Toggle **Make it public** ON
7. Click **Create bucket**

### Step 2: Run SQL Setup Script

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the entire contents of `SUPABASE_SETUP.sql` from this repo
4. Click **Run** (play button)
5. Wait for all tables to be created successfully

**Expected Output:**
```
Users table        | 0
Couples table      | 0
Journal entries    | 0
```

### Step 3: Add Storage Policies

1. Go to **Storage** → **journal-images** bucket
2. Click **Policies** tab
3. Click **New Policy** and create these policies:

**Policy 1 - Users can upload images:**
```
- Policy: Custom policy
- For: INSERT
- Using: (bucket_id = 'journal-images')
- With check: (bucket_id = 'journal-images' AND auth.role() = 'authenticated')
```

**Policy 2 - Public can read images:**
```
- Policy: Public access (Read)
```

### Step 4: Verify Setup in Browser

1. Open your app at localhost:3000 or live URL
2. Sign in
3. Create a couple (if not already)
4. Go to Dashboard
5. **Open Browser DevTools** (F12)
6. Go to **Console** tab
7. Try to upload a photo or write a journal entry
8. Look for log messages starting with:
   - `[createEntry]`
   - `[uploadImage]`
   - `[subscribeToEntries]`

### Step 5: Check for Errors

If you see errors in the console, share them here. Common errors:

**"Could not find the table 'public.journal_entries'"**
- **Solution**: Run the SQL setup script again

**"Permission denied"**
- **Solution**: Check RLS policies were created
- Go to SQL Editor and run: `SELECT * FROM journal_entries LIMIT 1;`

**"Bucket not found"**
- **Solution**: Make sure you created the `journal-images` storage bucket

**"Missing API permissions"**
- **Solution**: Your anon key might need storage permissions
- Check `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 6: Test the Full Flow

1. **Write an entry**: Click "Write text" button, type something, save
   - Check console for: `[createEntry] Entry created successfully`
2. **Upload a photo**: Click "Add photo", select an image, save
   - Check console for: `[uploadImage] Generated public URL`
3. **Reload page**: Should see your entries in the timeline
   - Check console for: `[subscribeToEntries] Initial fetch successful`

### Troubleshooting Commands

**To view all entries in your couples:**
```sql
SELECT id, couple_id, author_name, text, created_at FROM journal_entries ORDER BY created_at DESC LIMIT 10;
```

**To check if storage bucket exists:**
```sql
SELECT * FROM storage.buckets WHERE name = 'journal-images';
```

**To check RLS policies on journal_entries:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'journal_entries';
```

**To view all users:**
```sql
SELECT id, email, display_name, couple_id FROM users;
```

### If Everything Fails

1. Delete all data and start fresh:
```sql
DELETE FROM journal_entries;
DELETE FROM couples;
DELETE FROM users;
```

2. Drop and recreate tables:
```sql
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

3. Run `SUPABASE_SETUP.sql` again from scratch

### Commit This Setup

```bash
git add SUPABASE_SETUP.sql SUPABASE_SETUP_GUIDE.md
git commit -m "Add Supabase setup scripts and documentation"
git push origin main
```

---

**Need help?** Share your browser console errors and I'll help you debug! 🔍
