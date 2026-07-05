import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // No includeSubDomains/preload: the mail.* subdomain is on Bluehost and we
  // don't want to force HSTS on it. Applies to the web hosts that send it.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
]

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
