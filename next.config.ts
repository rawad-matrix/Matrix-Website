import type { NextConfig } from 'next'

// Content-Security-Policy. Keeps 'unsafe-inline' for scripts/styles because the
// app relies on inline styles and Next.js inline hydration scripts, but locks
// every network/frame/image load to a known allowlist:
//   - Supabase (REST/auth/storage + realtime websockets)
//   - Cloudflare Turnstile (script + iframe)
//   - Cloudflare Web Analytics beacon
//   - Google Maps + YouTube embeds
// Update this string if you add a new external service.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://cloudflareinsights.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // No includeSubDomains/preload: the mail.* subdomain is on Bluehost and we
  // don't want to force HSTS on it. Applies to the web hosts that send it.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'Content-Security-Policy', value: csp },
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
