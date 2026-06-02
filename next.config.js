/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      // Add your Supabase storage domain here when you get it
      // e.g., 'your-project.supabase.co'
    ],
  },
}

module.exports = nextConfig
