'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'matrix_signin_modal_dismissed'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})
type FormData = z.infer<typeof schema>

export function SignInModal() {
  const [visible, setVisible] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return

    // Check auth — only show to guests (not signed-in users)
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) return   // user is signed in → never show
      const timer = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(timer)
    })
  }, [])

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

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
    dismiss()
    router.push('/dashboard')
    router.refresh()
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(27, 32, 42, 0.78)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        animation: 'fade-in .35s ease forwards',
        padding: '16px',
      }}
    >
      {/* Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          background: '#fff',
          borderRadius: '2px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.32)',
          animation: 'fade-in-up .38s ease forwards',
          overflow: 'hidden',
        }}
      >
        {/* Top accent stripe */}
        <div style={{ height: '3px', background: '#1B6FCC', width: '100%' }} />

        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748B',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px',
            transition: 'color .15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1F2330')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ padding: '28px 36px 36px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Image
              src="/images/logo.jpg"
              alt="Matrix Energy & Automation"
              width={180}
              height={60}
              style={{ objectFit: 'contain', height: '52px', width: 'auto' }}
              priority
            />
          </div>

          {/* Header */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-barlow-condensed, Barlow Condensed, sans-serif)',
                fontSize: '32px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#1F2330',
                lineHeight: 1,
                margin: 0,
              }}
            >
              Sign In
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontWeight: 600,
                  fontSize: '10.5px',
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: '#64748B',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                {...register('email')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `1px solid ${errors.email ? '#DC2626' : '#E2E8F0'}`,
                  borderRadius: '2px',
                  fontSize: '14px',
                  color: '#1F2330',
                  outline: 'none',
                  transition: 'border-color .15s',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                onBlur={(e) => (e.target.style.borderColor = errors.email ? '#DC2626' : '#E2E8F0')}
              />
              {errors.email && (
                <p style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '4px', fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  fontWeight: 600,
                  fontSize: '10.5px',
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: '#64748B',
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                {...register('password')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `1px solid ${errors.password ? '#DC2626' : '#E2E8F0'}`,
                  borderRadius: '2px',
                  fontSize: '14px',
                  color: '#1F2330',
                  outline: 'none',
                  transition: 'border-color .15s',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                onBlur={(e) => (e.target.style.borderColor = errors.password ? '#DC2626' : '#E2E8F0')}
              />
              {errors.password && (
                <p style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '4px', fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div
                style={{
                  marginBottom: '14px',
                  padding: '10px 14px',
                  background: 'rgba(220,38,38,.08)',
                  border: '1px solid rgba(220,38,38,.25)',
                  borderRadius: '2px',
                  color: '#DC2626',
                  fontSize: '13px',
                  fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                }}
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                background: loading ? '#64748B' : '#1B6FCC',
                color: '#fff',
                border: 'none',
                borderRadius: '2px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .15s',
                fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#155AA8' }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1B6FCC' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
              color: '#64748B',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span>
              No account?{' '}
              <Link
                href="/auth/register"
                onClick={dismiss}
                style={{ color: '#1B6FCC', fontWeight: 600, textDecoration: 'none' }}
              >
                Register →
              </Link>
            </span>
            <Link
              href="/auth/sign-in"
              onClick={dismiss}
              style={{ color: '#64748B', fontSize: '12px', textDecoration: 'none' }}
            >
              Full sign-in page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
