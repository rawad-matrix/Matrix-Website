'use client'

import { useState } from 'react'
import { AdminSidebar } from '../page'

type SendResult = { sent: number; total: number; failed?: string[] }

export default function AnnouncementsPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [error, setError] = useState('')

  const canSend = subject.trim().length > 0 && message.trim().length > 0 && !loading

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send. Please try again.')
      } else {
        setResult(data)
        if (data.sent > 0) {
          setSubject('')
          setMessage('')
        }
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F4F6FA', minHeight: 'calc(100vh - 108px)' }}>
      <div
        className="max-w-[1280px] mx-auto px-6 py-10"
        style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}
      >
        <AdminSidebar />

        <main>
          <div className="mb-6">
            <h1 className="font-barlow font-bold uppercase text-[32px] text-matrix-ink">
              Announcements
            </h1>
            <p className="text-matrix-muted text-[14px] mt-1">
              Send an email announcement to all registered client accounts.
            </p>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
            {/* Compose form */}
            <div
              className="bg-white border border-matrix-border p-8"
              style={{ borderRadius: '2px' }}
            >
              <h2 className="font-barlow font-bold uppercase text-[20px] text-matrix-ink mb-6">
                Compose Message
              </h2>

              <form onSubmit={handleSend}>
                <div className="mb-5">
                  <label
                    className="block mb-2 font-dm font-semibold uppercase"
                    style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}
                  >
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. New PLC Training Courses Available"
                    required
                    className="w-full font-dm"
                    style={{
                      padding: '12px 14px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '2px',
                      fontSize: '14px',
                      color: '#1F2330',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-2 font-dm font-semibold uppercase"
                    style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}
                  >
                    Message Body
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your announcement here. Line breaks are preserved in the email."
                    required
                    rows={12}
                    className="w-full font-dm"
                    style={{
                      padding: '12px 14px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '2px',
                      fontSize: '14px',
                      color: '#1F2330',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>

                {error && (
                  <div
                    className="mb-4 px-4 py-3"
                    style={{
                      background: 'rgba(220,38,38,.08)',
                      border: '1px solid rgba(220,38,38,.25)',
                      borderRadius: '2px',
                      color: '#DC2626',
                      fontSize: '13.5px',
                    }}
                  >
                    {error}
                  </div>
                )}

                {result && (
                  <div
                    className="mb-4 px-4 py-3"
                    style={{
                      background: result.sent > 0 ? 'rgba(34,197,94,.08)' : 'rgba(255,178,0,.08)',
                      border: `1px solid ${result.sent > 0 ? 'rgba(34,197,94,.25)' : 'rgba(255,178,0,.3)'}`,
                      borderRadius: '2px',
                      color: result.sent > 0 ? '#16A34A' : '#B45309',
                      fontSize: '13.5px',
                    }}
                  >
                    {result.total === 0
                      ? 'No client accounts found to send to.'
                      : `Sent to ${result.sent} of ${result.total} recipients.${result.failed?.length ? ` ${result.failed.length} failed.` : ''}`
                    }
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSend}
                  className="flex items-center gap-2 font-dm font-semibold uppercase"
                  style={{
                    padding: '13px 28px',
                    background: canSend ? '#1B6FCC' : '#64748B',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '13px',
                    letterSpacing: '.04em',
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    transition: 'background .15s',
                  }}
                >
                  {loading ? 'Sending…' : 'Send to All Clients'}
                  {!loading && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </form>
            </div>

            {/* Info card */}
            <div
              className="bg-white border border-matrix-border p-6"
              style={{ borderRadius: '2px' }}
            >
              <h3 className="font-barlow font-bold uppercase text-[16px] text-matrix-ink mb-4">
                How It Works
              </h3>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="16" height="16">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                    text: 'Sent to all registered users except admin accounts.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="16" height="16">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    text: 'Sent from noreply@matrixea.co with your branding.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="16" height="16">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ),
                    text: 'Line breaks in your message are preserved in the email.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#FFB200" strokeWidth="2" width="16" height="16">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    ),
                    text: 'This sends immediately — double-check before clicking Send.',
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ fontSize: '13.5px', color: '#1F2330' }}>
                    <span style={{ flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
