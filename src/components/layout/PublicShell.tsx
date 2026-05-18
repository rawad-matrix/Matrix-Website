'use client'
import { usePathname } from 'next/navigation'
import { Topbar } from './Topbar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { FloatingWhatsApp } from './FloatingWhatsApp'

const HIDDEN_ROUTES = ['/dashboard', '/admin', '/auth', '/user']

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic = !HIDDEN_ROUTES.some((r) => pathname.startsWith(r))

  if (!isPublic) return <>{children}</>

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
