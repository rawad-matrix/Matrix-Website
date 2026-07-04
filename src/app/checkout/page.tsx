'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

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

function EnrollPage() {
  const searchParams = useSearchParams()
  const courseSlug = searchParams.get('course')
  const { user, loading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!courseSlug) { setLoading(false); return }
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
    // Self-service enrollments are created as 'pending'; an admin confirms them.
    const { error: enrollError } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: course.id,
      status: 'pending',
    })

    if (enrollError) {
      // Unique violation → student already requested this course.
      if (enrollError.code === '23505') {
        setAlreadyEnrolled(true)
        setSubmitting(false)
        return
      }
      setError(enrollError.message)
      setSubmitting(false)
      return
    }

    // Notify admin (best-effort — never blocks the student).
    await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: user.email,
        courseTitle: course.title,
        notes: formData.notes,
      }),
    })

    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted || alreadyEnrolled) {
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
          <h2 className="font-barlow font-bold uppercase text-[36px] mb-3 text-[#1F2330]">
            {alreadyEnrolled ? 'Already Requested' : 'Enrollment Requested'}
          </h2>
          <p className="text-[#64748B] text-[15px] leading-relaxed mb-8">
            {alreadyEnrolled
              ? 'You have already requested this course. Our team will be in touch to confirm the details.'
              : 'Your enrollment request has been recorded. Our team will contact you to confirm the schedule and details.'}
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
      <div className="max-w-[760px] mx-auto px-8 max-[640px]:px-5">
        {/* Breadcrumb */}
        <div className="font-mono text-[11px] tracking-[.1em] text-[#64748B] mb-8 uppercase">
          <Link href="/" className="hover:text-[#1B6FCC]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/courses" className="hover:text-[#1B6FCC]">Courses</Link>
          <span className="mx-2">›</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-[#1B6FCC]">{course.title}</Link>
          <span className="mx-2">›</span>
          <span className="text-[#1F2330]">Enroll</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[2px] p-8 max-[640px]:p-6" style={{ borderTop: '3px solid #1B6FCC' }}>
          <h1 className="font-barlow font-bold uppercase text-[28px] text-[#1F2330] mb-2">Confirm Your Enrollment</h1>
          <p className="text-[#64748B] text-[14px] mb-6">
            Submitting this request notifies our team that you would like to join this course. There is no online payment —
            our team will contact you to confirm the schedule, fees, and next steps.
          </p>

          {/* Course summary */}
          <div className="mb-6 p-5" style={{ background: '#F8F9FB', border: '1px solid #E2E8F0', borderRadius: '2px', borderLeft: '3px solid #1B6FCC' }}>
            <h2 className="font-barlow font-bold uppercase text-[18px] text-[#1F2330] mb-2">{course.title}</h2>
            <div className="flex gap-4 flex-wrap">
              <span className="font-mono text-[11px] text-[#64748B] uppercase tracking-[.1em]">{course.level}</span>
              <span className="font-mono text-[11px] text-[#64748B]">{course.duration_hours}h</span>
              <span className="font-mono text-[11px] text-[#64748B]">{course.format}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-[#64748B]">
                Notes (optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Anything you'd like our team to know (preferred dates, questions, etc.)"
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
              {submitting ? 'Submitting…' : 'Submit Enrollment Request'}
            </button>

            <p className="text-center text-[12.5px] text-[#64748B] mt-4">
              Prefer to talk first?{' '}
              <a
                href={`https://wa.me/96178800274?text=Hi%2C%20I'd%20like%20to%20enroll%20in%20${encodeURIComponent(course.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B6FCC] font-semibold"
              >
                WhatsApp us
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function EnrollPageWrapper() {
  return <Suspense><EnrollPage /></Suspense>
}
