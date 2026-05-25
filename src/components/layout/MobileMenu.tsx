'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

type NavChild = { href: string; label: string }
type NavItem = { href: string; label: string; children?: NavChild[] }

const NAV_LINKS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/system-integrator', label: 'System Integrator' },
  {
    href: '/training',
    label: 'Training',
    children: [
      { href: '/training',            label: 'MatrixEA — Overview' },
      { href: '/training/academic',   label: 'Academic Training' },
      { href: '/training/on-the-job', label: 'On-the-Job Training' },
      { href: '/training/hybrid',     label: 'Hybrid Learning' },
    ],
  },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contact', label: 'Contact' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  isAdmin?: boolean
}

export function MobileMenu({ open, onClose, isAdmin }: MobileMenuProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    onClose()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset expanded when menu closes
  useEffect(() => {
    if (!open) setExpanded(null)
  }, [open])

  let itemIndex = 0

  return (
    <div
      className={`fixed inset-0 bg-matrix-navy z-100 flex flex-col transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-18 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-[3px] overflow-hidden shrink-0">
            <Image src="/images/logo.jpg" alt="Matrix" width={44} height={44} className="w-full h-full object-contain" />
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
      <nav className="flex flex-col px-6 pt-6 gap-0 overflow-y-auto flex-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          const isExpanded = expanded === link.label
          const delay = `${itemIndex++ * 55}ms`

          if (link.children) {
            return (
              <div
                key={link.href}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.4s ease ${delay}, transform 0.4s ease ${delay}`,
                }}
              >
                {/* Parent row — toggle button */}
                <div className="flex items-center justify-between border-b border-white/08">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`font-barlow font-bold text-[26px] uppercase tracking-wide py-3 transition-colors flex-1 ${
                      isActive ? 'text-matrix-blue' : 'text-white hover:text-matrix-blue'
                    }`}
                  >
                    {link.label}
                  </Link>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : link.label)}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className="transition-transform duration-200"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {/* Sub-links */}
                <div
                  className="overflow-hidden transition-all duration-250"
                  style={{ maxHeight: isExpanded ? `${link.children.length * 52}px` : '0' }}
                >
                  {link.children.map((child, i) => {
                    const childActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 pl-5 pr-2 py-3 font-dm text-[15px] font-medium uppercase tracking-[0.06em] transition-colors border-b border-white/05 ${
                          childActive ? 'text-matrix-blue' : 'text-white/65 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-[2px] h-4 shrink-0 rounded-full"
                          style={{ background: i === 0 ? '#1B6FCC' : 'rgba(255,255,255,.18)' }}
                        />
                        {child.label}
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
              onClick={onClose}
              className={`font-barlow font-bold text-[26px] uppercase tracking-wide py-3 border-b border-white/08 transition-all ${
                isActive ? 'text-matrix-blue' : 'text-white hover:text-matrix-blue'
              }`}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease ${delay}, transform 0.4s ease ${delay}, color 0.15s`,
              }}
            >
              {link.label}
            </Link>
          )
        })}

        {/* Admin section — only for admin users */}
        {isAdmin && (
          <div
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.4s ease ${NAV_LINKS.length * 55}ms, transform 0.4s ease ${NAV_LINKS.length * 55}ms`,
            }}
          >
            <div className="flex items-center gap-3 mt-4 mb-1 pt-4 border-t border-white/15">
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-matrix-blue/25 text-matrix-blue border border-matrix-blue/40 uppercase tracking-widest rounded-xs">
                Admin Panel
              </span>
            </div>
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 pl-2 pr-2 py-3 font-dm text-[18px] font-semibold uppercase tracking-[0.06em] transition-colors border-b border-white/08 ${
                pathname.startsWith('/admin') ? 'text-matrix-blue' : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="w-0.5 h-4 shrink-0 rounded-full bg-matrix-blue" />
              Admin Panel
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom CTA */}
      <div
        className="p-6 shrink-0"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.4s ease ${NAV_LINKS.length * 55 + 60}ms, transform 0.4s ease ${NAV_LINKS.length * 55 + 60}ms`,
        }}
      >
        <Link
          href="/auth/sign-in"
          onClick={onClose}
          className="block w-full bg-matrix-blue text-white text-center py-4 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
