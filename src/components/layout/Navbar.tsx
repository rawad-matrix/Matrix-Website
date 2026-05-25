'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MobileMenu } from './MobileMenu'
import { SignInModal } from '@/components/ui/SignInModal'
import { useAuth } from '@/hooks/useAuth'

type NavChild = { href: string; label: string; desc: string }
type NavItem = { href: string; label: string; children?: NavChild[] }

const NAV_LINKS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/system-integrator', label: 'System Integrator' },
  {
    href: '/training',
    label: 'Training',
    children: [
      { href: '/training',             label: 'MatrixEA',            desc: 'Overview — all training types & courses' },
      { href: '/training/academic',    label: 'Academic Training',   desc: 'Structured classroom programs in Beirut' },
      { href: '/training/on-the-job',  label: 'On-the-Job Training', desc: 'Learn on real-site installations' },
      { href: '/training/hybrid',      label: 'Hybrid Learning',     desc: 'Blended online + on-site track' },
    ],
  },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const { user, loading, isAdmin } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDropdownOpen(true)
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-matrix-navy text-white border-b border-white/5 transition-shadow duration-200"
        style={scrolled ? { boxShadow: '0 6px 24px rgba(0,0,0,.35)' } : {}}
      >
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 bg-white rounded-[3px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,.18)] shrink-0">
              <Image src="/images/logo.jpg" alt="Matrix Energy & Automation" width={44} height={44} className="w-full h-full object-contain" priority />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-barlow font-extrabold text-[22px] italic text-white">Matrix</span>
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/55 font-medium">Energy & Automation</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-stretch gap-0 h-18">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))

              if (link.children) {
                return (
                  <div
                    key={link.href}
                    className="relative self-stretch flex items-center"
                    onMouseEnter={openDropdown}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={link.href}
                      className={`relative px-3 py-2.5 font-dm text-[12.5px] font-medium uppercase tracking-[0.07em] transition-colors duration-150 flex items-center gap-1 group h-full ${
                        isActive ? 'text-white' : 'text-white/78 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <svg
                        width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        className="transition-transform duration-200 mt-px"
                        style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                      <span
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-matrix-blue transition-all duration-200 ease-out origin-left"
                        style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                      />
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-matrix-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
                    </Link>

                    {/* Dropdown panel */}
                    <div
                      className="absolute top-full left-0 z-[200] min-w-[272px] transition-all duration-150"
                      style={{
                        background: '#2A2F3A',
                        border: '1px solid rgba(255,255,255,.10)',
                        borderTop: '2px solid #1B6FCC',
                        boxShadow: '0 12px 40px rgba(0,0,0,.50)',
                        borderRadius: '0 0 2px 2px',
                        opacity: dropdownOpen ? 1 : 0,
                        transform: dropdownOpen ? 'translateY(0)' : 'translateY(-5px)',
                        pointerEvents: dropdownOpen ? 'auto' : 'none',
                      }}
                    >
                      {link.children.map((child, i) => {
                        const childActive = pathname === child.href
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col px-5 py-3.5 transition-colors duration-150 hover:bg-white/5 group/item"
                            style={{
                              borderBottom: i < link.children!.length - 1 ? '1px solid rgba(255,255,255,.06)' : undefined,
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`font-dm text-[12px] font-semibold uppercase tracking-[0.07em] transition-colors duration-150 ${childActive ? 'text-[#1B6FCC]' : 'text-white/85 group-hover/item:text-white'}`}>
                                {child.label}
                              </span>
                              {i === 0 && (
                                <span className="font-mono text-[9px] px-1.5 py-[2px] bg-[#1B6FCC]/20 text-[#1B6FCC] border border-[#1B6FCC]/30 uppercase tracking-[0.1em] rounded-[2px]">
                                  overview
                                </span>
                              )}
                            </div>
                            <span className="font-dm text-[11px] text-white/38 mt-0.5 normal-case tracking-normal">
                              {child.desc}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2.5 font-dm text-[12.5px] font-medium uppercase tracking-[0.07em] transition-colors duration-150 group flex items-center ${
                    isActive ? 'text-white' : 'text-white/78 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-matrix-blue transition-all duration-200 ease-out origin-left"
                    style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-matrix-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
                </Link>
              )
            })}

            {/* Admin link — visible only when signed in as admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`relative px-3 py-2.5 font-dm text-[12.5px] font-medium uppercase tracking-[0.07em] transition-colors duration-150 flex items-center gap-1.5 group ${
                  pathname.startsWith('/admin') ? 'text-white' : 'text-white/78 hover:text-white'
                }`}
              >
                Admin
                <span className="font-mono text-[8.5px] px-1.5 py-[2px] bg-[#1B6FCC]/25 text-[#1B6FCC] border border-[#1B6FCC]/40 uppercase tracking-[0.1em] rounded-[2px]">
                  panel
                </span>
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-matrix-blue transition-all duration-200 ease-out origin-left"
                  style={{ transform: pathname.startsWith('/admin') ? 'scaleX(1)' : 'scaleX(0)' }}
                />
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-matrix-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
              </Link>
            )}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {!loading && (
              user ? (
                <Link
                  href="/user/dashboard"
                  className="hidden lg:inline-flex items-center gap-2 bg-matrix-blue text-white px-4 py-2.5 font-dm font-semibold text-[12px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
                >
                  My Account
                </Link>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="hidden lg:inline-flex items-center gap-2 bg-matrix-blue text-white px-4 py-2.5 font-dm font-semibold text-[12px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
                >
                  Sign In
                </button>
              )
            )}
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

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isAdmin={isAdmin} />
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}
