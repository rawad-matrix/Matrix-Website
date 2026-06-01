'use client'

import React from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import Link from 'next/link'
import { useInView } from '@/hooks/useInView'

const CHECKLIST = [
  { t: '21 Years of Specialized Experience', d: 'Serving Lebanon, Iraq, Saudi Arabia and Africa since 2003.' },
  { t: 'Certified Siemens & ABB Partners', d: 'Authorised distributor and service provider for Siemens and ABB automation.' },
  { t: '24/7 Maintenance Support', d: 'Round-the-clock remote monitoring and on-site response across the region.' },
  { t: 'Turnkey EPC Delivery', d: 'We own the project from engineering through procurement to commissioning.' },
  { t: 'Training & Knowledge Transfer', d: 'Every project includes optional hands-on operator and technician training.' },
]

export function WhyMatrix({ imageUrl }: { imageUrl?: string | null }) {
  const { ref: sectionRef, inView } = useInView()
  return (
    <section
      className="relative overflow-hidden py-[clamp(48px,7vh,96px)]"
      style={{ background: '#2A2F3A', color: '#fff' }}
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
      <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="relative z-10 w-full max-w-7xl mx-auto px-8 max-[640px]:px-5">
        <div className="grid grid-cols-2 gap-20 items-center max-[900px]:grid-cols-1 max-[900px]:gap-12">
          {/* Photo side */}
          <div
            className="relative max-[900px]:hidden"
            style={{
              height: 'clamp(320px, 52vh, 480px)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(-24px)',
              transition: 'opacity .7s ease, transform .7s ease',
            }}
          >
            <div
              className="absolute inset-0 rounded-xs overflow-hidden"
              style={{ border: '1px solid rgba(27,111,204,.18)' }}
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Matrix facility" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        linear-gradient(135deg, rgba(42,47,58,.45) 0%, rgba(42,47,58,.1) 100%),
                        repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 2px, transparent 2px 16px),
                        linear-gradient(170deg, #3F4655 0%, #2A2F3A 90%)
                      `,
                    }}
                  />
                  <span
                    className="absolute inset-x-0 font-mono text-[11px] uppercase tracking-[0.2em] text-center z-10"
                    style={{ color: 'rgba(255,255,255,.32)', top: '50%', transform: 'translateY(-50%)' }}
                  >
                    Factory / Refinery Photo
                  </span>
                </>
              )}
            </div>
            {/* Corner decorators */}
            <div className="absolute -left-3.5 -top-3.5 w-22.5 h-22.5" style={{ borderTop: '3px solid #1B6FCC', borderLeft: '3px solid #1B6FCC' }} />
            <div className="absolute -right-3.5 -bottom-3.5 w-22.5 h-22.5" style={{ borderBottom: '3px solid #1B6FCC', borderRight: '3px solid #1B6FCC' }} />
            {/* Badge */}
            <div className="absolute left-6 bottom-6 flex items-baseline gap-2.5 bg-matrix-blue text-white px-4.5 py-3.5 rounded-xs">
              <span className="font-mono text-[30px] font-medium leading-none">21</span>
              <span className="font-barlow text-[11px] uppercase tracking-[0.18em] max-w-30 leading-[1.3]">Years of Engineering Excellence</span>
            </div>
          </div>

          {/* Text side */}
          <div>
            <SectionHeader label="Our Edge" title="Why Choose Matrix EA" light className="mb-4" />
            <ul className="list-none p-0 m-0 mt-3 flex flex-col gap-1.5">
              {CHECKLIST.map((item, i) => (
                <li
                  key={item.t}
                  className={`flex gap-3.5 items-start py-2.25 reveal ${inView ? 'in-view' : ''}`}
                  style={{ borderBottom: '1px solid rgba(255,255,255,.08)', transitionDelay: inView ? '0ms' : `${i * 60}ms` }}
                >
                  <div
                    className="shrink-0 w-7 h-7 grid place-items-center rounded-xs mt-px"
                    style={{ border: '1.5px solid #1B6FCC', color: '#1B6FCC' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-barlow font-bold text-[20px] uppercase tracking-[0.02em] text-white block">{item.t}</span>
                    <span className="font-dm text-[14px] text-white/65 block mt-0.5">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3.5">
              <Link
                href="/system-integrator"
                className="inline-flex items-center gap-2 bg-matrix-blue text-white px-5.5 py-3 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
              >
                Our Services
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-transparent text-white px-5.5 py-3 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs border border-white/45 hover:border-matrix-blue hover:text-matrix-blue transition-all duration-150"
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
