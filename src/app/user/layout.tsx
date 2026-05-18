import { Topbar } from '@/components/layout/Topbar'
import { Navbar } from '@/components/layout/Navbar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <Navbar />
      {children}
    </>
  )
}
