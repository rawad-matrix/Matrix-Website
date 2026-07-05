'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { safeRedirect } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = safeRedirect(searchParams.get('redirect'), '/dashboard')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div
      style={{ minHeight: 'calc(100vh - 108px)' }}
      className="grid grid-cols-1 md:grid-cols-2"
    >
      {/* Left aside */}
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
            Welcome Back
          </span>
          <h2
            className="font-barlow font-bold uppercase leading-none mb-4"
            style={{ fontSize: '48px' }}
          >
            Sign In to Your<br />
            <span style={{ color: '#1B6FCC' }}>Matrix Client.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '16px', lineHeight: 1.6, maxWidth: '380px' }}>
            Access your live dashboards, project documents, maintenance tickets, and on-call engineer chat — all from one place.
          </p>
          <ul className="mt-9 flex flex-col gap-3">
            {[
              'Real-time site monitoring',
              'Maintenance ticket history',
              'Document and BOM library',
              'Direct line to your project lead',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3" style={{ color: 'rgba(255,255,255,.78)', fontSize: '14px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="18" height="18" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <span
          className="relative z-10 font-mono"
          style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '.08em' }}
        >
          MATRIX EA · v2.4.1 · secure session
        </span>
      </aside>

      {/* Right form */}
      <main className="flex flex-col justify-center px-16 py-20 bg-white max-md:px-6 max-md:py-12">
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          <h1 className="font-barlow font-bold uppercase text-[42px] mb-2" style={{ color: '#1F2330' }}>
            Sign In
          </h1>
          <p className="mb-8" style={{ color: '#64748B', fontSize: '14.5px' }}>
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                className="block mb-2 font-dm font-semibold uppercase"
                style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                {...register('email')}
                className="w-full font-dm"
                style={{
                  padding: '14px 16px',
                  border: `1px solid ${errors.email ? '#DC2626' : '#E2E8F0'}`,
                  borderRadius: '2px',
                  fontSize: '14.5px',
                  color: '#1F2330',
                  outline: 'none',
                  transition: 'border-color .15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                onBlur={(e) => (e.target.style.borderColor = errors.email ? '#DC2626' : '#E2E8F0')}
              />
              {errors.email && (
                <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                className="block mb-2 font-dm font-semibold uppercase"
                style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                {...register('password')}
                className="w-full font-dm"
                style={{
                  padding: '14px 16px',
                  border: `1px solid ${errors.password ? '#DC2626' : '#E2E8F0'}`,
                  borderRadius: '2px',
                  fontSize: '14.5px',
                  color: '#1F2330',
                  outline: 'none',
                  transition: 'border-color .15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                onBlur={(e) => (e.target.style.borderColor = errors.password ? '#DC2626' : '#E2E8F0')}
              />
              {errors.password && (
                <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>
              )}
            </div>

            {/* Row: remember me + forgot */}
            <div className="flex justify-between items-center mb-6" style={{ fontSize: '13px' }}>
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#1F2330' }}>
                <input type="checkbox" style={{ accentColor: '#1B6FCC' }} />
                Remember me
              </label>
              <Link href="/auth/forgot-password" style={{ color: '#1B6FCC', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {serverError && (
              <div
                className="mb-4 px-4 py-3"
                style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', borderRadius: '2px', color: '#DC2626', fontSize: '13.5px' }}
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-dm font-semibold uppercase"
              style={{
                padding: '16px',
                background: loading ? '#64748B' : '#1B6FCC',
                color: '#fff',
                border: 'none',
                borderRadius: '2px',
                fontSize: '13.5px',
                letterSpacing: '.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .15s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>

            <p className="text-center mt-6" style={{ fontSize: '13.5px', color: '#64748B' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" style={{ color: '#1B6FCC', fontWeight: 600 }}>
                Create an account →
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function SignInPageWrapper() {
  return <Suspense><SignInPage /></Suspense>
}
