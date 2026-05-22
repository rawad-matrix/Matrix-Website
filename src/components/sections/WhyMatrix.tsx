import { SectionHeader } from '@/components/ui/SectionHeader'
import Link from 'next/link'

const CHECKLIST = [
  { t: '21 Years of Specialized Experience', d: 'Serving Lebanon, Iraq, Saudi Arabia and Africa since 2003.' },
  { t: 'Certified Siemens & ABB Partners', d: 'Authorised distributor and service provider for Siemens and ABB automation.' },
  { t: '24/7 Maintenance Support', d: 'Round-the-clock remote monitoring and on-site response across the region.' },
  { t: 'Turnkey EPC Delivery', d: 'We own the project from engineering through procurement to commissioning.' },
  { t: 'Training & Knowledge Transfer', d: 'Every project includes optional hands-on operator and technician training.' },
]

export function WhyMatrix() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#2A2F3A', color: '#fff', height: 'calc(100vh - 72px)', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      {/* Circuit overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(27,111,204,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,111,204,.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 max-[640px]:px-5 py-[clamp(16px,2.5vh,48px)]">
        <div className="grid grid-cols-2 gap-20 items-center max-[900px]:grid-cols-1 max-[900px]:gap-12">
          {/* Photo side */}
          <div className="relative max-[900px]:hidden" style={{ height: 'clamp(280px, 52vh, 480px)' }}>
            <div
              className="absolute inset-0 rounded-[2px] overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, rgba(42,47,58,.45) 0%, rgba(42,47,58,.1) 100%),
                  repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 2px, transparent 2px 16px),
                  linear-gradient(170deg, #3F4655 0%, #2A2F3A 90%)
                `,
                border: '1px solid rgba(27,111,204,.18)',
              }}
            >
              <span
                className="absolute inset-x-0 font-mono text-[11px] uppercase tracking-[0.2em] text-center"
                style={{ color: 'rgba(255,255,255,.32)', top: '50%', transform: 'translateY(-50%)' }}
              >
                Factory / Refinery Photo
              </span>
            </div>
            {/* Corner decorators */}
            <div className="absolute -left-[14px] -top-[14px] w-[90px] h-[90px]" style={{ borderTop: '3px solid #1B6FCC', borderLeft: '3px solid #1B6FCC' }} />
            <div className="absolute -right-[14px] -bottom-[14px] w-[90px] h-[90px]" style={{ borderBottom: '3px solid #1B6FCC', borderRight: '3px solid #1B6FCC' }} />
            {/* Badge */}
            <div className="absolute left-6 bottom-6 flex items-baseline gap-[10px] bg-[#1B6FCC] text-white px-[18px] py-[14px] rounded-[2px]">
              <span className="font-mono text-[30px] font-medium leading-none">21</span>
              <span className="font-barlow text-[11px] uppercase tracking-[0.18em] max-w-[120px] leading-[1.3]">Years of Engineering Excellence</span>
            </div>
          </div>

          {/* Text side */}
          <div>
            <SectionHeader label="Our Edge" title="Why Choose Matrix EA" light className="mb-4" />
            <ul className="list-none p-0 m-0 mt-3 flex flex-col gap-[6px]">
              {CHECKLIST.map((item) => (
                <li
                  key={item.t}
                  className="flex gap-[14px] items-start py-[9px]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}
                >
                  <div
                    className="flex-shrink-0 w-7 h-7 grid place-items-center rounded-[2px] mt-[1px]"
                    style={{ border: '1.5px solid #1B6FCC', color: '#1B6FCC' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-barlow font-bold text-[20px] uppercase tracking-[0.02em] text-white block">{item.t}</span>
                    <span className="font-dm text-[14px] text-white/65 block mt-[2px]">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-[14px]">
              <Link
                href="/system-integrator"
                className="inline-flex items-center gap-2 bg-[#1B6FCC] text-white px-[22px] py-[12px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] hover:-translate-y-px transition-all duration-150"
              >
                Our Services
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-transparent text-white px-[22px] py-[12px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] border border-white/45 hover:border-[#1B6FCC] hover:text-[#1B6FCC] transition-all duration-150"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
