'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'

type Enrollment = {
  id: string
  status: string
  enrolled_at: string
  profiles: { full_name: string | null; email?: string } | null
  courses: { title: string; slug: string } | null
}

const STATUS_PILL: Record<string, { bg: string; color: string }> = {
  active: { bg: 'rgba(34,197,94,.12)', color: '#16A34A' },
  pending_payment: { bg: 'rgba(255,178,0,.12)', color: '#B47700' },
  pending: { bg: 'rgba(255,178,0,.12)', color: '#B47700' },
  completed: { bg: 'rgba(27,111,204,.12)', color: '#1B6FCC' },
  cancelled: { bg: 'rgba(220,38,38,.12)', color: '#DC2626' },
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('enrollments')
      .select('id, status, enrolled_at, profiles(full_name), courses(title, slug)')
      .order('enrolled_at', { ascending: false })
      .then(({ data }) => {
        if (data) setEnrollments(data as unknown as Enrollment[])
        setLoading(false)
      })
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id)
    const supabase = createClient()
    await supabase.from('enrollments').update({ status: newStatus }).eq('id', id)
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e))
    setUpdating(null)
  }

  const FILTER_OPTIONS = ['all', 'pending', 'active', 'completed', 'cancelled']
  const filtered = filter === 'all' ? enrollments : enrollments.filter(e => e.status === filter)

  return (
    <div className="bg-[#F4F6FA] min-h-screen py-8 pb-20">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
        <div className="mb-7">
          <h1 className="font-barlow font-bold uppercase text-[42px] text-[#1F2330] leading-none">Admin Panel</h1>
        </div>

        <div className="grid max-[900px]:grid-cols-1 gap-6" style={{ gridTemplateColumns: '240px 1fr', alignItems: 'start' }}>
          <AdminSidebar />

          <div className="flex flex-col gap-4">
            {/* Filter bar */}
            <div className="flex gap-2 flex-wrap">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="font-mono text-[10.5px] tracking-[.1em] uppercase px-[12px] py-[6px] cursor-pointer transition-all"
                  style={{
                    background: filter === f ? '#2A2F3A' : '#fff',
                    color: filter === f ? '#fff' : '#64748B',
                    border: `1px solid ${filter === f ? '#2A2F3A' : '#E2E8F0'}`,
                    borderRadius: '2px',
                  }}
                >
                  {f === 'all' ? 'All' : f.replace('_', ' ')} {f === 'all' ? `(${enrollments.length})` : `(${enrollments.filter(e => e.status === f).length})`}
                </button>
              ))}
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-[2px] overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#E2E8F0]">
                <h3 className="font-barlow font-bold uppercase text-[22px] tracking-[.04em] text-[#1F2330]">
                  Enrollments ({filtered.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-8 text-center font-mono text-[12px] text-[#64748B] tracking-[.1em]">LOADING…</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[13px]">
                    <thead>
                      <tr>
                        {['Student', 'Course', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[.18em] uppercase text-[#64748B] font-semibold bg-[#F8F9FB]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(e => {
                        const pill = STATUS_PILL[e.status] ?? STATUS_PILL.pending
                        return (
                          <tr key={e.id} className="border-t border-[#E2E8F0] hover:bg-[#F8F9FB]">
                            <td className="px-5 py-3">
                              <div className="font-medium text-[#1F2330]">{e.profiles?.full_name ?? '—'}</div>
                            </td>
                            <td className="px-5 py-3 text-[#64748B] max-w-[160px] truncate">{e.courses?.title ?? '—'}</td>
                            <td className="px-5 py-3 font-mono text-[11.5px] text-[#64748B]">
                              {new Date(e.enrolled_at).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className="inline-block text-[10px] px-2 py-1 font-semibold tracking-[.08em] uppercase rounded-[2px]"
                                style={{ background: pill.bg, color: pill.color }}
                              >
                                {e.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex gap-1.5">
                                {(e.status === 'pending' || e.status === 'pending_payment') && (
                                  <>
                                    <button
                                      onClick={() => updateStatus(e.id, 'active')}
                                      disabled={updating === e.id}
                                      className="font-dm font-semibold uppercase text-[10.5px] px-[8px] py-[5px]"
                                      style={{ background: 'rgba(34,197,94,.12)', color: '#16A34A', border: '1px solid rgba(34,197,94,.25)', borderRadius: '2px', cursor: 'pointer' }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => updateStatus(e.id, 'cancelled')}
                                      disabled={updating === e.id}
                                      className="font-dm font-semibold uppercase text-[10.5px] px-[8px] py-[5px]"
                                      style={{ background: 'rgba(220,38,38,.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,.2)', borderRadius: '2px', cursor: 'pointer' }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {e.status === 'active' && (
                                  <button
                                    onClick={() => updateStatus(e.id, 'completed')}
                                    disabled={updating === e.id}
                                    className="font-dm font-semibold uppercase text-[10.5px] px-[8px] py-[5px]"
                                    style={{ border: '1px solid #E2E8F0', color: '#64748B', borderRadius: '2px', cursor: 'pointer', background: 'transparent' }}
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-[#64748B] text-[14px]">No enrollments found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
