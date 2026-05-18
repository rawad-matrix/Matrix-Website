'use client'
import { useState } from 'react'
import { PageHero } from '@/components/sections/PageHero'
import { ContactStrip } from '@/components/sections/ContactStrip'
import Link from 'next/link'

const ALL_COURSES = [
  {
    slug: 'siemens-tia-portal',
    title: 'Siemens TIA Portal',
    desc: 'Master Siemens\' flagship engineering environment from first project creation through advanced library design.',
    level: 'Advanced',
    hours: 40,
    price: 299,
    category: 'PLC',
    c1: '#1a3a70', c2: '#102050',
  },
  {
    slug: 'delta-plc',
    title: 'Delta PLC Programming',
    desc: 'Complete Delta ISPSoft programming course covering DVP and AS series hardware with real-world applications.',
    level: 'Intermediate',
    hours: 24,
    price: 199,
    category: 'PLC',
    c1: '#1a3550', c2: '#102040',
  },
  {
    slug: 'eplan-electric-p8',
    title: 'EPLAN Electric P8',
    desc: 'Professional electrical CAD — schematic creation, parts management, reports and automated documentation.',
    level: 'Intermediate',
    hours: 32,
    price: 229,
    category: 'Electrical',
    c1: '#2a3a1a', c2: '#1a2a10',
  },
  {
    slug: 'scada-hmi-development',
    title: 'SCADA & HMI Development',
    desc: 'Design and build industrial SCADA systems and HMI interfaces using Siemens WinCC and modern platforms.',
    level: 'Advanced',
    hours: 36,
    price: 279,
    category: 'SCADA',
    c1: '#2a1a3a', c2: '#1a1028',
  },
  {
    slug: 'battery-systems-storage',
    title: 'Battery Systems & Storage',
    desc: 'Battery chemistry, BMS systems, sizing for industrial and commercial applications, and ESS integration.',
    level: 'Intermediate',
    hours: 20,
    price: 179,
    category: 'Energy',
    c1: '#3a2a10', c2: '#2a1a08',
  },
  {
    slug: 'veichi-vfd-servo',
    title: 'Veichi VFD & Servo',
    desc: 'Variable frequency drive and servo motor control — parameter configuration, PID tuning and troubleshooting.',
    level: 'Beginner',
    hours: 16,
    price: 149,
    category: 'Drives',
    c1: '#1a3a3a', c2: '#102828',
  },
  {
    slug: 'vfd-fundamentals',
    title: 'VFD Fundamentals',
    desc: 'Principles of variable speed drives — motor selection, energy savings, installation and basic programming.',
    level: 'Beginner',
    hours: 12,
    price: 129,
    category: 'Drives',
    c1: '#2a2a3a', c2: '#1a1a28',
  },
]

const LEVEL_COLOR: Record<string, string> = {
  Advanced: '#1B6FCC',
  Intermediate: '#22C55E',
  Beginner: '#64748B',
}

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const CATEGORIES = ['All', 'PLC', 'SCADA', 'Electrical', 'Energy', 'Drives']

export default function CoursesPage() {
  const [level, setLevel] = useState('All')
  const [cat, setCat] = useState('All')

  const filtered = ALL_COURSES.filter((c) => {
    const matchLevel = level === 'All' || c.level === level
    const matchCat = cat === 'All' || c.category === cat
    return matchLevel && matchCat
  })

  return (
    <>
      <PageHero
        title="Training Courses"
        subtitle="Hands-on automation courses taught by working engineers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Courses' }]}
      />

      <section className="bg-[#F8F9FB] py-[110px] max-[768px]:py-[72px]">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`font-dm font-semibold text-[12px] uppercase tracking-[0.08em] px-4 py-2 rounded-[2px] transition-all duration-150 ${
                    level === l
                      ? 'bg-[#2A2F3A] text-white'
                      : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#1B6FCC] hover:text-[#1B6FCC]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="w-px bg-[#E2E8F0]" />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`font-dm font-semibold text-[12px] uppercase tracking-[0.08em] px-4 py-2 rounded-[2px] transition-all duration-150 ${
                    cat === c
                      ? 'bg-[#1B6FCC] text-white'
                      : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#1B6FCC] hover:text-[#1B6FCC]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="font-barlow font-bold text-[28px] uppercase text-[#64748B]">No courses match this filter</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
              {filtered.map(({ slug, title, desc, level: l, hours, price, category, c1, c2 }) => (
                <Link
                  key={slug}
                  href={`/courses/${slug}`}
                  className="group relative overflow-hidden rounded-[2px] flex flex-col transition-all duration-200 hover:-translate-y-1"
                  style={{ background: '#2A2F3A', boxShadow: '0 4px 16px rgba(0,0,0,.08)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,.18)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,.08)' }}
                >
                  {/* Card top image */}
                  <div
                    className="h-[120px] transition-transform duration-500 group-hover:scale-105"
                    style={{
                      background: `repeating-linear-gradient(110deg, rgba(255,255,255,.04) 0 2px, transparent 2px 14px), linear-gradient(160deg, ${c1} 0%, ${c2} 90%)`,
                    }}
                  />
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <span
                      className="inline-block font-mono text-[10.5px] uppercase tracking-[0.12em] px-2 py-[3px] rounded-[2px] self-start"
                      style={{ border: `1px solid ${LEVEL_COLOR[l]}`, color: LEVEL_COLOR[l] }}
                    >
                      {l}
                    </span>
                    <h3 className="font-barlow font-bold text-[22px] uppercase text-white leading-[1.1]">{title}</h3>
                    <p className="font-dm text-[14px] text-white/65 leading-[1.6] flex-1">{desc}</p>
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-white/50">{hours}h</span>
                        <span className="font-mono text-[11px] text-white/50">{category}</span>
                      </div>
                      <span className="font-mono text-[18px] text-[#1B6FCC] font-medium">${price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
