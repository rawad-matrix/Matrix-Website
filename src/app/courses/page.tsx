'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHero } from '@/components/sections/PageHero'
import { ContactStrip } from '@/components/sections/ContactStrip'
import Link from 'next/link'

type Course = {
  slug: string
  title: string
  short_description: string | null
  level: string
  duration_hours: number
  price: number
  category: string | null
  featured_image: string | null
}

const LEVEL_COLOR: Record<string, string> = {
  Advanced: '#1B6FCC',
  Intermediate: '#22C55E',
  Beginner: '#64748B',
}

const CATEGORY_GRADIENT: Record<string, string> = {
  PLC:        'linear-gradient(160deg,#1a3a70 0%,#102050 90%)',
  SCADA:      'linear-gradient(160deg,#2a1a3a 0%,#1a1028 90%)',
  Electrical: 'linear-gradient(160deg,#2a3a1a 0%,#1a2a10 90%)',
  Energy:     'linear-gradient(160deg,#3a2a10 0%,#2a1a08 90%)',
  Drives:     'linear-gradient(160deg,#1a3a3a 0%,#102828 90%)',
}
const DEFAULT_GRADIENT = 'linear-gradient(160deg,#1a2a3a 0%,#0a1a28 90%)'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState('All')
  const [cat, setCat] = useState('All')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('courses')
      .select('slug, title, short_description, level, duration_hours, price, category, featured_image')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setCourses(data)
        setLoading(false)
      })
  }, [])

  const levels = ['All', ...Array.from(new Set(courses.map(c => c.level))).sort()]
  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category ?? 'Other'))).sort()]

  const filtered = courses.filter(c => {
    const matchLevel = level === 'All' || c.level === level
    const matchCat   = cat === 'All' || (c.category ?? 'Other') === cat
    return matchLevel && matchCat
  })

  return (
    <>
      <PageHero
        title="Training Courses"
        subtitle="Hands-on automation courses taught by working engineers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Courses' }]}
      />

      <section className="bg-matrix-off py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          {/* Filters */}
          {!loading && courses.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex flex-wrap gap-2">
                {levels.map(l => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`font-dm font-semibold text-[12px] uppercase tracking-[0.08em] px-4 py-2 rounded-xs transition-all duration-150 ${
                      level === l ? 'bg-matrix-blue text-white' : 'bg-white text-matrix-muted border border-matrix-border hover:border-matrix-blue hover:text-matrix-blue'
                    }`}>{l}
                  </button>
                ))}
              </div>
              {categories.length > 2 && <div className="w-px bg-matrix-border" />}
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button key={c} onClick={() => setCat(c)}
                      className={`font-dm font-semibold text-[12px] uppercase tracking-[0.08em] px-4 py-2 rounded-xs transition-all duration-150 ${
                        cat === c ? 'bg-matrix-blue text-white' : 'bg-white text-matrix-muted border border-matrix-border hover:border-matrix-blue hover:text-matrix-blue'
                      }`}>{c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-24 font-mono text-[13px] text-matrix-muted tracking-widest">
              LOADING COURSES…
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <span className="font-barlow font-bold text-[28px] uppercase text-matrix-muted">
                {courses.length === 0 ? 'No courses available yet.' : 'No courses match this filter.'}
              </span>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
              {filtered.map(course => {
                const gradient = CATEGORY_GRADIENT[course.category ?? ''] ?? DEFAULT_GRADIENT
                return (
                  <Link
                    key={course.slug}
                    href={`/courses/${course.slug}`}
                    className="group relative overflow-hidden rounded-xs flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,.18)]"
                    style={{ background: '#2A2F3A' }}
                  >
                    {/* Card top — image or gradient */}
                    <div className="h-30 overflow-hidden transition-transform duration-500 group-hover:scale-105 relative">
                      {course.featured_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.featured_image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `repeating-linear-gradient(110deg,rgba(255,255,255,.04) 0 2px,transparent 2px 14px),${gradient}`,
                          }}
                        />
                      )}
                    </div>

                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <span
                        className="inline-block font-mono text-[10.5px] uppercase tracking-[0.12em] px-2 py-0.75 rounded-xs self-start"
                        style={{ border: `1px solid ${LEVEL_COLOR[course.level] ?? '#64748B'}`, color: LEVEL_COLOR[course.level] ?? '#64748B' }}
                      >
                        {course.level}
                      </span>
                      <h3 className="font-barlow font-bold text-[22px] uppercase text-white leading-[1.1]">{course.title}</h3>
                      <p className="font-dm text-[14px] text-white/65 leading-[1.6] flex-1">
                        {course.short_description ?? ''}
                      </p>
                      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-white/50">{course.duration_hours}h</span>
                          {course.category && <span className="font-mono text-[11px] text-white/50">{course.category}</span>}
                        </div>
                        <span className="font-mono text-[18px] text-matrix-blue font-medium">${course.price}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
