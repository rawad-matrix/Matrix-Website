'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { AdminSidebar } from './AdminSidebar'

type Stats = {
  totalEnrollments: number
  pendingPayments: number
  activeCourses: number
  totalUsers: number
  totalCaseStudies: number
}

type RecentEnrollment = {
  id: string
  enrolled_at: string
  status: string
  profiles: { full_name: string | null } | null
  courses: { title: string } | null
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
        { count: totalUsers },
        { count: totalCaseStudies },
        { data: recentEnroll },
      ] = await Promise.all([
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'pending_payment'),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('case_studies').select('*', { count: 'exact', head: true }),
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
        totalUsers: totalUsers ?? 0,
        totalCaseStudies: totalCaseStudies ?? 0,
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
    <div className="bg-matrix-topbar min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
        {/* Page header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-7">
          <div>
            <h1 className="font-barlow font-bold uppercase leading-none" style={{ fontSize: '42px', color: '#1F2330' }}>
              Admin Panel{' '}
              <span
                className="inline-block text-[11px] font-dm font-semibold tracking-[.18em] px-2.5 py-1 align-middle ml-2"
                style={{ background: '#DC2626', color: '#fff', letterSpacing: '.18em' }}
              >
                RESTRICTED
              </span>
            </h1>
            <div className="text-[14px] text-matrix-muted mt-1.5">
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
                  <div key={i} className="bg-white border border-matrix-border rounded-xs p-4 h-20 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 max-[760px]:grid-cols-2 gap-3">
                {[
                  { label: 'Registered Users', val: stats?.totalUsers ?? 0 },
                  { label: 'Published Courses', val: stats?.activeCourses ?? 0 },
                  { label: 'Case Studies', val: stats?.totalCaseStudies ?? 0 },
                  { label: 'Pending Payments', val: stats?.pendingPayments ?? 0 },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white border border-matrix-border rounded-xs p-4" style={{ borderLeft: '3px solid #1B6FCC' }}>
                    <div className="text-[10.5px] tracking-[.18em] uppercase text-matrix-muted">{kpi.label}</div>
                    <div className="font-mono text-[26px] text-matrix-ink font-medium mt-1.5 leading-none">{kpi.val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Enrollments table */}
            <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-matrix-border">
                <h3 className="font-barlow font-bold uppercase text-[18px] tracking-[.04em] text-matrix-ink">Recent Enrollments</h3>
                <Link
                  href="/admin/enrollments"
                  className="font-dm font-semibold uppercase text-[11px] tracking-widest text-matrix-blue"
                >
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Student', 'Course', 'Date', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-[10.5px] tracking-[.18em] uppercase text-matrix-muted font-semibold bg-matrix-off">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(e => {
                      const pill = STATUS_PILL[e.status] ?? STATUS_PILL.pending
                      return (
                        <tr key={e.id} className="border-t border-matrix-border hover:bg-matrix-off">
                          <td className="px-6 py-3 text-matrix-ink font-medium">
                            {e.profiles?.full_name ?? '—'}
                          </td>
                          <td className="px-6 py-3 text-matrix-muted">{e.courses?.title ?? '—'}</td>
                          <td className="px-6 py-3 font-mono text-[12px] text-matrix-muted">
                            {new Date(e.enrolled_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className="inline-block text-[10.5px] px-2 py-1 font-semibold tracking-widest uppercase rounded-xs"
                              style={{ background: pill.bg, color: pill.color }}
                            >
                              {pill.label}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <Link
                              href="/admin/enrollments"
                              className="font-dm font-semibold uppercase text-[11px] px-2.5 py-1.5 text-matrix-ink"
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
                        <td colSpan={5} className="px-6 py-8 text-center text-matrix-muted text-[14px]">No enrollments yet</td>
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
