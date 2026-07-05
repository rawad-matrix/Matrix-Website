'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
const labelCls = 'block font-dm text-[13px] font-semibold text-[#1F2330] mb-[6px] uppercase tracking-[0.06em]'

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

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

  if (sent) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,.12)] grid place-items-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="font-barlow font-bold text-[26px] uppercase text-[#1F2330] mb-2">Message Sent!</h3>
        <p className="font-dm text-[15px] text-[#64748B]">We'll respond within 24 hours.</p>
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
      <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
        <div>
          <label className={labelCls}>Name *</label>
          <input {...register('name')} placeholder="Your full name" className={inputCls} />
          {errors.name && <span className="text-[12px] text-[#DC2626] mt-1 block">{errors.name.message}</span>}
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input {...register('company')} placeholder="Company name" className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
        <div>
          <label className={labelCls}>Subject *</label>
          <input {...register('subject')} placeholder="e.g. SCADA system upgrade" className={inputCls} />
          {errors.subject && <span className="text-[12px] text-[#DC2626] mt-1 block">{errors.subject.message}</span>}
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input {...register('phone')} placeholder="+961 xx xxx xxx" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <input {...register('email')} type="email" placeholder="your@email.com" className={inputCls} />
        {errors.email && <span className="text-[12px] text-[#DC2626] mt-1 block">{errors.email.message}</span>}
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
