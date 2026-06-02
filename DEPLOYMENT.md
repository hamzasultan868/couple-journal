# Deployment Guide

## 🚀 Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js apps.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings

### Step 3: Add Environment Variables
In Vercel project settings, add all your Firebase env vars:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### Step 4: Update Firebase
Add your Vercel domain to Firebase Console:
- Authentication → Settings → Authorized domains
- Add: `your-app.vercel.app`

### Step 5: Deploy!
Click "Deploy" and your app will be live in minutes!

## 🌐 Custom Domain

### In Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS instructions

### In Firebase:
1. Add custom domain to authorized domains
2. Update NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN if needed

## 📦 Other Deployment Options

### Netlify
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
Add all NEXT_PUBLIC_* variables
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-Hosted
```bash
npm run build
npm start
# Runs on port 3000
```

## 🔒 Production Checklist

- [ ] Environment variables are set
- [ ] Firebase authorized domains updated
- [ ] Firestore rules are production-ready
- [ ] Storage rules are production-ready
- [ ] Test authentication flow
- [ ] Test couple linking
- [ ] Test image uploads
- [ ] Check mobile responsiveness
- [ ] Enable HTTPS
- [ ] Set up error monitoring (optional)

## 📊 Monitoring

### Firebase Usage
Monitor in Firebase Console:
- Authentication → Usage
- Firestore → Usage
- Storage → Usage

### Vercel Analytics
Enable in Vercel dashboard for:
- Page views
- Performance metrics
- Error tracking

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: Push to `main` branch
- **Preview**: Open pull requests

### Manual Deployment
```bash
vercel --prod
```

## 🆘 Troubleshooting Deployment

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Firebase connection issues
- Verify all env variables are set in Vercel
- Check Firebase project is active
- Verify domain is authorized

### Build fails
- Check build logs in Vercel
- Test build locally: `npm run build`
- Ensure all dependencies are in package.json

---

Your Couple's Journal is now live! 🎉
