import type { Metadata } from 'next'
import { Barlow_Condensed, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { PublicShell } from '@/components/layout/PublicShell'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Matrix Energy & Automation',
    template: '%s | Matrix EA',
  },
  description: 'Industrial automation, system integration and energy solutions across Lebanon, Iraq, Saudi Arabia and Africa.',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  )
}
