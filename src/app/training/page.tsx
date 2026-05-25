import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/sections/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ContactStrip } from '@/components/sections/ContactStrip'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Training' }

const TRACKS = [
  {
    n: '01',
    title: 'Academic Training',
    desc: 'Structured cohort-based courses with lab sessions, assessments and a Matrix EA certificate. Best for individuals and teams building foundational skills.',
    meta: [
      { k: 'Format', v: 'Classroom + Lab' },
      { k: 'Duration', v: '12–40 hours' },
      { k: 'Cohort', v: '8–14 trainees' },
      { k: 'Certificate', v: 'Matrix EA' },
    ],
    href: '/training',
  },
  {
    n: '02',
    title: 'On-the-Job Training',
    desc: 'Training delivered on your own plant floor, on your live equipment and your actual processes. No travel, no downtime — skills transfer immediately.',
    meta: [
      { k: 'Format', v: 'Site-based' },
      { k: 'Duration', v: 'Flexible' },
      { k: 'Equipment', v: 'Your system' },
      { k: 'Certificate', v: 'Matrix EA' },
    ],
    href: '/training',
    alt: true,
  },
  {
    n: '03',
    title: 'Hybrid Learning',
    desc: 'Self-paced online theory modules combined with scheduled intensive lab days. Maximum flexibility for working professionals.',
    meta: [
      { k: 'Format', v: 'Online + Lab' },
      { k: 'Duration', v: '3–8 weeks' },
      { k: 'Labs', v: 'Monthly intensive' },
      { k: 'Certificate', v: 'Matrix EA' },
    ],
    href: '/training',
  },
]

const COURSES = [
  { slug: 'siemens-tia-portal', num: '01', title: 'Siemens TIA Portal', level: 'Advanced', hours: 40, category: 'PLC' },
  { slug: 'delta-plc', num: '02', title: 'Delta PLC Programming', level: 'Intermediate', hours: 24, category: 'PLC' },
  { slug: 'eplan-electric-p8', num: '03', title: 'EPLAN Electric P8', level: 'Intermediate', hours: 32, category: 'Electrical' },
  { slug: 'scada-hmi-development', num: '04', title: 'SCADA & HMI Development', level: 'Advanced', hours: 36, category: 'SCADA' },
  { slug: 'battery-systems-storage', num: '05', title: 'Battery Systems & Storage', level: 'Intermediate', hours: 20, category: 'Energy' },
  { slug: 'veichi-vfd-servo', num: '06', title: 'Veichi VFD & Servo', level: 'Beginner', hours: 16, category: 'Drives' },
  { slug: 'vfd-fundamentals', num: '07', title: 'VFD Fundamentals', level: 'Beginner', hours: 12, category: 'Drives' },
]

const LEVEL_COLOR: Record<string, string> = {
  Advanced: '#1B6FCC',
  Intermediate: '#22C55E',
  Beginner: '#64748B',
}

export default function TrainingPage() {
  return (
    <>
      <PageHero
        title="Training Programs"
        subtitle="Hands-on automation training delivered by engineers who deploy these systems every week."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Training' }]}
      />

      {/* Track cards */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label="Learning Tracks" title="Three Ways to Learn." />
          <div className="flex justify-center mb-12">
            <Image
              src="/images/logo-academy.jpeg"
              alt="MatrixEA Automation Academy"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
            {TRACKS.map(({ n, title, desc, meta, alt }) => (
              <div
                key={n}
                className="relative flex flex-col min-h-60 md:min-h-96 lg:min-h-120 p-12 rounded-xs overflow-hidden"
                style={
                  alt
                    ? { background: '#fff', borderTop: '4px solid #1B6FCC', border: '1px solid #E2E8F0' }
                    : { background: '#2A2F3A' }
                }
              >
                {/* Grid overlay on dark cards */}
                {!alt && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(160deg, rgba(27,111,204,.25) 0%, transparent 60%)`,
                    }}
                  />
                )}
                <span
                  className="font-mono absolute top-6 right-8 leading-none"
                  style={{
                    fontSize: '54px',
                    opacity: 0.4,
                    color: alt ? '#1B6FCC' : '#fff',
                    fontWeight: 500,
                  }}
                >
                  {n}
                </span>
                <div className="relative flex flex-col flex-1">
                  <h3
                    className="font-barlow font-extrabold text-[36px] uppercase mb-4 leading-none"
                    style={{ color: alt ? '#2A2F3A' : '#fff' }}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-dm text-[15px] leading-[1.7] mb-auto"
                    style={{ color: alt ? '#64748B' : 'rgba(255,255,255,.72)' }}
                  >
                    {desc}
                  </p>
                  <div className="mt-8 flex flex-col gap-3">
                    {meta.map(({ k, v }) => (
                      <div
                        key={k}
                        className="flex justify-between py-2"
                        style={{ borderBottom: `1px solid ${alt ? '#E2E8F0' : 'rgba(255,255,255,.12)'}` }}
                      >
                        <span
                          className="font-dm text-[12px] uppercase tracking-[0.12em]"
                          style={{ color: alt ? '#64748B' : 'rgba(255,255,255,.55)' }}
                        >
                          {k}
                        </span>
                        <span
                          className="font-mono text-[12px]"
                          style={{ color: '#1B6FCC' }}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/courses"
                    className="mt-6 inline-flex items-center gap-2 font-dm font-semibold text-[12px] uppercase tracking-[0.16em] text-matrix-blue hover:gap-3 transition-all"
                  >
                    Explore Track →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum grid */}
      <section id="courses-catalog" className="bg-matrix-off py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label="Course Catalog" title="Available Courses." />
          <div
            className="grid overflow-hidden rounded-xs"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)', border: '1px solid #E2E8F0', background: '#E2E8F0', gap: '1px' }}
          >
            {COURSES.map(({ slug, num, title, level, hours, category }) => (
              <Link
                key={slug}
                href={`/courses/${slug}`}
                className="group bg-white flex items-start gap-5 p-[18px_20px] hover:bg-matrix-off transition-colors"
              >
                <span className="font-mono text-[13px] text-matrix-blue font-medium shrink-0 pt-0.5">{num}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-dm font-semibold text-[15px] text-matrix-ink uppercase tracking-[0.02em] block mb-1 group-hover:text-matrix-blue transition-colors">
                    {title}
                  </span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="font-mono text-[10.5px] uppercase tracking-[0.12em] px-2 py-0.75 rounded-xs"
                      style={{ border: `1px solid ${LEVEL_COLOR[level]}`, color: LEVEL_COLOR[level] }}
                    >
                      {level}
                    </span>
                    <span className="font-mono text-[11px] text-matrix-muted">{hours}h</span>
                    <span className="font-mono text-[11px] text-matrix-muted">{category}</span>
                  </div>
                </div>
                <span className="text-matrix-blue font-bold text-[18px] group-hover:translate-x-1 transition-transform shrink-0">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-matrix-blue text-white px-5.5 py-3 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
