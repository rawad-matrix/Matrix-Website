'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Turnstile, TURNSTILE_ENABLED } from '@/components/ui/Turnstile'

interface SignInModalProps {
  open: boolean
  onClose: () => void
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) { setCaptchaToken(''); return }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (TURNSTILE_ENABLED && !captchaToken) {
      setError('Please complete the verification.')
      return
    }
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: captchaToken || undefined },
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      onClose()
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative w-full bg-white rounded-xs shadow-2xl"
        style={{ maxWidth: '420px', padding: '44px 40px 36px' }}
      >
        {/* X button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-matrix-muted hover:text-matrix-ink transition-colors rounded-xs"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Image
              src="/images/logo.jpg"
              alt="Matrix Energy & Automation"
              width={180}
              height={60}
              style={{ objectFit: 'contain', height: '52px', width: 'auto' }}
              priority
            />
          </div>
          <h2
            className="font-barlow font-extrabold uppercase text-matrix-ink m-0"
            style={{ fontSize: '32px', letterSpacing: '0.01em' }}
          >
            Sign In
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-dm text-[13px] font-medium text-matrix-ink">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-matrix-border rounded-xs px-4 py-3 font-dm text-[14px] text-matrix-ink outline-none focus:border-matrix-blue transition-colors placeholder:text-[#94A3B8]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-dm text-[13px] font-medium text-matrix-ink">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-matrix-border rounded-xs px-4 py-3 font-dm text-[14px] text-matrix-ink outline-none focus:border-matrix-blue transition-colors placeholder:text-[#94A3B8]"
            />
          </div>

          {error && (
            <p className="font-dm text-[13px] text-matrix-red bg-[#FEF2F2] border border-[#FECACA] rounded-xs px-4 py-3 m-0">
              {error}
            </p>
          )}

          <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-matrix-blue text-white py-3.5 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center font-dm text-[13px] text-matrix-muted mt-5 mb-0">
          <Link href="/auth/sign-in" onClick={onClose} className="text-matrix-blue hover:underline">
            Forgot password?
          </Link>
        </p>

        <div className="my-5 border-t border-matrix-border" />

        <p className="text-center font-dm text-[13px] text-matrix-muted m-0">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" onClick={onClose} className="text-matrix-blue font-semibold hover:underline">
            Create Account →
          </Link>
        </p>
      </div>
    </div>
  )
}
