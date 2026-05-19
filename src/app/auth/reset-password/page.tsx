'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts the session from the reset link into the URL hash
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/auth/sign-in'), 2500)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 108px)' }} className="grid grid-cols-1 md:grid-cols-2">
      <aside
        className="relative overflow-hidden flex flex-col justify-between px-16 py-20 max-md:px-8 max-md:py-12"
        style={{ background: '#2A2F3A', color: '#fff' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(rgba(27,111,204,.05) 1px, transparent 1px) 0 0/40px 40px,
              linear-gradient(90deg, rgba(27,111,204,.05) 1px, transparent 1px) 0 0/40px 40px,
              radial-gradient(ellipse at 80% 20%, rgba(27,111,204,.18) 0%, transparent 50%)
            `,
          }}
        />
        <div className="relative z-10">
          <span
            className="inline-flex items-center gap-2 mb-6"
            style={{
              background: 'rgba(27,111,204,.12)',
              border: '1px solid rgba(27,111,204,.35)',
              color: '#1B6FCC',
              padding: '8px 14px',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              borderRadius: '2px',
            }}
          >
            Account Recovery
          </span>
          <h2 className="font-barlow font-bold uppercase leading-none mb-4" style={{ fontSize: '48px' }}>
            Set a New<br />
            <span style={{ color: '#1B6FCC' }}>Password.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '16px', lineHeight: 1.6, maxWidth: '380px' }}>
            Choose a strong password with at least 6 characters.
          </p>
        </div>
        <span className="relative z-10 font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '.08em' }}>
          MATRIX EA · v2.4.1 · secure session
        </span>
      </aside>

      <main className="flex flex-col justify-center px-16 py-20 bg-white max-md:px-6 max-md:py-12">
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-6" style={{ background: 'rgba(34,197,94,.1)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" width="32" height="32">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-barlow font-bold uppercase text-[36px] mb-3" style={{ color: '#1F2330' }}>Password Updated</h1>
              <p style={{ color: '#64748B', fontSize: '14.5px' }}>Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h1 className="font-barlow font-bold uppercase text-[42px] mb-2" style={{ color: '#1F2330' }}>New Password</h1>
              <p className="mb-8" style={{ color: '#64748B', fontSize: '14.5px' }}>Enter and confirm your new password below.</p>

              {!ready && (
                <div className="mb-6 px-4 py-3" style={{ background: 'rgba(255,178,0,.08)', border: '1px solid rgba(255,178,0,.3)', borderRadius: '2px', color: '#B45309', fontSize: '13.5px' }}>
                  Verifying your reset link… If this takes too long, request a new one.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full font-dm"
                    style={{ padding: '14px 16px', border: '1px solid #E2E8F0', borderRadius: '2px', fontSize: '14.5px', color: '#1F2330', outline: 'none' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full font-dm"
                    style={{ padding: '14px 16px', border: '1px solid #E2E8F0', borderRadius: '2px', fontSize: '14.5px', color: '#1F2330', outline: 'none' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3" style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', borderRadius: '2px', color: '#DC2626', fontSize: '13.5px' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !ready}
                  className="w-full flex items-center justify-center gap-2 font-dm font-semibold uppercase"
                  style={{
                    padding: '16px',
                    background: loading || !ready ? '#64748B' : '#1B6FCC',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '13.5px',
                    letterSpacing: '.04em',
                    cursor: loading || !ready ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Updating…' : 'Update Password'}
                </button>

                <p className="text-center mt-6" style={{ fontSize: '13.5px', color: '#64748B' }}>
                  <Link href="/auth/sign-in" style={{ color: '#1B6FCC', fontWeight: 600 }}>← Back to Sign In</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ResetPasswordPageWrapper() {
  return <Suspense><ResetPasswordPage /></Suspense>
}
