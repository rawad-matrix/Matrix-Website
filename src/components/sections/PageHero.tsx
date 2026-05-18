import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumbs?: Crumb[]
}

export function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  const parts = title.split(' ')
  const last = parts.pop()
  const rest = parts.join(' ')

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-[70px] pb-[90px]"
        style={{ background: '#2A2F3A', color: '#fff' }}
      >
        {/* Grid overlay */}
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
        {/* Right decorative panel */}
        <div
          className="absolute right-0 top-0 bottom-0 hidden md:block pointer-events-none"
          style={{
            width: '35%',
            clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)',
            background: `repeating-linear-gradient(110deg, rgba(255,255,255,.018) 0 2px, transparent 2px 14px)`,
            borderLeft: '1px solid rgba(27,111,204,.15)',
          }}
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
          <h1
            className="font-barlow font-extrabold uppercase text-white"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: '0.98' }}
          >
            {rest && <>{rest} </>}
            <span className="text-[#1B6FCC]">{last}</span>
          </h1>
          {subtitle && (
            <p className="font-dm text-[17px] text-white/70 mt-4 max-w-[560px] leading-[1.6]">{subtitle}</p>
          )}
        </div>
      </section>

      {/* Breadcrumb bar */}
      {breadcrumbs && (
        <div className="bg-[#F8F9FB] border-b border-[#E2E8F0] py-[14px]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
            <nav className="flex gap-[10px] items-center text-[12px] uppercase tracking-[0.18em] text-[#64748B] font-dm font-medium">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-[10px]">
                  {i > 0 && <span className="opacity-50">›</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-[#1F2330] hover:text-[#1B6FCC] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#1B6FCC]">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
