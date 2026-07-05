'use client'

import React from 'react'
import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { makeTx } from '@/lib/site-text'

const TRACKS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    label: 'Academic Training',
    desc: 'Structured courses with lab sessions and certification.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
      </svg>
    ),
    label: 'On-the-Job Training',
    desc: 'Delivered on your plant floor using your live equipment.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: 'Hybrid Learning',
    desc: 'Self-paced theory combined with intensive hands-on lab days.',
  },
]

export function TrainingCTABanner({ texts }: { texts?: Record<string, string> }) {
  const { ref: sectionRef, inView } = useInView()
  const t = makeTx(texts)
  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center py-[clamp(48px,6vh,80px)]"
      style={{ background: '#F8F9FB', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}
    >
      <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="relative max-w-7xl mx-auto px-8 max-[640px]:px-5 w-full">
        <div className="grid grid-cols-2 gap-16 items-center max-[900px]:grid-cols-1 max-[900px]:gap-10">
          {/* Left */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity .7s ease, transform .7s ease',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-10 h-0.75 bg-matrix-blue" />
              <span className="font-dm text-[12px] font-semibold uppercase tracking-[3px] text-matrix-blue">{t('home.training.label')}</span>
            </div>
            <h2
              className="font-barlow font-extrabold uppercase text-matrix-ink mb-5"
              style={{ fontSize: 'clamp(34px, 4.6vw, 52px)', lineHeight: '1.02' }}
            >
              {t('home.training.title')}
            </h2>
            <p className="font-dm text-[15.5px] text-matrix-muted mb-8 leading-[1.7] max-w-120">
              {t('home.training.lead')}
            </p>
            <Link
              href="/training"
              className="inline-flex items-center gap-2 bg-matrix-blue text-white px-5.5 py-3 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
            >
              {t('home.training.cta')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          {/* Right: track types */}
          <div className="flex flex-col gap-4">
            {TRACKS.map((track, i) => (
              <div
                key={track.label}
                className={`reveal ${inView ? 'in-view' : ''}`}
                style={{ transitionDelay: inView ? '0ms' : `${80 + i * 80}ms` }}
              >
              <div
                className="flex items-start gap-5 p-6 rounded-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(42,47,58,.18)]"
                style={{
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderLeft: '3px solid #1B6FCC',
                }}
              >
                <div
                  className="shrink-0 w-12 h-12 grid place-items-center rounded-xs text-matrix-blue"
                  style={{ background: 'rgba(27,111,204,.10)' }}
                >
                  {track.icon}
                </div>
                <div>
                  <span className="font-barlow font-bold text-[20px] uppercase text-matrix-navy block mb-1">{t(`home.training.track${i + 1}.title`)}</span>
                  <span className="font-dm text-[15px] text-matrix-muted">{t(`home.training.track${i + 1}.desc`)}</span>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
