'use client'

import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

const SERVICES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/>
        <rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/>
      </svg>
    ),
    title: 'System Integrator',
    desc: 'Turnkey EPC delivery — engineering, procurement, and construction of complete industrial automation platforms across the region.',
    href: '/system-integrator',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    title: 'Academic Training',
    desc: 'Face-to-face programs at the Matrix facility for students and fresh graduates. PLC, SCADA, TIA Portal and beyond.',
    href: '/training',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
      </svg>
    ),
    title: 'On-the-Job Training',
    desc: 'Customized curriculum delivered at your facility or university. Built around your processes, your team.',
    href: '/training',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Hybrid Training',
    desc: 'Online sessions paired with in-person labs. Flexible scheduling for distributed teams who need real hands-on practice.',
    href: '/training',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
        <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
        <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
        <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
        <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
      </svg>
    ),
    title: 'PLC & SCADA Courses',
    desc: 'Structured tracks on Siemens TIA Portal, Allen Bradley, Delta and Veichi — beginner to advanced, with certified outcomes.',
    href: '/courses',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Online Education Platform',
    desc: 'A dedicated digital learning portal — self-paced modules, lab simulations, and certification tracks. Details to follow.',
    href: '#',
    comingSoon: true,
  },
]

export function ServicesGrid() {
  return (
    <section className="bg-white" style={{ height: 'calc(100vh - 72px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5 py-[clamp(24px,4vh,56px)]">
        <div className="mb-[clamp(20px,3vh,48px)]">
          <SectionHeader label="What We Do" title="Engineering Solutions That Work." className="mb-0" />
        </div>
        <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
          {SERVICES.map((svc, i) => {
            const isComing = svc.comingSoon

            const cardInner = (
              <div
                key={svc.title}
                className={`group relative bg-white rounded-[2px] flex flex-col gap-[clamp(10px,1.2vh,16px)] p-[clamp(20px,2.5vh,32px)_24px] transition-all duration-200 ease-out ${isComing ? 'cursor-default' : 'hover:-translate-y-1'}`}
                style={{
                  border: '1px solid #E2E8F0',
                  borderLeft: isComing ? '3px solid #DC2626' : '3px solid #1B6FCC',
                  opacity: isComing ? 0.75 : 1,
                }}
                onMouseEnter={isComing ? undefined : (e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 18px 40px -20px rgba(10,10,18,.25)'
                }}
                onMouseLeave={isComing ? undefined : (e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                {/* Coming Soon badge */}
                {isComing && (
                  <span
                    className="absolute top-[14px] left-[14px] font-mono text-[10px] uppercase tracking-[0.12em] text-white bg-[#DC2626] px-[8px] py-[3px] rounded-[2px]"
                  >
                    Coming Soon
                  </span>
                )}
                <span className="absolute top-[14px] right-[18px] font-mono text-[11px] tracking-[0.1em] text-[rgba(10,10,18,.25)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className="w-10 h-10 grid place-items-center rounded-[2px]"
                  style={{
                    background: isComing ? 'rgba(220,38,38,.10)' : 'rgba(27,111,204,.12)',
                    color: isComing ? '#DC2626' : '#1B6FCC',
                  }}
                >
                  {svc.icon}
                </div>
                <h3 className="font-barlow font-bold text-[22px] uppercase text-[#2A2F3A] tracking-[0.01em]">
                  {svc.title}
                </h3>
                <p className="font-dm text-[14.5px] text-[#64748B] leading-[1.6] m-0 flex-1">
                  {svc.desc}
                </p>
                {!isComing && (
                  <div className="mt-auto pt-[14px] inline-flex items-center gap-2 font-dm text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2A2F3A] group-hover:text-[#1B6FCC] transition-colors">
                    Learn more
                    <span className="text-[#1B6FCC] transition-transform duration-150 group-hover:translate-x-1">→</span>
                  </div>
                )}
              </div>
            )

            return isComing ? (
              <div key={svc.title}>{cardInner}</div>
            ) : (
              <Link key={svc.title} href={svc.href} className="block no-underline">
                {cardInner}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

