'use client'

import { useState } from 'react'
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

// ── Badge colour by level ────────────────────────────────────────────────────
const LEVEL_COLOR: Record<string, string> = {
  All:      '#8B5CF6',   // purple  — bundle courses
  Basic:    '#22C55E',   // green
  Pro:      '#1B6FCC',   // blue
  Advanced: '#DC2626',   // red
}

// ── Category-based card gradient when no image ───────────────────────────────
const CATEGORY_GRADIENT: Record<string, string> = {
  'Siemens PLC': 'linear-gradient(160deg,#1a3a70 0%,#102050 90%)',
  'Delta PLC':   'linear-gradient(160deg,#1a4a1a 0%,#0e300e 90%)',
  'SCADA':       'linear-gradient(160deg,#2a1a3a 0%,#1a1028 90%)',
  'Motion':      'linear-gradient(160deg,#3a2a0a 0%,#28190a 90%)',
  'Certification': 'linear-gradient(160deg,#2a1a0a 0%,#1a0e06 90%)',
  'IoT':         'linear-gradient(160deg,#0a2a3a 0%,#061928 90%)',
  'Electrical':  'linear-gradient(160deg,#2a3a1a 0%,#1a2a10 90%)',
  'Mechanical':  'linear-gradient(160deg,#3a1a1a 0%,#280e0e 90%)',
}
const DEFAULT_GRADIENT = 'linear-gradient(160deg,#1a2a3a 0%,#0a1a28 90%)'

// ── Filter definitions ────────────────────────────────────────────────────────
//   Levels filter by course.level; brand filters filter by slug/category.
const FILTERS = [
  { key: 'All',      label: 'All',      type: 'all'   },
  { key: 'Basic',    label: 'Basic',    type: 'level' },
  { key: 'Pro',      label: 'Pro',      type: 'level' },
  { key: 'Advanced', label: 'Advanced', type: 'level' },
  { key: 'Siemens',  label: 'Siemens',  type: 'brand' },
  { key: 'Delta',    label: 'Delta',    type: 'brand' },
  { key: 'IoT',      label: 'IoT',      type: 'brand' },
  { key: 'SCADA',    label: 'SCADA',    type: 'brand' },
] as const

function matchesCourse(course: Course, filter: string): boolean {
  if (filter === 'All') return true

  // Level filters — exact match on course.level
  if (filter === 'Basic' || filter === 'Pro' || filter === 'Advanced') {
    return course.level === filter
  }

  // Brand / topic filters
  if (filter === 'Siemens') {
    return (
      course.slug.startsWith('s7-') ||
      course.slug.startsWith('si-') ||
      course.slug.startsWith('scada-wincc') ||
      course.slug === 'pam-c' ||
      course.slug === 'par-c'
    )
  }
  if (filter === 'Delta') {
    return course.slug.startsWith('delta-')
  }
  if (filter === 'IoT') {
    return (course.category ?? '') === 'IoT'
  }
  if (filter === 'SCADA') {
    return (course.category ?? '') === 'SCADA'
  }

  return false
}

export default function CoursesClient({ courses }: { courses: Course[] }) {
  const [active, setActive] = useState('All')

  const filtered = courses.filter(c => matchesCourse(c, active))

  return (
    <section className="bg-matrix-off py-27.5 max-[768px]:py-18">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">

        {/* ── Filter bar ────────────────────────────────────────────────── */}
        {courses.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {FILTERS.map(f => {
              const isActive = active === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={`font-dm font-semibold text-[12px] uppercase tracking-[0.08em] px-4 py-2 rounded-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-matrix-blue text-white'
                      : 'bg-white text-matrix-muted border border-matrix-border hover:border-matrix-blue hover:text-matrix-blue'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Empty states ──────────────────────────────────────────────── */}
        {courses.length === 0 && (
          <div className="text-center py-24">
            <span className="font-barlow font-bold text-[28px] uppercase text-matrix-muted">
              No courses available yet.
            </span>
            <p className="font-dm text-[15px] text-matrix-muted mt-3">
              Check back soon — new courses are being added regularly.
            </p>
          </div>
        )}

        {courses.length > 0 && filtered.length === 0 && (
          <div className="text-center py-24">
            <span className="font-barlow font-bold text-[28px] uppercase text-matrix-muted">
              No courses match this filter.
            </span>
          </div>
        )}

        {/* ── Course grid ───────────────────────────────────────────────── */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
            {filtered.map(course => {
              const gradient = CATEGORY_GRADIENT[course.category ?? ''] ?? DEFAULT_GRADIENT
              const levelColor = LEVEL_COLOR[course.level] ?? '#64748B'
              return (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="group relative overflow-hidden rounded-xs flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,.18)]"
                  style={{ background: '#2A2F3A' }}
                >
                  {/* Card image / gradient top */}
                  <div className="h-40 overflow-hidden transition-transform duration-500 group-hover:scale-105 relative">
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
                    {/* Level badge */}
                    <span
                      className="inline-block font-mono text-[10.5px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-xs self-start"
                      style={{ border: `1px solid ${levelColor}`, color: levelColor }}
                    >
                      {course.level}
                    </span>

                    <h3 className="font-barlow font-bold text-[22px] uppercase text-white leading-[1.1]">
                      {course.title}
                    </h3>
                    <p className="font-dm text-[14px] text-white/65 leading-[1.6] flex-1">
                      {course.short_description ?? ''}
                    </p>

                    <div
                      className="flex items-center justify-between pt-3"
                      style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-white/50">{course.duration_hours}h</span>
                        {course.category && (
                          <span className="font-mono text-[11px] text-white/50">{course.category}</span>
                        )}
                      </div>
                      <span className="font-mono text-[18px] font-medium" style={{ color: levelColor }}>
                        {course.price > 0 ? `$${course.price}` : 'TBA'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
