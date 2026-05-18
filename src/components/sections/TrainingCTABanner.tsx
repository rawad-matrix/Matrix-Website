import Link from 'next/link'

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

export function TrainingCTABanner() {
  return (
    <section
      className="relative overflow-hidden py-[110px] max-[768px]:py-[72px]"
      style={{ background: '#F8F9FB', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}
    >
      <div className="relative max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
        <div className="grid grid-cols-2 gap-16 items-center max-[900px]:grid-cols-1 max-[900px]:gap-10">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-10 h-[3px] bg-[#1B6FCC]" />
              <span className="font-dm text-[12px] font-semibold uppercase tracking-[3px] text-[#1B6FCC]">Training Programs</span>
            </div>
            <h2
              className="font-barlow font-extrabold uppercase text-[#1F2330] mb-5"
              style={{ fontSize: 'clamp(34px, 4.6vw, 52px)', lineHeight: '1.02' }}
            >
              Build In-House Engineering Capability
            </h2>
            <p className="font-dm text-[15.5px] text-[#64748B] mb-8 leading-[1.7] max-w-[480px]">
              From beginner PLC operators to advanced SCADA engineers — our structured training programs are built and delivered by working automation engineers, not classroom instructors.
            </p>
            <Link
              href="/training"
              className="inline-flex items-center gap-2 bg-[#1B6FCC] text-white px-[22px] py-[12px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] hover:-translate-y-px transition-all duration-150"
            >
              Explore Training Programs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          {/* Right: track types */}
          <div className="flex flex-col gap-4">
            {TRACKS.map((t) => (
              <div
                key={t.label}
                className="flex items-start gap-4 p-5 rounded-[2px]"
                style={{
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderLeft: '3px solid #1B6FCC',
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 grid place-items-center rounded-[2px] text-[#1B6FCC]"
                  style={{ background: 'rgba(27,111,204,.10)' }}
                >
                  {t.icon}
                </div>
                <div>
                  <span className="font-barlow font-bold text-[18px] uppercase text-[#2A2F3A] block mb-1">{t.label}</span>
                  <span className="font-dm text-[14px] text-[#64748B]">{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
