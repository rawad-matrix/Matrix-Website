import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Always fetch fresh — reflects admin edits immediately
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type Module = {
  number?: string
  n?: string
  title: string
  description?: string
  desc?: string
}

type CourseRow = {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  level: string
  duration_hours: number
  price: number
  format: string | null
  language: string | null
  cohort_size: string | null
  certificate: string | null
  modules: Module[]
  outcomes: string[]
  prerequisites: string | null
  category: string | null
  featured_image: string | null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('courses').select('title, short_description').eq('slug', slug).single()
  return {
    title: data?.title ?? 'Course',
    description: data?.short_description ?? undefined,
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: c } = await supabase
    .from('courses')
    .select('id, title, slug, short_description, description, level, duration_hours, price, format, language, cohort_size, certificate, modules, outcomes, prerequisites, category, featured_image')
    .eq('slug', slug)
    .eq('is_published', true)
    .single() as { data: CourseRow | null }

  if (!c) notFound()

  const enrollHref = `/auth/sign-in?redirect=/checkout?course=${slug}`

  // Normalise modules from either seed format {number,title,description} or legacy {n,title,desc}
  const modules: { n: string; title: string; desc: string }[] = (c.modules ?? []).map((m) => ({
    n: m.number ?? m.n ?? '',
    title: m.title,
    desc: m.description ?? m.desc ?? '',
  }))

  const outcomes: string[] = Array.isArray(c.outcomes) ? c.outcomes : []
  const displayLevel = c.level === 'All' ? 'Bundle' : c.level

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-matrix-off border-b border-matrix-border py-3.5">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <nav className="flex gap-2.5 items-center text-[12px] uppercase tracking-[0.18em] text-matrix-muted font-dm font-medium">
            <Link href="/" className="text-matrix-ink hover:text-matrix-blue transition-colors">Home</Link>
            <span className="opacity-50">›</span>
            <Link href="/courses" className="text-matrix-ink hover:text-matrix-blue transition-colors">Courses</Link>
            <span className="opacity-50">›</span>
            <span className="text-matrix-blue">{c.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Course hero — title + description, full width ───────────────── */}
      <section className="relative overflow-hidden py-16 pb-20" style={{ background: '#2A2F3A', color: '#fff' }}>
        {/* Blurred background image if present */}
        {c.featured_image && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${c.featured_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.12,
              filter: 'blur(2px)',
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg,rgba(27,111,204,.12) 0%,transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(27,111,204,.10) 0%,transparent 50%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 max-[640px]:px-5">
          {/* Level + duration chip */}
          <span
            className="inline-block font-mono text-[11px] uppercase tracking-[0.22em] px-3 py-1.25 rounded-xs mb-5 text-matrix-blue"
            style={{ border: '1px solid #1B6FCC' }}
          >
            {displayLevel} · {c.duration_hours} hours
          </span>

          {/* Title */}
          <h1
            className="font-barlow font-extrabold uppercase text-white mb-5 max-w-225"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: '0.98' }}
          >
            {c.title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-matrix-blue">{c.title.split(' ').slice(-1)}</span>
          </h1>

          {/* Description */}
          <p
            className="font-dm text-[17px] leading-[1.65] max-w-175"
            style={{ color: 'rgba(255,255,255,.78)' }}
          >
            {c.description ?? c.short_description ?? ''}
          </p>
        </div>
      </section>

      {/* ── Course body ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5 grid grid-cols-[1.5fr_1fr] gap-14 items-start max-[900px]:grid-cols-1">

          {/* Left col: Modules */}
          <div>
            {modules.length > 0 && (
              <>
                <h2 className="font-barlow font-bold text-[28px] uppercase text-matrix-ink mb-5">Course Modules</h2>
                <ul
                  className="list-none p-0 m-0 grid overflow-hidden rounded-xs"
                  style={{ gridTemplateColumns: '1fr 1fr', background: '#E2E8F0', border: '1px solid #E2E8F0', gap: '1px' }}
                >
                  {modules.map(({ n, title: mtitle, desc }) => (
                    <li key={n} className="bg-white p-[18px_20px] flex gap-3.5 text-[14px] text-matrix-ink">
                      <span className="font-mono text-matrix-blue font-medium shrink-0 text-[13px]">{n}</span>
                      <div>
                        <b className="block font-semibold mb-0.5">{mtitle}</b>
                        <span className="text-matrix-muted text-[13px] leading-normal">{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Right col: Details card + Outcomes (sticky) */}
          <aside className="flex flex-col gap-5 sticky top-30 max-[900px]:static">

            {/* ── Details / enrollment card ──────────────────────────────── */}
            <div
              className="rounded-xs p-6"
              style={{ background: '#2A2F3A', border: '1px solid rgba(255,178,0,.25)' }}
            >
              {[
                { l: 'Level',       v: displayLevel },
                { l: 'Duration',    v: `${c.duration_hours} hours` },
                { l: 'Format',      v: c.format      ?? 'In-person + lab' },
                { l: 'Cohort',      v: c.cohort_size ?? '8–14 trainees' },
                { l: 'Language',    v: c.language    ?? 'English / Arabic' },
                { l: 'Certificate', v: c.certificate ?? 'Matrix EA' },
              ].map(({ l, v }) => (
                <div
                  key={l}
                  className="flex justify-between py-3 text-[13.5px]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}
                >
                  <span
                    className="font-dm uppercase tracking-widest text-[11px] font-medium"
                    style={{ color: 'rgba(255,255,255,.55)' }}
                  >
                    {l}
                  </span>
                  <span className="font-mono" style={{ color: '#1B6FCC' }}>{v}</span>
                </div>
              ))}

              {/* CTA buttons */}
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href={enrollHref}
                  className="block w-full text-center bg-matrix-blue text-white py-4 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
                >
                  Enroll Now
                </Link>
                <a
                  href={`https://wa.me/96178800274?text=${encodeURIComponent(`Hi Matrix — I'd like to enquire about the ${c.title} course.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-center bg-matrix-wa text-white py-3.5 font-dm font-semibold text-[12.5px] uppercase tracking-[0.04em] rounded-xs hover:brightness-110 hover:-translate-y-px transition-all duration-150"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6c.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3 2.1 3.2 5 4.4c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4c-.1-.2-.3-.3-.6-.5zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* ── You Will Learn To + Prerequisites ─────────────────────── */}
            {(outcomes.length > 0 || c.prerequisites) && (
              <div
                className="rounded-xs p-7"
                style={{ background: '#F8F9FB', border: '1px solid #E2E8F0', borderTop: '4px solid #1B6FCC' }}
              >
                {outcomes.length > 0 && (
                  <>
                    <h3 className="font-barlow font-bold text-[18px] uppercase text-matrix-ink mb-4">
                      You Will Learn To
                    </h3>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2.5 mb-5">
                      {outcomes.map((o, i) => (
                        <li key={i} className="flex gap-2.5 items-start font-dm text-[14px] text-matrix-ink">
                          <span className="text-matrix-blue font-bold shrink-0 mt-px">✓</span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {c.prerequisites && (
                  <div
                    className="font-dm text-[13.5px] text-matrix-muted leading-[1.7]"
                    style={outcomes.length > 0 ? { borderTop: '1px solid #E2E8F0', paddingTop: '14px' } : {}}
                  >
                    <b className="text-matrix-ink font-semibold text-[11px] uppercase tracking-[0.18em] block mb-1.5">
                      Prerequisites
                    </b>
                    {c.prerequisites}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
