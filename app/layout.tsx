// app/layout.tsx
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import { CursorGlowOptimized } from "@/components/CursorGlowOptimized"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: "Couple's Journal - Share Your Love Story",
  description: "A private digital journal for couples to share thoughts, photos, and memories together",
  keywords: ["couple", "journal", "diary", "relationship", "memories"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>
          <CursorGlowOptimized />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
