'use client'
import { usePathname } from 'next/navigation'
import { Topbar } from './Topbar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { FloatingWhatsApp } from './FloatingWhatsApp'
import { SignInModal } from './SignInModal'

const HIDDEN_ROUTES = ['/dashboard', '/admin', '/auth', '/user']

// Hide footer on course detail pages (/courses/some-slug) but keep it on /courses listing.
// '/courses/slug'.startsWith('/courses/') === true
// '/courses'.startsWith('/courses/')      === false  ✓
const NO_FOOTER_ROUTES = ['/courses/']

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic = !HIDDEN_ROUTES.some((r) => pathname.startsWith(r))

  if (!isPublic) return <>{children}</>

  const hideFooter = NO_FOOTER_ROUTES.some((r) => pathname.startsWith(r))

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <FloatingWhatsApp />
      <SignInModal />
    </>
  )
}
