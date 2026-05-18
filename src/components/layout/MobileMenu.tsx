'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/system-integrator', label: 'System Integrator' },
  { href: '/training', label: 'Training' },
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contact', label: 'Contact' },
  { href: '/install', label: 'Install App' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div
      className={`fixed inset-0 bg-[#2A2F3A] z-[100] flex flex-col transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-[3px] overflow-hidden flex-shrink-0">
            <Image src="/images/logo.jpg" alt="Matrix" width={44} height={44} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-barlow font-extrabold text-[22px] text-white italic">Matrix</span>
            <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/55 font-medium">Energy & Automation</span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col px-6 pt-8 gap-1">
        {NAV_LINKS.map((link, i) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`font-barlow font-bold text-[28px] uppercase tracking-wide py-3 border-b border-white/08 transition-all ${
                isActive ? 'text-[#1B6FCC]' : 'text-white hover:text-[#1B6FCC]'
              }`}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms, color 0.15s`,
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom CTA */}
      <div
        className="mt-auto p-6"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.4s ease ${NAV_LINKS.length * 60 + 60}ms, transform 0.4s ease ${NAV_LINKS.length * 60 + 60}ms`,
        }}
      >
        <Link
          href="/auth/sign-in"
          onClick={onClose}
          className="block w-full bg-[#1B6FCC] text-white text-center py-4 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
