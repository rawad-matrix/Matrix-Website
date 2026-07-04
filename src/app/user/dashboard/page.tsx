'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

type Enrollment = {
  id: string
  status: string
  enrolled_at: string
  courses: {
    title: string
    slug: string
    level: string
    duration_hours: number
    price: number
  }
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner: '#22C55E',
  Intermediate: '#1B6FCC',
  Advanced: '#DC2626',
}

export default function UserDashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    const fetchData = async () => {
      const [{ data: enroll }, { data: prof }] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id, status, enrolled_at, courses(title, slug, level, duration_hours, price)')
          .eq('user_id', user.id)
          .order('enrolled_at', { ascending: false }),
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      ])
      if (enroll) setEnrollments(enroll as unknown as Enrollment[])
      if (prof) setProfile(prof)
      setLoading(false)
    }

    fetchData()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="bg-[#F8F9FB] min-h-screen py-12 pb-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="h-10 bg-[#E2E8F0] rounded w-64 mb-8 animate-pulse" />
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-[2px] h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student'
  const activeEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'completed')

  return (
    <div className="bg-[#F8F9FB] min-h-screen py-12 pb-20">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">

        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            <h1 className="font-barlow font-bold uppercase text-[42px] text-[#1F2330] leading-none">
              Hello, {displayName}
            </h1>
            <p className="text-[#64748B] text-[15px] mt-2">
              {activeEnrollments.length} enrolled course{activeEnrollments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={signOut}
            className="font-dm font-semibold uppercase text-[12px] px-[18px] py-[10px] text-[#1F2330]"
            style={{ background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '2px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-barlow font-bold uppercase text-[28px] text-[#1F2330] mb-3">No Courses Yet</div>
            <p className="text-[#64748B] mb-8">Browse our catalog and enroll in your first course.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 font-dm font-semibold uppercase text-[13.5px] px-[22px] py-[12px] tracking-[.04em]"
              style={{ background: '#1B6FCC', color: '#fff', borderRadius: '2px' }}
            >
              Browse Courses →
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-barlow font-bold uppercase text-[24px] text-[#1F2330] mb-5">My Courses</h2>
            <div className="grid grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 gap-6 mb-12">
              {enrollments.map((enrollment) => {
                const course = enrollment.courses
                if (!course) return null
                const isActive = enrollment.status === 'active'
                const isPending = enrollment.status === 'pending_payment' || enrollment.status === 'pending'

                return (
                  <div
                    key={enrollment.id}
                    className="bg-white border border-[#E2E8F0] rounded-[2px] overflow-hidden"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}
                  >
                    {/* Card top */}
                    <div className="p-6 pb-4" style={{ borderTop: '3px solid #1B6FCC' }}>
                      <span
                        className="inline-block font-mono text-[10.5px] px-2 py-1 mb-3 uppercase tracking-[.1em]"
                        style={{
                          border: `1px solid ${LEVEL_COLORS[course.level] ?? '#1B6FCC'}`,
                          color: LEVEL_COLORS[course.level] ?? '#1B6FCC',
                          borderRadius: '2px',
                        }}
                      >
                        {course.level}
                      </span>
                      <h3 className="font-barlow font-bold uppercase text-[20px] text-[#1F2330] leading-tight mb-2">
                        {course.title}
                      </h3>
                      <div className="font-mono text-[12px] text-[#64748B]">{course.duration_hours}h · ${course.price}</div>
                    </div>

                    {/* Status & CTA */}
                    <div className="px-6 pb-6 pt-3 border-t border-[#E2E8F0]">
                      {isPending && (
                        <div
                          className="text-[12px] font-mono mb-3 px-3 py-2"
                          style={{ background: 'rgba(255,178,0,.08)', border: '1px solid rgba(255,178,0,.25)', color: '#B47700', borderRadius: '2px' }}
                        >
                          Enrollment pending · Our team will confirm shortly
                        </div>
                      )}
                      {isActive ? (
                        <Link
                          href={`/courses/${course.slug}`}
                          className="flex items-center justify-center gap-2 font-dm font-semibold uppercase text-[12.5px] py-[10px] tracking-[.04em]"
                          style={{ background: '#1B6FCC', color: '#fff', borderRadius: '2px' }}
                        >
                          Start Learning →
                        </Link>
                      ) : enrollment.status === 'completed' ? (
                        <div className="text-center font-mono text-[11px] text-[#22C55E] uppercase tracking-[.1em] py-2">
                          ✓ Completed
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 font-dm font-semibold uppercase text-[13.5px] px-[22px] py-[12px] tracking-[.04em]"
                style={{ background: 'transparent', color: '#1B6FCC', border: '1px solid #1B6FCC', borderRadius: '2px' }}
              >
                Browse More Courses →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
