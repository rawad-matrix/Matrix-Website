'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface SignInModalProps {
  open: boolean
  onClose: () => void
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
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
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
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
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative w-full bg-white rounded-[2px] shadow-2xl"
        style={{ maxWidth: '420px', padding: '44px 40px 36px' }}
      >
        {/* X button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#1F2330] transition-colors rounded-[2px]"
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
            className="font-barlow font-extrabold uppercase text-[#1F2330] m-0"
            style={{ fontSize: '32px', letterSpacing: '0.01em' }}
          >
            Sign In
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-dm text-[13px] font-medium text-[#1F2330]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-[#E2E8F0] rounded-[2px] px-4 py-3 font-dm text-[14px] text-[#1F2330] outline-none focus:border-[#1B6FCC] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-dm text-[13px] font-medium text-[#1F2330]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-[#E2E8F0] rounded-[2px] px-4 py-3 font-dm text-[14px] text-[#1F2330] outline-none focus:border-[#1B6FCC] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>

          {error && (
            <p className="font-dm text-[13px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-[2px] px-4 py-3 m-0">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B6FCC] text-white py-[14px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] hover:-translate-y-px transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center font-dm text-[13px] text-[#64748B] mt-5 mb-0">
          <Link href="/auth/sign-in" onClick={onClose} className="text-[#1B6FCC] hover:underline">
            Forgot password?
          </Link>
        </p>

        <div className="my-5 border-t border-[#E2E8F0]" />

        <p className="text-center font-dm text-[13px] text-[#64748B] m-0">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" onClick={onClose} className="text-[#1B6FCC] font-semibold hover:underline">
            Create Account →
          </Link>
        </p>
      </div>
    </div>
  )
}
