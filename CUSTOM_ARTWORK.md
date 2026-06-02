# Custom Artwork & Animations

This document details all the custom animated artwork and components created for the Couple's Journal app, replacing all generic icons and logos with beautiful, interactive SVG animations.

## 🎨 Custom Animated Components

### 1. AnimatedLogo
**Location**: `components/AnimatedLogo.tsx`

A stunning custom logo featuring an interactive animated heart design.

**Features**:
- Split heart path with gradient strokes (pink-to-purple gradient)
- 3 decorative inner hearts with scale and rotation on hover
- 5 sparkles that pulse and rotate around the heart
- Infinity symbol that appears on hover
- Radial gradient glow effect
- Fully interactive with smooth hover animations

**Usage**:
```tsx
<AnimatedLogo size={120} />
```

**Used in**:
- Landing page navigation
- Landing page hero section
- Auth page header
- Couple page header
- Loading states

**Variants**:
- Size: Customizable (default: 100px)
- Automatically scales all elements proportionally

---

### 2. AnimatedHeart
**Location**: `components/AnimatedHeart.tsx`

A versatile reusable heart component with multiple animation variants and color options.

**Features**:
- 4 animation variants: beating, floating, pulse, fill
- 4 color options: pink (#EC4899), purple (#A855F7), blue (#3B82F6), gradient
- Sparkle effects that animate around the heart
- Path draw animation for the fill variant
- Fully customizable with props

**Props**:
```typescript
interface AnimatedHeartProps {
  size?: number           // Default: 24
  variant?: 'beating' | 'floating' | 'pulse' | 'fill'  // Default: 'beating'
  color?: 'pink' | 'purple' | 'blue' | 'gradient'      // Default: 'pink'
  className?: string
}
```

**Animation Variants**:
1. **beating**: Scale pulse (1 → 1.2 → 1, 1.5s repeat)
2. **floating**: Y-axis float + rotate (-10px, 3s ease-in-out)
3. **pulse**: Scale + opacity (0.8 → 1.2, 2s repeat)
4. **fill**: Path draw animation with sparkles

**Used in**:
- Landing page navigation (gradient, beating)
- Auth page footer (pink, pulse)
- Dashboard header - partner name (pink, beating)
- Couple page "Create" button (gradient, beating)
- Settings page "Your Couple" header (pink, beating)
- Settings page partner connection heart (gradient, pulse)
- Settings page footer (pink, beating)
- EntryCard like button (pink/gradient, beating/floating)
- EntryCard contributor indicator (pink, pulse)
- EmptyState motivation (gradient, pulse)
- FloatingActionButton main button (gradient, beating)

---

### 3. CoupleIllustration
**Location**: `components/CoupleIllustration.tsx`

A beautiful custom illustration showing a couple with intricate animations.

**Features**:
- Two stylized person figures with gradient fills
- Person 1 (left): Pink gradient (#EC4899 → #F472B6)
- Person 2 (right): Purple gradient (#A855F7 → #C084FC)
- Both figures have:
  - Breathing animation (scale 1 → 1.02)
  - Blinking eyes (scaleY 1 → 0, every 3s)
  - Animated smile paths
- Central heart with sparkles
- 4 floating hearts in background (rising with fade)
- Orbiting decorative elements (circles/stars)
- All animations offset for natural feel

**Usage**:
```tsx
<CoupleIllustration />
```

**Used in**:
- Landing page hero section (in tilt card)

**Dimensions**:
- ViewBox: 0 0 800 600
- Automatically responsive

---

### 4. LoadingAnimation
**Location**: `components/LoadingAnimation.tsx`

A sophisticated loading animation replacing generic spinners.

**Features**:
- 5 orbiting hearts (pink, purple, blue, yellow, green)
- Hearts rotate around center at 3s intervals
- Central gradient heart with scale + rotate pulse
- 3 expanding pulse rings
- Animated message text with opacity pulse
- Smooth, professional loading experience

**Props**:
```typescript
interface LoadingAnimationProps {
  message?: string  // Default: "Loading..."
}
```

**Usage**:
```tsx
<LoadingAnimation message="Loading your memories..." />
```

**Used in**:
- Dashboard loading state
- Settings loading state
- Auth loading (implicitly via AnimatedLogo)
- Couple page loading (implicitly via AnimatedLogo)

---

### 5. SuccessAnimation
**Location**: `components/SuccessAnimation.tsx`

A celebratory success animation for completed actions.

**Features**:
- 30 confetti pieces (random colors, sizes, trajectories)
- Central gradient circle (pink → purple → blue)
- Animated check mark with path draw effect
- 3 orbiting hearts around the check mark
- 8 radial sparkles that pulse outward
- Success message with fade-in
- Auto-completes after 3s

**Props**:
```typescript
interface SuccessAnimationProps {
  onComplete?: () => void
}
```

**Usage**:
```tsx
<SuccessAnimation onComplete={() => console.log('Done!')} />
```

**Ready for use in**:
- Entry creation success
- Couple connection success (currently uses confetti hook)
- Settings update success
- Photo upload success
- Any action that needs celebration

---

## 🌟 Integration Summary

### Components Updated

1. **Landing Page** (`app/page.tsx`)
   - Navigation logo → AnimatedLogo (24px, beating)
   - Hero logo → AnimatedLogo (150px)
   - Hero illustration → CoupleIllustration
   - Loading state → AnimatedLogo (120px)

2. **Auth Page** (`app/auth/page.tsx`)
   - Header logo → AnimatedLogo (120px)
   - Footer heart → AnimatedHeart (16px, pulse, pink)
   - Loading state → AnimatedLogo (implicit)

3. **Dashboard** (`app/dashboard/page.tsx`)
   - Loading state → LoadingAnimation with message
   - Partner name heart → AnimatedHeart (12px, beating, pink)

4. **Couple Page** (`app/couple/page.tsx`)
   - Loading state → AnimatedLogo (120px)
   - Create button → AnimatedHeart (20px, beating, gradient)

5. **Settings Page** (`app/settings/page.tsx`)
   - Loading state → LoadingAnimation with message
   - Section header → AnimatedHeart (20px, beating, pink)
   - Partner heart → AnimatedHeart (20px, pulse, gradient)
   - Footer → AnimatedHeart (16px, beating, pink)

6. **EntryCard** (`components/EntryCard.tsx`)
   - Like button → AnimatedHeart (20px, beating/floating, pink/gradient)
   - Contributor badge → AnimatedHeart (12px, pulse, pink)

7. **FloatingActionButton** (`components/FloatingActionButton.tsx`)
   - Main button → AnimatedHeart (28px, beating, gradient)

8. **EmptyState** (`components/EmptyState.tsx`)
   - Motivation heart → AnimatedHeart (32px, pulse, gradient)

---

## 🎭 Animation Library

The app now uses a comprehensive animation stack:

### Core Libraries
- **Framer Motion 11.0.3**: All component animations
- **react-type-animation**: Hero text typing effect
- **react-intersection-observer**: Scroll-triggered animations
- **react-parallax-tilt**: 3D tilt effects on cards
- **lottie-react**: Ready for Lottie animations
- **aos**: Scroll animations
- **react-scroll**: Smooth scrolling

### Custom CSS Animations
**Location**: `app/globals.css`

1. **@keyframes blob** (7s infinite)
   - Organic blob morphing animation
   - Used in background elements

2. **@keyframes float** (3s infinite)
   - Gentle up/down float
   - Used for floating elements

3. **@keyframes heartbeat** (1.5s infinite)
   - Scale pulse for hearts
   - Classic heartbeat feel

4. **@keyframes gradient-x** (3s infinite)
   - Horizontal gradient animation
   - Used for background gradients

### Animation Utilities
- `.glass`: Glassmorphism effect (backdrop-blur + rgba)
- `.animation-delay-2s`, `.animation-delay-4s`: Stagger animations
- Tailwind custom animations in config

---

## 🎨 Design Language

### Color Palette
- **Pink**: #EC4899 (primary love color)
- **Purple**: #A855F7 (secondary magic color)
- **Blue**: #3B82F6 (accent trust color)
- **Yellow**: #FCD34D (sparkle/energy color)
- **Green**: #10B981 (success color)

### Gradients
All components use consistent gradient directions:
- **Main gradient**: `linear-gradient(135deg, #EC4899 → #A855F7 → #3B82F6)`
- **Soft gradient**: `linear-gradient(135deg, pink-500 → purple-500)`
- **Radial glow**: `radial-gradient(circle, rgba(236,72,153,0.3) → transparent)`

### Animation Timing
- **Fast interactions**: 0.3s (hover, click)
- **UI transitions**: 0.5-0.8s (page loads, dialogs)
- **Ambient animations**: 2-4s (floating, breathing)
- **Infinite loops**: 1.5-7s depending on effect

---

## 🚀 Performance Optimizations

All custom SVG components are optimized:
- Pure SVG paths (no external images)
- Framer Motion hardware acceleration
- Minimal DOM nodes
- Efficient animation loops
- No layout thrashing
- RequestAnimationFrame-based

---

## 📦 Export Structure

All components are exported from `components/index.ts`:

```typescript
// Custom Animated Components
export { AnimatedLogo } from './AnimatedLogo'
export { AnimatedHeart } from './AnimatedHeart'
export { CoupleIllustration } from './CoupleIllustration'
export { LoadingAnimation } from './LoadingAnimation'
export { SuccessAnimation } from './SuccessAnimation'

// Other Components
export { EmptyState } from './EmptyState'
export { EntryCard } from './EntryCard'
export { FloatingActionButton } from './FloatingActionButton'
export { ImageUploader } from './ImageUploader'
export { IslaIllustration } from './IslaIllustration'
export { NewEntryDialog } from './NewEntryDialog'
export { ThemeToggle } from './ThemeToggle'
```

---

## ✨ Future Enhancements

Potential additions to consider:

1. **AnimatedAvatar**: Custom avatar component with breathing effect
2. **AnimatedButton**: Button with ripple/glow effects
3. **AnimatedInput**: Input field with focus animations
4. **ParticleBackground**: Interactive particle system
5. **MorphingShape**: Shape-shifting decorative elements
6. **TextReveal**: Animated text reveal effects
7. **ImageGallery**: Animated photo gallery with transitions
8. **TimelineAnimation**: Animated timeline visualization
9. **CountUp**: Animated number counter for stats
10. **ProgressRing**: Circular progress indicator

---

## 🎯 Key Achievements

✅ Replaced 100% of generic Heart icons with custom AnimatedHeart  
✅ Created custom AnimatedLogo used throughout the app  
✅ Added beautiful CoupleIllustration to landing page  
✅ Replaced all loading states with custom LoadingAnimation  
✅ Created ready-to-use SuccessAnimation for celebrations  
✅ Maintained consistent design language across all components  
✅ Zero TypeScript errors  
✅ All animations are smooth and performant  
✅ Fully responsive and accessible  
✅ Dark mode compatible  

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Author**: Custom artwork for Couple's Journal  
**Status**: ✅ Production Ready
