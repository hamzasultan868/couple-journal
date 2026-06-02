# Couple's Journal - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication (Google Sign-In)
4. Enable Firestore Database
5. Enable Storage
6. Copy your config from Project Settings

### 3. Configure Environment
Copy `.env.local.example` to `.env.local` and add your Firebase config:
```bash
cp .env.local.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

## 📱 Test with Two Accounts

**Browser Method:**
1. Open normal browser window → Sign in with Account 1 → Create couple
2. Open incognito window → Sign in with Account 2 → Join with code
3. Both accounts now share the same journal!

## 🎨 Features Overview

- ✍️ **Write Together**: Both partners can add and edit entries
- 📸 **Share Photos**: Upload images with automatic compression
- 💑 **Couple Linking**: Simple 6-digit invite codes
- 🌓 **Dark Mode**: Beautiful light and dark themes
- 📱 **Mobile Ready**: Responsive design for all devices
- 💾 **Offline Support**: Access your memories anywhere

## 📚 Full Documentation

See [README.md](./README.md) for complete setup instructions.

---

**Need Help?** Check the Troubleshooting section in README.md
