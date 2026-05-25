import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface StatRow { label: string; value: string }
interface Module { num: string; title: string; desc: string }
interface WhoCard { title: string; desc: string }

interface TrainingSubPageProps {
  crumb: string
  titleLine1: string
  titleAccent: string
  subtitle: string
  stats: StatRow[]
  sectionLabel: string
  sectionTitle: string
  modules: Module[]
  whoLabel: string
  whoTitle: string
  whoCards: WhoCard[]
  ctaTitle: string
  ctaDesc: string
  ctaButton: string
}

export function TrainingSubPage({
  crumb, titleLine1, titleAccent, subtitle, stats,
  sectionLabel, sectionTitle, modules,
  whoLabel, whoTitle, whoCards,
  ctaTitle, ctaDesc, ctaButton,
}: TrainingSubPageProps) {
  const waLink = `https://wa.me/96171483747?text=Hi%20Matrix%20%E2%80%94%20I%20am%20interested%20in%20the%20${encodeURIComponent(titleLine1 + ' ' + titleAccent)}%20program.`

  return (
    <>
      {/* Sub-hero */}
      <section
        className="relative overflow-hidden py-16 pb-18"
        style={{ background: '#2A2F3A', color: '#fff' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(27,111,204,.10) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(27,111,204,.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(27,111,204,.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 max-[640px]:px-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2.5 font-dm text-[11.5px] uppercase tracking-[0.18em] text-white/50 font-medium mb-6">
            <Link href="/" className="hover:text-matrix-blue transition-colors">Home</Link>
            <span className="opacity-40">›</span>
            <Link href="/training" className="hover:text-matrix-blue transition-colors">Training</Link>
            <span className="opacity-40">›</span>
            <span className="text-matrix-blue">{crumb}</span>
          </nav>

          <div className="grid grid-cols-[1.4fr_1fr] gap-12 items-center max-[900px]:grid-cols-1 max-[900px]:gap-8">
            <div>
              <h1
                className="font-barlow font-extrabold uppercase text-white mb-3.5"
                style={{ fontSize: 'clamp(36px, 5vw, 58px)', lineHeight: '0.97', letterSpacing: '-0.005em' }}
              >
                {titleLine1}<br />
                <span className="text-matrix-blue">{titleAccent}</span>
              </h1>
              <p className="font-dm text-[16px] text-white/72 max-w-135 leading-[1.65]">{subtitle}</p>
            </div>

            {/* Stats card */}
            <div
              className="rounded-xs p-6"
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(27,111,204,.22)',
              }}
            >
              {stats.map((row, i) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: i < stats.length - 1 ? '1px solid rgba(255,255,255,.08)' : undefined }}
                >
                  <span className="font-dm text-[11px] uppercase tracking-widest text-white/50 font-medium">{row.label}</span>
                  <span className="font-mono text-[13.5px] text-matrix-blue font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb bar */}
      <div className="bg-matrix-off border-b border-matrix-border py-3.5">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <nav className="flex gap-2.5 items-center text-[12px] uppercase tracking-[0.18em] text-matrix-muted font-dm font-medium">
            <Link href="/" className="text-matrix-ink hover:text-matrix-blue transition-colors">Home</Link>
            <span className="opacity-50">›</span>
            <Link href="/training" className="text-matrix-ink hover:text-matrix-blue transition-colors">Training</Link>
            <span className="opacity-50">›</span>
            <span className="text-matrix-blue">{crumb}</span>
          </nav>
        </div>
      </div>

      {/* Modules / Curriculum */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label={sectionLabel} title={sectionTitle} />
          <div
            className="grid gap-px max-[760px]:grid-cols-1 rounded-xs overflow-hidden"
            style={{
              gridTemplateColumns: 'repeat(2, 1fr)',
              background: '#E2E8F0',
              border: '1px solid #E2E8F0',
            }}
          >
            {modules.map((mod) => (
              <div
                key={mod.num}
                className="bg-white flex gap-4.5 p-7 hover:bg-matrix-off transition-colors duration-150"
              >
                <span className="font-mono text-[20px] text-matrix-blue font-medium shrink-0 w-9 leading-tight">{mod.num}</span>
                <div>
                  <h4 className="font-barlow font-bold text-[18px] uppercase text-matrix-ink mb-1.5 tracking-[0.01em]">{mod.title}</h4>
                  <p className="font-dm text-[14px] text-matrix-muted leading-[1.6] m-0">{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 bg-matrix-off">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label={whoLabel} title={whoTitle} />
          <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
            {whoCards.map((card) => (
              <div
                key={card.title}
                className="bg-white p-7 rounded-xs"
                style={{
                  border: '1px solid #E2E8F0',
                  borderTop: '3px solid #1B6FCC',
                }}
              >
                <h4 className="font-barlow font-bold text-[18px] uppercase text-matrix-ink mb-2.5 tracking-[0.01em]">{card.title}</h4>
                <p className="font-dm text-[14px] text-matrix-muted leading-[1.6] m-0">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-15 text-center"
        style={{ background: '#2A2F3A' }}
      >
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <h2
            className="font-barlow font-extrabold uppercase text-white mb-3.5"
            style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}
          >
            {ctaTitle}
          </h2>
          <p className="font-dm text-[15px] text-white/65 max-w-130 mx-auto mb-7 leading-[1.6]">{ctaDesc}</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-matrix-blue text-white px-6 py-3.5 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
            >
              {ctaButton}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-transparent text-white px-6 py-3.5 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs border border-white/40 hover:bg-white hover:text-matrix-ink transition-all duration-150"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
