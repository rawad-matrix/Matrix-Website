'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MobileMenu } from './MobileMenu'
import { SignInModal } from '@/components/ui/SignInModal'
import { useAuth } from '@/hooks/useAuth'

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

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-[#2A2F3A] text-white border-b border-white/5 transition-shadow duration-200"
        style={scrolled ? { boxShadow: '0 6px 24px rgba(0,0,0,.35)' } : {}}
      >
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5 h-[72px] flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-11 h-11 bg-white rounded-[3px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,.18)] flex-shrink-0">
              <Image src="/images/logo.jpg" alt="Matrix Energy & Automation" width={44} height={44} className="w-full h-full object-cover" priority />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-barlow font-extrabold text-[22px] italic text-white">Matrix</span>
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/55 font-medium">Energy & Automation</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-[14px] py-[10px] font-dm text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-150 group ${
                    isActive ? 'text-white' : 'text-white/78 hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className="absolute bottom-0 left-[14px] right-[14px] h-[2px] bg-[#1B6FCC] transition-all duration-200 ease-out origin-left"
                    style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  <span className="absolute bottom-0 left-[14px] right-[14px] h-[2px] bg-[#1B6FCC] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
                </Link>
              )
            })}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            {!loading && (
              user ? (
                <Link
                  href="/user/dashboard"
                  className="hidden lg:inline-flex items-center gap-2 bg-[#1B6FCC] text-white px-[18px] py-[10px] font-dm font-semibold text-[12px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] hover:-translate-y-px transition-all duration-150"
                >
                  My Account
                </Link>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="hidden lg:inline-flex items-center gap-2 bg-[#1B6FCC] text-white px-[18px] py-[10px] font-dm font-semibold text-[12px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] hover:-translate-y-px transition-all duration-150"
                >
                  Sign In
                </button>
              )
            )}
            {/* Burger */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}
