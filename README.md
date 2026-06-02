# Couple's Journal 💕

A beautiful, private digital journal for couples to share thoughts, photos, and memories together. Built with Next.js 14, Firebase, and love.

![Couple's Journal](https://via.placeholder.com/800x400/ff6b8a/ffffff?text=Couple's+Journal)

## ✨ Features

- **Shared Journal Entries**: Both partners can write and edit entries together
- **Photo Uploads**: Add photos from your camera or gallery with automatic compression
- **Real-time Sync**: See updates instantly with Firebase Firestore
- **Offline Support**: Access your memories even without internet
- **Beautiful UI**: Premium design with warm colors, smooth animations, and dark mode
- **Couple Linking**: Simple 6-digit invite codes or email-based pairing
- **Isla Character**: Friendly guide with warm illustrations throughout the app
- **Timeline View**: Chronological feed of your shared memories

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Animations**: Framer Motion
- **Image Processing**: browser-image-compression

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Firebase project (free tier works great!)
- Google account for authentication testing

## 🛠️ Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Once created, click on the web icon (</>) to create a web app
4. Register your app and copy the configuration

### 2. Enable Firebase Services

#### Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains (localhost is pre-authorized)

#### Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode** (we'll set rules next)
3. Choose a location close to your users
4. After creation, go to **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Couples: members can read/write their couple document
    match /couples/{coupleId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.partner1Id || 
         request.auth.uid == resource.data.partner2Id);
    }
    
    // Entries: couple members can read/write entries
    match /entries/{entryId} {
      allow read: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/couples/$(resource.data.coupleId)).data.keys();
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.authorId;
    }
  }
}
```

#### Storage
1. Go to **Storage** → **Get started**
2. Start in **production mode**
3. After creation, go to **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /couples/{coupleId}/images/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Create Firestore Indexes (Optional but Recommended)

Go to **Firestore Database** → **Indexes** and create:
- Collection: `entries`, Fields: `coupleId` (Ascending), `createdAt` (Descending)

## 💻 Local Development Setup

### 1. Clone and Install

```bash
# Navigate to the project directory
cd "C:\Users\786\Couple's Journal"

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**Where to find these values:**
- Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing Couple Linking

To test the couple linking feature with two accounts:

### Method 1: Using Two Browsers
1. Open Chrome normally, sign in with Account A
2. Create a new couple and copy the invite code
3. Open Chrome in Incognito mode, sign in with Account B
4. Join using the invite code from Account A
5. Both accounts now share the same journal!

### Method 2: Using Browser Profiles
1. Create two Chrome profiles
2. Sign in with different Google accounts
3. Test couple creation and joining

### Method 3: Mobile + Desktop
1. Use your desktop for one account
2. Use your mobile device for the partner account
3. Test the complete flow including photo uploads

## 🎨 Customizing Isla Character

The Isla character illustration is in `components/IslaIllustration.tsx`. To customize:

### Replace with your own SVG:
1. Create or download an SVG illustration
2. Replace the entire SVG code in the component
3. Adjust the `viewBox` and dimensions as needed

### Use an image instead:
```tsx
import Image from 'next/image'

export function IslaIllustration({ className = "" }: { className?: string }) {
  return (
    <Image 
      src="/isla.png" 
      alt="Isla" 
      width={200} 
      height={240}
      className={className}
    />
  )
}
```

Place your image in the `public/` folder.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables (same as `.env.local`)
4. Deploy!

**Important**: Add your Vercel domain to Firebase:
- Firebase Console → Authentication → Settings → Authorized domains
- Add: `your-app.vercel.app`

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Deploy and add domain to Firebase authorized domains

### Deploy to Other Hosts

```bash
# Build the production app
npm run build

# Start production server
npm start
```

## 📱 Progressive Web App (PWA)

To make this a PWA, add:

```bash
npm install next-pwa
```

Create `next.config.js`:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // ... existing config
})
```

## 🎨 Color Customization

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  blush: {
    // Your custom pink shades
  },
  sage: {
    // Your custom green shades
  },
}
```

## 🐛 Troubleshooting

### "Firebase not configured" error
- Double-check your `.env.local` file
- Ensure all variables start with `NEXT_PUBLIC_`
- Restart the dev server after changing env variables

### Authentication not working
- Check Firebase Console → Authentication → Sign-in method
- Verify Google provider is enabled
- Check authorized domains

### Images not uploading
- Verify Storage rules are set correctly
- Check browser console for CORS errors
- Ensure Firebase Storage is enabled

### Offline mode not working
- Persistence is enabled by default
- Check browser console for IndexedDB errors
- Try in a different browser

## 📖 Project Structure

```
couple-journal/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication page
│   ├── couple/            # Couple linking page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/timeline page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── EntryCard.tsx     # Journal entry card
│   ├── FloatingActionButton.tsx
│   ├── ImageUploader.tsx
│   ├── IslaIllustration.tsx
│   └── ...
├── lib/                   # Utilities and logic
│   ├── firebase/         # Firebase config and functions
│   ├── hooks/            # Custom React hooks
│   ├── store.ts          # Zustand state management
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── ...config files
```

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this for your own couple's journal!

## 💝 Credits

- Design inspired by premium couple apps
- Isla character concept: Warm, friendly, slightly quirky guide
- Built with love using Next.js and Firebase

## 🆘 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Firebase documentation
3. Check Next.js documentation

---

Made with ❤️ for couples who want to remember their journey together.
