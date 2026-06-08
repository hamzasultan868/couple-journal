# Supabase Setup Instructions for Hermes Agent

## Summary
The couple's journal app needs database tables created in Supabase. The SQL script had type compatibility issues. This guide provides manual UI-based setup.

## Step 1: Delete Existing Tables (Clean Slate)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select project: **couple-journal**
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and run THIS query (delete all old tables):

```sql
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

6. Click **Run** - wait for "Query succeeded"
7. You should see: `PostgreSQL query completed in Xms`

## Step 2: Create Tables via SQL Editor

1. Stay in **SQL Editor**
2. Click **New Query**
3. Copy the ENTIRE contents of `SUPABASE_SETUP_CLEAN.sql` from the repo
4. Paste it into the query box
5. Click **Run**
6. Wait for completion - should show:
   ```
   Users table        | 0
   Couples table      | 0
   Journal entries    | 0
   ```

## Step 3: Verify Tables Exist

1. In Supabase, go to **Table Editor** (left sidebar)
2. Refresh the page
3. You should see 3 new tables:
   - ✅ couples
   - ✅ users
   - ✅ journal_entries
4. Expand each table to verify columns exist

## Step 4: Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Bucket name: `journal-images`
4. **IMPORTANT**: Toggle **Make it public** ON (blue toggle)
5. Click **Create bucket**

## Step 5: Add Storage Policies

1. Click on **journal-images** bucket
2. Go to **Policies** tab
3. Click **New Policy** 

**Policy 1 - Authenticated users can upload:**
- Click **New Policy**
- Choose template: **For authenticated users**
- Action: **INSERT** 
- Click **Create policy**

**Policy 2 - Everyone can read:**
- Click **New Policy**
- Choose template: **For public access**
- Action: **SELECT**
- Click **Create policy**

## Step 6: Test in App

1. Open app: http://localhost:3000
2. Sign in with Google
3. Create a couple (if not already done)
4. Go to Dashboard
5. Open browser DevTools: **F12** → **Console** tab
6. Try to write an entry
7. Look for logs like:
   - `[createEntry] Entry created successfully`
   - `[subscribeToEntries] Initial fetch successful`

8. Try uploading a photo
9. Look for:
   - `[uploadImage] Image compressed`
   - `[uploadImage] Generated public URL`

## Step 7: Verify Data Persistence

1. Write a test entry with text
2. Click Save
3. See success toast ✅
4. Refresh page (F5)
5. Entry should still appear in timeline
6. Count should show "1 memory"

## Troubleshooting

**If tables don't show in Table Editor:**
- Refresh the page
- Try hard refresh: Ctrl+Shift+R
- Check that the SQL query completed without errors

**If upload fails with "Permission denied":**
- Go to Storage → journal-images → Policies
- Verify INSERT and SELECT policies exist
- Verify bucket is toggled PUBLIC

**If entries don't show after save:**
- Open browser Console (F12)
- Copy the `[getEntriesByCoupleId]` error message
- Share it to debug

**If you see type errors:**
- This means old schema still exists
- Re-run the DROP TABLE query from Step 1
- Then run the full SUPABASE_SETUP_CLEAN.sql again

## Success Criteria

- [ ] 3 tables created in Table Editor
- [ ] Storage bucket "journal-images" exists and is PUBLIC
- [ ] Can write entry without errors
- [ ] Can upload photo without errors
- [ ] Entry shows in timeline after refresh
- [ ] Memory counter shows correct count

## Rollback (if needed)

If everything breaks, drop all tables again:

```sql
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

Then start from Step 2.

---

**Need help?** Check browser console for `[functionName]` logs showing exact errors.
