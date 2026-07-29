'use client'

import React from 'react'
import { PageHero } from '@/components/sections/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ContactStrip } from '@/components/sections/ContactStrip'
import { useInView } from '@/hooks/useInView'
import { makeTx } from '@/lib/site-text'
import type { IndustryItem } from '@/lib/industries'

const EPC_LETTERS = [
  { letter: 'E', k: 'e' },
  { letter: 'P', k: 'p' },
  { letter: 'C', k: 'c' },
]

type Stats = { projects?: number; years?: number; satisfaction?: number }

export function SystemIntegratorClient({
  texts, stats = {}, industries = [],
}: {
  texts?: Record<string, string>
  stats?: Stats
  industries?: IndustryItem[]
}) {
  const { ref: epcRef, inView: epcInView } = useInView()
  const { ref: industriesRef, inView: industriesInView } = useInView()
  const t = makeTx(texts)
  const { projects = 1200, years = 21, satisfaction = 99 } = stats

  return (
    <>
      <PageHero
        title={t('si.hero.title')}
        subtitle={t('si.hero.subtitle')}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'System Integrator' }]}
      />

      {/* What we do intro */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <div className="grid grid-cols-[1.3fr_1fr] gap-16 items-center max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div>
              <SectionHeader label={t('si.intro.label')} title={t('si.intro.title')} />
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7] mb-4">
                {t('si.intro.p1')}
              </p>
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7]">
                {t('si.intro.p2')}
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-matrix-border">
                {[[`${projects}+`, 'Projects'], [`${years}`, 'Years'], [`${satisfaction}%`, 'Satisfaction']].map(([n, l]) => (
                  <div key={l}>
                    <span className="font-mono text-[clamp(28px,3vw,40px)] text-matrix-blue font-medium leading-none block">{n}</span>
                    <span className="font-dm text-[12px] uppercase tracking-[0.18em] text-matrix-muted mt-1 block">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Highlight box */}
            <div
              className="rounded-xs p-[36px_32px]"
              style={{ background: '#2A2F3A', borderTop: '4px solid #1B6FCC' }}
            >
              <h3
                className="font-barlow font-bold italic uppercase text-white mb-4"
                style={{ fontSize: '46px', lineHeight: '1' }}
              >
                {t('si.whyepc.title')}
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {[1, 2, 3, 4]
                  .map((n) => t(`si.whyepc.item${n}`))
                  .filter((text) => text.trim())
                  .map((text) => (
                    <li
                      key={text}
                      className="font-dm text-[15px] text-white/80 py-3 flex gap-3 items-start"
                      style={{ borderLeft: '2px solid rgba(27,111,204,.55)', paddingLeft: '14px' }}
                    >
                      {text}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EPC Cards */}
      <section className="bg-matrix-off py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label={t('si.epc.label')} title={t('si.epc.title')} centered />
          <div ref={epcRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
            {EPC_LETTERS.map(({ letter, k }, i) => (
              <div
                key={letter}
                className={`reveal ${epcInView ? 'in-view' : ''}`}
                style={{ transitionDelay: epcInView ? '0ms' : `${i * 80}ms` }}
              >
                <div
                  className="relative bg-white rounded-xs p-[36px_32px] h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(42,47,58,.35)]"
                  style={{ border: '1px solid #E2E8F0', borderTop: '4px solid #1B6FCC' }}
                >
                <span
                  className="absolute top-4 right-6 font-mono text-[42px] font-medium text-matrix-blue leading-none"
                  style={{ opacity: 0.12 }}
                >
                  {letter}
                </span>
                <div className="w-13.5 h-13.5 bg-matrix-navy text-matrix-blue grid place-items-center rounded-xs mb-5">
                  <span className="font-barlow font-bold text-[22px]">{letter}</span>
                </div>
                <h3 className="font-barlow font-bold text-[24px] uppercase text-matrix-navy mb-3">{t(`si.epc.${k}.title`)}</h3>
                <p className="font-dm text-[14.5px] text-matrix-muted leading-[1.6] mb-5">{t(`si.epc.${k}.desc`)}</p>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="font-dm text-[13.5px] text-matrix-ink flex items-start gap-2">
                      <span className="text-matrix-blue font-bold mt-px">›</span> {t(`si.epc.${k}.item${n}`)}
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label={t('si.services.label')} title={t('si.services.title')} />
          <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xs p-[28px_24px]"
                style={{ border: '1px solid #E2E8F0', borderLeft: '3px solid #1B6FCC' }}
              >
                <h4 className="font-barlow font-bold text-[20px] uppercase text-matrix-navy mb-2">{t(`si.services.card${n}.title`)}</h4>
                <p className="font-dm text-[14px] text-matrix-muted leading-[1.6] m-0">{t(`si.services.card${n}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries — admin-managed cards: title above, photo below */}
      <section className="bg-matrix-off py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label={t('si.industries.label')} title={t('si.industries.title')} />
          <div ref={industriesRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {industries.map((ind, i) => (
              <div
                key={ind.id}
                className={`reveal ${industriesInView ? 'in-view' : ''}`}
                style={{ transitionDelay: industriesInView ? '0ms' : `${i * 50}ms` }}
              >
                <div
                  className="bg-white rounded-xs overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(10,10,18,.25)]"
                  style={{ border: '1px solid #E2E8F0', borderTop: '3px solid #1B6FCC' }}
                >
                  <h4 className="font-barlow font-bold text-[18px] uppercase text-matrix-navy px-5 pt-5 pb-4">
                    {ind.title}
                  </h4>
                  <div className="relative w-full" style={{ aspectRatio: '4/3', background: '#0A0A12' }}>
                    {ind.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ind.imageUrl} alt={ind.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `
                            repeating-linear-gradient(110deg,rgba(255,255,255,.04) 0 2px,transparent 2px 14px),
                            linear-gradient(160deg,#1a2a3a 0%,#0a1a28 90%)
                          `,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactStrip texts={texts} />
    </>
  )
}
