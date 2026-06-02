# Supabase Setup — Quick Reference

## TL;DR

Your Supabase project is connected to your SaaS. All the code is ready. Here's what you need to know:

### Your Credentials
```
URL: https://qaxuobwisolychwgbsot.supabase.co
Key: sb_publishable_ltaNA7nnVozoSCOcZIjg
Project: qaxuobwisolychwgbsot
```

### Files Created
- `lib/supabase.ts` - Client setup
- `lib/db.ts` - All database functions
- `lib/useAuth.ts` - Auth hook
- `components/auth/SignUp.tsx` - Example signup
- `components/couples/CouplesList.tsx` - Couples management
- `SUPABASE_SETUP.md` - Full setup guide
- `INTEGRATION_CHECKLIST.md` - What to do next

### Database Structure
```
users → couples ← users
         ↓
       entries → entry_images
```

- **users:** Store user profiles
- **couples:** Link two users with invite code
- **entries:** Journal entries for couples
- **entry_images:** Photos in entries

### One-Minute Usage

**Create couple:**
```js
import { createCouple } from '@/lib/db'
const couple = await createCouple(userId, 'Our Story')
console.log(couple.invite_code) // Share this!
```

**Add entry:**
```js
import { createEntry } from '@/lib/db'
await createEntry(coupleId, userId, 'Title', 'Content...')
```

**Get all entries:**
```js
import { getEntries } from '@/lib/db'
const entries = await getEntries(coupleId)
```

**Upload image:**
```js
import { uploadEntryImage } from '@/lib/db'
const url = await uploadEntryImage(entryId, file)
```

### Security
- ✅ RLS enabled on all tables
- ✅ Only couple members can see their data
- ✅ Authors can only edit their own entries
- ✅ Images tied to entries

### Next Steps
1. Create storage bucket for images (1 min)
2. Test signup/login (5 min)
3. Replace Firebase with these functions (30 min)
4. Deploy (5 min)

### Dashboard
👉 https://supabase.com/dashboard/project/qaxuobwisolychwgbsot

---

**Everything is ready. Start building!** 🚀
