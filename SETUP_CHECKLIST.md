# Setup Checklist

Use this checklist to get your Couple's Journal up and running!

## ☑️ Pre-Setup

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm/yarn/pnpm installed
- [ ] Code editor ready (VS Code recommended)
- [ ] Two Google accounts for testing (or use incognito mode)

## ☑️ Firebase Setup

### Create Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Name it "Couples Journal" (or your choice)
- [ ] Disable Google Analytics (optional)
- [ ] Create project

### Enable Services
- [ ] **Authentication**
  - [ ] Go to Authentication → Sign-in method
  - [ ] Enable Google provider
  - [ ] Save changes

- [ ] **Firestore Database**
  - [ ] Go to Firestore Database
  - [ ] Click "Create database"
  - [ ] Start in production mode
  - [ ] Choose location (closest to users)
  - [ ] Go to Rules tab
  - [ ] Copy rules from FIREBASE_RULES.md
  - [ ] Publish rules

- [ ] **Storage**
  - [ ] Go to Storage
  - [ ] Click "Get started"
  - [ ] Start in production mode
  - [ ] Go to Rules tab
  - [ ] Copy storage rules from FIREBASE_RULES.md
  - [ ] Publish rules

### Get Configuration
- [ ] Go to Project Settings (gear icon)
- [ ] Scroll to "Your apps" section
- [ ] Click web icon (</>)
- [ ] Register app (name: "Couple's Journal Web")
- [ ] Copy the firebaseConfig object

## ☑️ Local Setup

### Install Project
- [ ] Open terminal
- [ ] Navigate to project: `cd "C:\Users\786\Couple's Journal"`
- [ ] Install dependencies: `npm install`
- [ ] Wait for installation to complete

### Configure Environment
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Open `.env.local` in editor
- [ ] Paste your Firebase config values:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  NEXT_PUBLIC_FIREBASE_APP_ID=...
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
  ```
- [ ] Save file

## ☑️ First Run

### Start Development Server
- [ ] Run: `npm run dev`
- [ ] Wait for "Ready in X ms" message
- [ ] Open http://localhost:3000
- [ ] App should load without errors

### Test Authentication
- [ ] Click "Continue with Google"
- [ ] Sign in with Account 1
- [ ] Should redirect to couple linking page

### Test Couple Creation
- [ ] Click "Create New Couple"
- [ ] Click "Generate Invite Code"
- [ ] Copy the 6-digit code
- [ ] You should see "Waiting for partner..."

### Test Couple Joining
- [ ] Open new incognito/private window
- [ ] Go to http://localhost:3000
- [ ] Sign in with Account 2 (different Google account)
- [ ] Click "Join Existing Couple"
- [ ] Enter the invite code
- [ ] Click "Join with Code"
- [ ] Should redirect to timeline

### Test Journal Entries
- [ ] Click the heart FAB (bottom right)
- [ ] Click "Write text"
- [ ] Write a test entry
- [ ] Optionally add photos
- [ ] Click "Save Memory"
- [ ] Entry should appear on timeline
- [ ] Check other window - entry should appear there too!

### Test Image Upload
- [ ] Click heart FAB → "Add photo"
- [ ] Drag and drop an image OR click to select
- [ ] Add optional text
- [ ] Click "Save Memory"
- [ ] Image should upload and compress
- [ ] Entry appears with image
- [ ] Click image to view full size

### Test Settings
- [ ] Click settings icon (top right)
- [ ] Check profile information
- [ ] Toggle dark mode
- [ ] Copy invite code
- [ ] Sign out works

## ☑️ Verification

### Functional Tests
- [ ] Both accounts see same entries in real-time
- [ ] Images load correctly
- [ ] Like button animates
- [ ] Delete works (only for author)
- [ ] Timeline shows newest first
- [ ] Relative timestamps update
- [ ] Dark mode persists on refresh
- [ ] Offline mode works (disconnect internet, refresh)

### Visual Tests
- [ ] Mobile responsive (resize browser)
- [ ] Animations are smooth
- [ ] Colors match design (blush pink, sage green)
- [ ] Fonts load correctly (Playfair Display, Inter)
- [ ] Isla character appears in empty states
- [ ] Entry cards have proper shadows
- [ ] Gradient border on collaborative entries

### Performance
- [ ] Initial load is fast
- [ ] Images compress (check Network tab)
- [ ] No console errors
- [ ] Smooth scrolling
- [ ] Quick navigation between pages

## ☑️ Production Deployment

### Build Test
- [ ] Run: `npm run build`
- [ ] Build completes without errors
- [ ] Run: `npm start`
- [ ] Production mode works

### Deploy to Vercel
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Add environment variables
- [ ] Deploy
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Test production app

## 🎉 Done!

Your Couple's Journal is ready! 

### Quick Reference
- **Local dev**: `npm run dev`
- **Build**: `npm run build`
- **Start prod**: `npm start`
- **Docs**: See README.md
- **Help**: Check TROUBLESHOOTING section in README.md

### Test Credentials Reminder
For testing, you need two separate Google accounts:
1. Your main Google account
2. A second Google account (or use incognito mode)

Both accounts can now share the same journal!

---

**Need help?** Check README.md for detailed troubleshooting.
**Ready to customize?** See PROJECT_SUMMARY.md for full overview.
