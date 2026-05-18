import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

const CASES = [
  {
    tag: 'Water Treatment',
    title: 'Coastal Water Treatment SCADA Upgrade',
    meta: 'Lebanon · 2023',
    c1: '#2a4a70',
    c2: '#2A2F3A',
    slug: 'coastal-water-treatment',
  },
  {
    tag: 'Manufacturing',
    title: 'Automated Packaging Line Integration',
    meta: 'Saudi Arabia · 2022',
    c1: '#2a3a2a',
    c2: '#1a2A1a',
    slug: 'automated-packaging-line',
  },
  {
    tag: 'Energy',
    title: '500kW Industrial Solar + Battery Storage',
    meta: 'Iraq · 2023',
    c1: '#3a2a10',
    c2: '#2A2010',
    slug: 'industrial-solar-storage',
  },
]

export function CaseStudiesPreview() {
  return (
    <section
      className="py-[110px] max-[768px]:py-[72px] relative overflow-hidden"
      style={{ background: '#0A0A12' }}
    >
      {/* Subtle circuit overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(27,111,204,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,111,204,.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
        <div className="mb-12">
          <SectionHeader label="Recent Work" title="Projects That Prove the Point." light />
        </div>

        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-[18px]">
          {CASES.map((c, i) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="group relative overflow-hidden rounded-[2px] bg-[#0A0A12] text-white cursor-pointer transition-transform duration-250 hover:-translate-y-1"
              style={{ aspectRatio: '4/5' }}
            >
              <span className="absolute top-6 right-6 z-10 font-mono text-[11px] tracking-[0.1em] text-white/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* Image placeholder */}
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  background: `
                    linear-gradient(45deg, rgba(42,47,58,.15) 0%, transparent 60%),
                    repeating-linear-gradient(110deg, rgba(255,255,255,.04) 0 2px, transparent 2px 14px),
                    linear-gradient(160deg, ${c.c1} 0%, ${c.c2} 90%)
                  `,
                }}
              />
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(42,47,58,.92) 95%)' }}
              />
              {/* Content */}
              <div className="absolute left-0 right-0 bottom-0 p-7 z-10">
                <span
                  className="inline-block text-white font-dm font-semibold text-[10.5px] uppercase tracking-[0.16em] px-[10px] py-[5px] rounded-[2px] mb-[14px] bg-[#1B6FCC]"
                >
                  {c.tag}
                </span>
                <h4 className="font-barlow font-bold text-[24px] uppercase text-white mb-2 leading-[1.1]">
                  {c.title}
                </h4>
                <div className="flex items-center gap-[14px] text-[12.5px] text-white/70">
                  <span>{c.meta}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All — bottom center */}
        <div className="flex justify-center mt-12">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 bg-transparent text-white px-[22px] py-[12px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] border border-white/30 hover:border-[#1B6FCC] hover:text-[#1B6FCC] transition-all duration-150"
          >
            View All Case Studies
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
