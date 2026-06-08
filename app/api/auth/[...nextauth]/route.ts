import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

console.log('[NextAuth] Initializing...')

// Check for environment variables (warn but don't throw during build)
if (typeof window === 'undefined') {
  // Server-side only
  if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
    console.warn('[NextAuth] NEXTAUTH_SECRET is not set for production')
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('[NextAuth] GOOGLE_CLIENT_ID is not set')
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('[NextAuth] GOOGLE_CLIENT_SECRET is not set')
  }
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev-only',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      console.log('[NextAuth] Redirect - url:', url, 'baseUrl:', baseUrl)
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('[NextAuth] User signed in:', user?.email, 'isNewUser:', isNewUser)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
