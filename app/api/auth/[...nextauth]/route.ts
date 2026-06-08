import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('[NextAuth] NEXTAUTH_SECRET is not set')
}
if (!process.env.NEXTAUTH_URL) {
  console.warn('[NextAuth] NEXTAUTH_URL is not set, using default')
}
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('[NextAuth] Google credentials are not set')
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
      console.log('[NextAuth] User signed in:', user?.email)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
