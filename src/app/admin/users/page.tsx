'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from '../page'

type UserRow = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  full_name: string | null
  phone: string | null
  company: string | null
  role: 'student' | 'admin'
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setUsers(d.users)
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      u.email.toLowerCase().includes(q) ||
      (u.full_name ?? '').toLowerCase().includes(q) ||
      (u.company ?? '').toLowerCase().includes(q)
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const counts = {
    all: users.length,
    student: users.filter(u => u.role === 'student').length,
    admin: users.filter(u => u.role === 'admin').length,
  }

  return (
    <div className="bg-matrix-topbar min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
        <div className="mb-7">
          <h1 className="font-barlow font-bold uppercase text-[42px] text-matrix-ink leading-none">Admin Panel</h1>
        </div>

        <div className="grid max-[900px]:grid-cols-1 gap-6" style={{ gridTemplateColumns: '240px 1fr', alignItems: 'start' }}>
          <AdminSidebar />

          <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-matrix-border">
              <h3 className="font-barlow font-bold uppercase text-[22px] tracking-[.04em] text-matrix-ink">
                Users ({users.length})
              </h3>
              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
                <div className="relative flex-1">
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-matrix-muted pointer-events-none"
                  >
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search name, email, company…"
                    className="w-full pl-8 pr-3 py-2 text-[13px] font-dm text-matrix-ink border border-matrix-border rounded-xs outline-none focus:border-matrix-blue"
                  />
                </div>
              </div>
            </div>

            {/* Role filter pills */}
            <div className="flex gap-2 px-6 py-3 border-b border-matrix-border bg-matrix-off">
              {(['all', 'student', 'admin'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className="px-3 py-1.5 font-dm text-[11.5px] font-semibold uppercase tracking-widest rounded-xs transition-colors"
                  style={{
                    background: roleFilter === r ? '#1B6FCC' : 'transparent',
                    color: roleFilter === r ? '#fff' : '#64748B',
                    border: `1px solid ${roleFilter === r ? '#1B6FCC' : '#E2E8F0'}`,
                  }}
                >
                  {r === 'all' ? `All (${counts.all})` : r === 'student' ? `Students (${counts.student})` : `Admins (${counts.admin})`}
                </button>
              ))}
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-8 text-center font-mono text-[12px] text-matrix-muted tracking-widest">LOADING…</div>
            ) : error ? (
              <div className="p-8 text-center text-matrix-red text-[14px]">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['User', 'Email', 'Company', 'Role', 'Joined', 'Last Sign-in'].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-[10.5px] tracking-[.18em] uppercase text-matrix-muted font-semibold bg-matrix-off border-b border-matrix-border">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id} className="border-t border-matrix-border hover:bg-matrix-off">
                        {/* Avatar + name */}
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-barlow font-bold text-[12px] text-white shrink-0"
                              style={{ background: u.role === 'admin' ? '#1B6FCC' : '#2A2F3A' }}
                            >
                              {getInitials(u.full_name, u.email)}
                            </div>
                            <div>
                              <div className="font-medium text-matrix-ink leading-tight">
                                {u.full_name ?? <span className="text-matrix-muted italic">No name</span>}
                              </div>
                              {u.phone && (
                                <div className="font-mono text-[11px] text-matrix-muted mt-0.5">{u.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-6 py-3">
                          <span className="font-mono text-[12px] text-matrix-ink">{u.email}</span>
                        </td>
                        {/* Company */}
                        <td className="px-6 py-3 text-matrix-muted text-[13px]">
                          {u.company ?? '—'}
                        </td>
                        {/* Role */}
                        <td className="px-6 py-3">
                          <span
                            className="inline-block font-mono text-[10.5px] px-2 py-1 uppercase tracking-widest rounded-xs"
                            style={{
                              background: u.role === 'admin' ? 'rgba(27,111,204,.10)' : 'rgba(100,116,139,.09)',
                              color: u.role === 'admin' ? '#1B6FCC' : '#64748B',
                              border: `1px solid ${u.role === 'admin' ? 'rgba(27,111,204,.25)' : '#E2E8F0'}`,
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        {/* Joined */}
                        <td className="px-6 py-3 font-mono text-[12px] text-matrix-muted whitespace-nowrap">
                          {formatDate(u.created_at)}
                        </td>
                        {/* Last sign-in */}
                        <td className="px-6 py-3 font-mono text-[12px] text-matrix-muted whitespace-nowrap">
                          {formatDate(u.last_sign_in_at)}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-matrix-muted text-[14px]">
                          {search || roleFilter !== 'all' ? 'No users match your filter.' : 'No registered users yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer note */}
            {!loading && !error && users.length > 0 && (
              <div className="px-6 py-3 border-t border-matrix-border bg-matrix-off text-[11.5px] text-matrix-muted font-dm">
                To change a user&apos;s role to admin, run the SQL command in Supabase:&nbsp;
                <code className="font-mono bg-white px-1 py-0.5 rounded border border-matrix-border text-[11px]">
                  UPDATE profiles SET role = &apos;admin&apos; WHERE id = &apos;&lt;user-id&gt;&apos;;
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
