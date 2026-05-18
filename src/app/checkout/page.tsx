'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

type Course = {
  id: string
  title: string
  slug: string
  price: number
  level: string
  duration_hours: number
  format: string
  language: string
}

const schema = z.object({
  accountName: z.string().min(2, 'Required'),
  bankName: z.string().min(2, 'Required'),
  reference: z.string().min(4, 'Enter your transfer reference number'),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const BANK_DETAILS = {
  bank: 'Bank of Beirut',
  account: 'Matrix Energy & Automation sarl',
  iban: 'LB62 0999 0000 0001 0019 2556 2007',
  currency: 'USD',
  branch: 'Khaldeh Branch',
}

const fieldStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #E2E8F0',
  borderRadius: '2px',
  fontSize: '14px',
  color: '#1F2330',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
}

function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseSlug = searchParams.get('course')
  const { user, loading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!courseSlug) return
    const supabase = createClient()
    supabase
      .from('courses')
      .select('id, title, slug, price, level, duration_hours, format, language')
      .eq('slug', courseSlug)
      .single()
      .then(({ data }) => {
        if (data) setCourse(data)
        setLoading(false)
      })
  }, [courseSlug])

  const onSubmit = async (formData: FormData) => {
    if (!user || !course) return
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { error: enrollError } = await supabase.from('enrollments').upsert({
      user_id: user.id,
      course_id: course.id,
      status: 'pending_payment',
      payment_method: 'bank_transfer',
      payment_reference: formData.reference,
      amount_paid: course.price,
    }, { onConflict: 'user_id,course_id' })

    if (enrollError) {
      setError(enrollError.message)
      setSubmitting(false)
      return
    }

    // Notify admin via API
    await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: user.email,
        courseTitle: course.title,
        coursePrice: course.price,
        reference: formData.reference,
        accountName: formData.accountName,
        bankName: formData.bankName,
        notes: formData.notes,
      }),
    })

    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-[#F8F9FB] min-h-[calc(100vh-108px)] flex items-center justify-center p-6">
        <div
          className="text-center max-w-[520px] mx-auto"
          style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '2px', padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(34,197,94,.1)', borderRadius: '2px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" width="32" height="32">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-barlow font-bold uppercase text-[36px] mb-3 text-[#1F2330]">Enrollment Submitted</h2>
          <p className="text-[#64748B] text-[15px] leading-relaxed mb-8">
            Your enrollment request has been received. Our team will verify your bank transfer and confirm your access within <strong>24 hours</strong>.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center gap-2 font-dm font-semibold uppercase text-[13px] px-[22px] py-[12px] tracking-[.04em]"
              style={{ background: '#1B6FCC', color: '#fff', borderRadius: '2px' }}
            >
              My Dashboard
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 font-dm font-semibold uppercase text-[13px] px-[22px] py-[12px] tracking-[.04em]"
              style={{ border: '1px solid #1B6FCC', color: '#1B6FCC', borderRadius: '2px' }}
            >
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading || authLoading) {
    return (
      <div className="bg-[#F8F9FB] min-h-[calc(100vh-108px)] flex items-center justify-center">
        <div className="font-mono text-[#64748B] text-[13px] tracking-[.1em]">LOADING…</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="bg-[#F8F9FB] min-h-[calc(100vh-108px)] flex items-center justify-center">
        <div className="text-center">
          <div className="font-barlow font-bold uppercase text-[28px] mb-3 text-[#1F2330]">Course Not Found</div>
          <Link href="/courses" className="text-[#1B6FCC] font-semibold">Browse Courses →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F8F9FB] min-h-[calc(100vh-108px)] py-12 pb-20">
      <div className="max-w-[1120px] mx-auto px-8 max-[640px]:px-5">
        {/* Breadcrumb */}
        <div className="font-mono text-[11px] tracking-[.1em] text-[#64748B] mb-8 uppercase">
          <Link href="/" className="hover:text-[#1B6FCC]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/courses" className="hover:text-[#1B6FCC]">Courses</Link>
          <span className="mx-2">›</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-[#1B6FCC]">{course.title}</Link>
          <span className="mx-2">›</span>
          <span className="text-[#1F2330]">Checkout</span>
        </div>

        <div className="grid max-[768px]:grid-cols-1 gap-8" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
          {/* Order Summary */}
          <div>
            <div className="bg-white border border-[#E2E8F0] rounded-[2px] p-6" style={{ borderTop: '3px solid #1B6FCC' }}>
              <h2 className="font-barlow font-bold uppercase text-[22px] text-[#1F2330] mb-6">Order Summary</h2>
              <div className="pb-5 mb-5 border-b border-[#E2E8F0]">
                <h3 className="font-barlow font-bold uppercase text-[18px] text-[#1F2330] mb-2">{course.title}</h3>
                <div className="flex gap-4 flex-wrap">
                  <span className="font-mono text-[11px] text-[#64748B] uppercase tracking-[.1em]">{course.level}</span>
                  <span className="font-mono text-[11px] text-[#64748B]">{course.duration_hours}h</span>
                  <span className="font-mono text-[11px] text-[#64748B]">{course.format}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2 text-[14px] text-[#64748B]">
                <span>Course fee</span>
                <span className="font-mono">${course.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-[16px] text-[#1F2330] pt-3 border-t border-[#E2E8F0]">
                <span>Total</span>
                <span className="font-mono text-[24px]">${course.price.toFixed(2)}</span>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
                <div className="font-semibold text-[13px] uppercase tracking-[.08em] text-[#1F2330] mb-3">What&apos;s Included</div>
                {[
                  `${course.duration_hours} hours of instruction`,
                  'Hands-on lab sessions',
                  'Course materials & notes',
                  'Matrix EA certificate',
                  'WhatsApp support group access',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[13.5px] text-[#64748B] mb-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" width="14" height="14" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp alternative */}
            <div className="mt-4 p-4 text-center" style={{ background: 'rgba(37,211,102,.06)', border: '1px solid rgba(37,211,102,.2)', borderRadius: '2px' }}>
              <div className="text-[13px] text-[#64748B] mb-2">Prefer to enroll via WhatsApp?</div>
              <a
                href={`https://wa.me/96171483747?text=Hi%2C%20I'd%20like%20to%20enroll%20in%20${encodeURIComponent(course.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-dm font-semibold uppercase text-[12.5px] px-[18px] py-[10px] tracking-[.04em]"
                style={{ background: '#25D366', color: '#fff', borderRadius: '2px' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.524 5.84L0 24l6.337-1.502A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 0 1-5.006-1.37l-.36-.213-3.76.891.938-3.66-.233-.375A9.79 9.79 0 0 1 2.182 12c0-5.418 4.4-9.818 9.818-9.818 5.418 0 9.818 4.4 9.818 9.818 0 5.418-4.4 9.818-9.818 9.818z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <div className="bg-white border border-[#E2E8F0] rounded-[2px] p-6">
              <h2 className="font-barlow font-bold uppercase text-[22px] text-[#1F2330] mb-2">Bank Transfer Payment</h2>
              <p className="text-[#64748B] text-[13.5px] mb-6">Transfer the course fee to our bank account, then submit your confirmation below.</p>

              {/* Bank details card */}
              <div className="mb-6 p-5" style={{ background: '#F8F9FB', border: '1px solid #E2E8F0', borderRadius: '2px', borderLeft: '3px solid #1B6FCC' }}>
                <div className="font-mono text-[11px] tracking-[.18em] uppercase text-[#64748B] mb-3">Bank Details</div>
                {Object.entries(BANK_DETAILS).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-1.5 border-b border-[#E2E8F0] last:border-0">
                    <span className="text-[12.5px] text-[#64748B] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono text-[12.5px] text-[#1F2330] font-medium">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 mt-1">
                  <span className="text-[12.5px] text-[#64748B]">Amount</span>
                  <span className="font-mono text-[16px] text-[#1B6FCC] font-medium">${course.price.toFixed(2)} USD</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-[#64748B]">
                    Account Holder Name
                  </label>
                  <input type="text" {...register('accountName')} placeholder="Name on bank account" style={fieldStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = errors.accountName ? '#DC2626' : '#E2E8F0')} />
                  {errors.accountName && <p className="text-[#DC2626] text-[12px] mt-1">{errors.accountName.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-[#64748B]">
                    Your Bank Name
                  </label>
                  <input type="text" {...register('bankName')} placeholder="e.g. Byblos Bank, BLF, Fransabank" style={fieldStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = errors.bankName ? '#DC2626' : '#E2E8F0')} />
                  {errors.bankName && <p className="text-[#DC2626] text-[12px] mt-1">{errors.bankName.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-[#64748B]">
                    Transfer Reference Number *
                  </label>
                  <input type="text" {...register('reference')} placeholder="Bank transfer reference / transaction ID" style={fieldStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = errors.reference ? '#DC2626' : '#E2E8F0')} />
                  {errors.reference && <p className="text-[#DC2626] text-[12px] mt-1">{errors.reference.message}</p>}
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-[#64748B]">
                    Notes (optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Any additional information for our team"
                    style={{ ...fieldStyle, resize: 'vertical' }}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 text-[#DC2626] text-[13.5px]"
                    style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', borderRadius: '2px' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 font-dm font-semibold uppercase text-[13.5px] py-[16px] tracking-[.04em]"
                  style={{
                    background: submitting ? '#64748B' : '#1B6FCC',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'background .15s',
                  }}
                >
                  {submitting ? 'Submitting…' : `Submit Enrollment — $${course.price}`}
                </button>

                <p className="text-center text-[12.5px] text-[#64748B] mt-4">
                  Our team confirms within 24 hours. Questions?{' '}
                  <a href="https://wa.me/96171483747" className="text-[#1B6FCC] font-semibold">WhatsApp us</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPageWrapper() {
  return <Suspense><CheckoutPage /></Suspense>
}
