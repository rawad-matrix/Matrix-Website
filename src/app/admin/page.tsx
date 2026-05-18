'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

type Stats = {
  totalEnrollments: number
  pendingPayments: number
  activeCourses: number
  totalUsers: number
}

type RecentEnrollment = {
  id: string
  enrolled_at: string
  status: string
  profiles: { full_name: string | null } | null
  courses: { title: string } | null
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { href: '/admin/courses', label: 'Courses', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { href: '/admin/enrollments', label: 'Enrollments', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: '/admin/case-studies', label: 'Case Studies', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { href: '/admin/settings', label: 'Settings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <aside className="bg-white border border-[#E2E8F0] rounded-[2px] p-2" style={{ position: 'sticky', top: '96px' }}>
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-3 text-[13.5px] font-medium transition-colors"
            style={{
              background: active ? '#2A2F3A' : 'transparent',
              color: active ? '#fff' : '#1F2330',
              borderRadius: '2px',
            }}
          >
            <span style={{ color: active ? '#1B6FCC' : '#1B6FCC', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
      <div className="border-t border-[#E2E8F0] mt-2 pt-2">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-3 w-full text-left text-[13.5px] font-medium text-[#64748B]"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '2px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F8F9FB')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" width="16" height="16">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default function AdminOverviewPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      const [
        { count: totalEnroll },
        { count: pendingPay },
        { count: activeCourses },
        { data: recentEnroll },
      ] = await Promise.all([
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'pending_payment'),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase
          .from('enrollments')
          .select('id, enrolled_at, status, profiles(full_name), courses(title)')
          .order('enrolled_at', { ascending: false })
          .limit(8),
      ])

      setStats({
        totalEnrollments: totalEnroll ?? 0,
        pendingPayments: pendingPay ?? 0,
        activeCourses: activeCourses ?? 0,
        totalUsers: 0,
      })
      if (recentEnroll) setRecent(recentEnroll as unknown as RecentEnrollment[])
      setLoading(false)
    }
    fetchData()
  }, [])

  const STATUS_PILL: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: 'rgba(34,197,94,.12)', color: '#16A34A', label: 'Active' },
    pending_payment: { bg: 'rgba(255,178,0,.12)', color: '#B47700', label: 'Pending Payment' },
    pending: { bg: 'rgba(255,178,0,.12)', color: '#B47700', label: 'Pending' },
    completed: { bg: 'rgba(27,111,204,.12)', color: '#1B6FCC', label: 'Completed' },
    cancelled: { bg: 'rgba(220,38,38,.12)', color: '#DC2626', label: 'Cancelled' },
  }

  return (
    <div className="bg-[#F4F6FA] min-h-screen py-8 pb-20">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
        {/* Page header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-7">
          <div>
            <h1 className="font-barlow font-bold uppercase leading-none" style={{ fontSize: '42px', color: '#1F2330' }}>
              Admin Panel{' '}
              <span
                className="inline-block text-[11px] font-dm font-semibold tracking-[.18em] px-[10px] py-[4px] align-middle ml-2"
                style={{ background: '#DC2626', color: '#fff', letterSpacing: '.18em' }}
              >
                RESTRICTED
              </span>
            </h1>
            <div className="text-[14px] text-[#64748B] mt-1.5">
              Signed in as <b>{user?.email ?? '…'}</b> · Full privileges
            </div>
          </div>
        </div>

        {/* Grid: sidebar + main */}
        <div className="grid max-[900px]:grid-cols-1 gap-6" style={{ gridTemplateColumns: '240px 1fr', alignItems: 'start' }}>
          <AdminSidebar />

          <div className="flex flex-col gap-5">
            {/* KPI cards */}
            {loading ? (
              <div className="grid grid-cols-4 max-[760px]:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-[#E2E8F0] rounded-[2px] p-4 h-20 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 max-[760px]:grid-cols-2 gap-3">
                {[
                  { label: 'Total Enrollments', val: stats?.totalEnrollments ?? 0 },
                  { label: 'Pending Payments', val: stats?.pendingPayments ?? 0 },
                  { label: 'Published Courses', val: stats?.activeCourses ?? 0 },
                  { label: 'Registered Users', val: stats?.totalUsers ?? 0 },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white border border-[#E2E8F0] rounded-[2px] p-4" style={{ borderLeft: '3px solid #1B6FCC' }}>
                    <div className="text-[10.5px] tracking-[.18em] uppercase text-[#64748B]">{kpi.label}</div>
                    <div className="font-mono text-[26px] text-[#1F2330] font-medium mt-1.5 leading-none">{kpi.val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Enrollments table */}
            <div className="bg-white border border-[#E2E8F0] rounded-[2px] overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#E2E8F0]">
                <h3 className="font-barlow font-bold uppercase text-[18px] tracking-[.04em] text-[#1F2330]">Recent Enrollments</h3>
                <Link
                  href="/admin/enrollments"
                  className="font-dm font-semibold uppercase text-[11px] tracking-[.1em] text-[#1B6FCC]"
                >
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Student', 'Course', 'Date', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-[10.5px] tracking-[.18em] uppercase text-[#64748B] font-semibold bg-[#F8F9FB]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(e => {
                      const pill = STATUS_PILL[e.status] ?? STATUS_PILL.pending
                      return (
                        <tr key={e.id} className="border-t border-[#E2E8F0] hover:bg-[#F8F9FB]">
                          <td className="px-6 py-3 text-[#1F2330] font-medium">
                            {e.profiles?.full_name ?? '—'}
                          </td>
                          <td className="px-6 py-3 text-[#64748B]">{e.courses?.title ?? '—'}</td>
                          <td className="px-6 py-3 font-mono text-[12px] text-[#64748B]">
                            {new Date(e.enrolled_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className="inline-block text-[10.5px] px-2 py-1 font-semibold tracking-[.1em] uppercase rounded-[2px]"
                              style={{ background: pill.bg, color: pill.color }}
                            >
                              {pill.label}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <Link
                              href="/admin/enrollments"
                              className="font-dm font-semibold uppercase text-[11px] px-[10px] py-[6px] text-[#1F2330]"
                              style={{ border: '1px solid #E2E8F0', borderRadius: '2px' }}
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                    {recent.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#64748B] text-[14px]">No enrollments yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
