import { Topbar } from '@/components/layout/Topbar'
import { Navbar } from '@/components/layout/Navbar'
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F4F6FA] min-h-screen">
      <Topbar />
      <Navbar />
      {children}
      <FloatingWhatsApp />
    </div>
  )
}
