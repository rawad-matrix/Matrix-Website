import { redirect } from 'next/navigation'

// Monitoring dashboard is hidden for now. This server-side redirect can't be
// cached, so it reliably sends every visitor to /courses (middleware also
// redirects as a first line). To re-enable monitoring, restore the original
// layout that rendered <Topbar /> <Navbar /> {children}.
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default function DashboardLayout() {
  redirect('/courses')
}
