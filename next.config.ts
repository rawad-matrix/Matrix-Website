import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
  // PWA note: @ducanh2912/next-pwa requires webpack mode.
  // Next.js 16 uses Turbopack by default. PWA service worker will be
  // wired via a Turbopack-compatible approach in the deploy step.
}

export default nextConfig
