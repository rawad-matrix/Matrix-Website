'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Turnstile, TURNSTILE_ENABLED } from '@/components/ui/Turnstile'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  phone: z.string().optional(),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  // Honeypot — must stay empty. Bots fill it; humans never see it.
  website: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const inputCls = 'w-full border border-[#E2E8F0] rounded-[2px] px-4 py-3 font-dm text-[14.5px] text-[#1F2330] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B6FCC] transition-colors bg-white'
const readonlyCls = 'w-full border border-[#E2E8F0] rounded-[2px] px-4 py-3 font-dm text-[14.5px] text-[#64748B] bg-[#F8F9FB] cursor-not-allowed'
const labelCls = 'block font-dm text-[13px] font-semibold text-[#1F2330] mb-[6px] uppercase tracking-[0.06em]'

export function ContactForm() {
  const { user, loading: authLoading } = useAuth()
  const [sent, setSent] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  // Prefill the signed-in user's details so they only write subject + message.
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('full_name, company, phone')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        reset({
          name: data?.full_name ?? '',
          email: user.email ?? '',
          company: data?.company ?? '',
          phone: data?.phone ?? '',
          subject: '',
          message: '',
        })
      })
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    if (TURNSTILE_ENABLED && !captchaToken) {
      setCaptchaError('Please complete the verification.')
      return
    }
    setCaptchaError('')
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, captchaToken }),
      })
      setSent(true)
    } catch {
      // fail silently — show success anyway
      setSent(true)
    }
  }

  // While auth state resolves.
  if (authLoading) {
    return (
      <div className="py-16 text-center font-mono text-[13px] tracking-[.1em] text-[#64748B]">LOADING…</div>
    )
  }

  // Require sign-in before allowing a message.
  if (!user) {
    return (
      <div
        className="text-center py-14 px-6"
        style={{ background: '#F8F9FB', border: '1px solid #E2E8F0', borderRadius: '2px', borderTop: '3px solid #1B6FCC' }}
      >
        <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(27,111,204,.1)', borderRadius: '2px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="26" height="26">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 className="font-barlow font-bold text-[24px] uppercase text-[#1F2330] mb-2">Sign In to Send a Message</h3>
        <p className="font-dm text-[14.5px] text-[#64748B] max-w-[420px] mx-auto mb-7">
          To contact our team, please sign in to your account. Once signed in, your details are filled in
          automatically — you just write your message.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/auth/sign-in?redirect=/contact"
            className="inline-flex items-center gap-2 font-dm font-semibold uppercase text-[13px] px-[22px] py-[12px] tracking-[.04em]"
            style={{ background: '#1B6FCC', color: '#fff', borderRadius: '2px' }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register?redirect=/contact"
            className="inline-flex items-center gap-2 font-dm font-semibold uppercase text-[13px] px-[22px] py-[12px] tracking-[.04em]"
            style={{ border: '1px solid #1B6FCC', color: '#1B6FCC', borderRadius: '2px' }}
          >
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,.12)] grid place-items-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="font-barlow font-bold text-[26px] uppercase text-[#1F2330] mb-2">Message Sent!</h3>
        <p className="font-dm text-[15px] text-[#64748B]">We&apos;ll respond within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Honeypot: hidden from users, catches bots. Kept out of tab order. */}
      <input
        {...register('website')}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />

      {/* Your details — prefilled from your account. Name & email are read-only. */}
      <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
        <div>
          <label className={labelCls}>Name</label>
          <input {...register('name')} readOnly className={readonlyCls} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input {...register('email')} readOnly className={readonlyCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
        <div>
          <label className={labelCls}>Company</label>
          <input {...register('company')} placeholder="Company name" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input {...register('phone')} placeholder="+961 xx xxx xxx" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Subject *</label>
        <input {...register('subject')} placeholder="e.g. SCADA system upgrade" className={inputCls} />
        {errors.subject && <span className="text-[12px] text-[#DC2626] mt-1 block">{errors.subject.message}</span>}
      </div>
      <div>
        <label className={labelCls}>Message *</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Tell us about your project..."
          className={`${inputCls} resize-none`}
        />
        {errors.message && <span className="text-[12px] text-[#DC2626] mt-1 block">{errors.message.message}</span>}
      </div>

      <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />
      {captchaError && <span className="text-[12px] text-[#DC2626] block">{captchaError}</span>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1B6FCC] text-white py-4 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] disabled:opacity-60 transition-all duration-150"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
