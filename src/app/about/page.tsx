export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatsCounter } from '@/components/sections/StatsCounter'
import { ContactStrip } from '@/components/sections/ContactStrip'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'About' }

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    return Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value as string]))
  } catch {
    return {}
  }
}

const TIMELINE = [
  { year: '2003', title: 'Founded in Beirut', desc: 'Matrix EA established as a system integration firm focused on PLC and SCADA automation for Lebanese industry.' },
  { year: '2011', title: 'Regional Expansion', desc: 'Opened project offices in Iraq and Saudi Arabia, completing major water and industrial automation projects.' },
  { year: '2015', title: 'Training Division Launched', desc: 'Established the Matrix EA Training Centre, delivering accredited PLC, SCADA and EPLAN courses.' },
  { year: '2019', title: 'Energy Division', desc: "Added solar and battery storage design to our portfolio, responding to Lebanon's energy crisis." },
  { year: '2023', title: 'Digital Platform', desc: 'Launched online course catalog and live IoT monitoring platform for remote client sites.' },
]

export default async function AboutPage() {
  const s = await getSiteSettings()

  const stats = {
    projects:     s.stat_projects     ? parseInt(s.stat_projects)     : undefined,
    clients:      s.stat_clients      ? parseInt(s.stat_clients)      : undefined,
    years:        s.stat_years        ? parseInt(s.stat_years)        : undefined,
    satisfaction: s.stat_satisfaction ? parseInt(s.stat_satisfaction) : undefined,
  }

  return (
    <>
      <PageHero
        title="About Matrix EA"
        subtitle="21 years of engineering excellence across the Arab world and Africa."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Story section */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <div className="grid grid-cols-2 gap-16 items-start max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div>
              <SectionHeader label="Our Story" title="Built on the Plant Floor." />
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7] mb-4">
                Matrix Energy & Automation was founded in Beirut in 2003 with a simple premise: industrial automation should be designed and delivered by engineers who understand both the theory and the reality of plant floor operation.
              </p>
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7] mb-4">
                Over two decades, we have grown from a local system integrator to a regional leader with completed projects in Lebanon, Iraq, Saudi Arabia, Sudan, Chad and beyond. Our team of 35+ engineers has commissioned systems in water treatment, food processing, power generation, pharmaceutical manufacturing and heavy industry.
              </p>
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7]">
                We remain privately held and engineering-first. Every project is owned by a senior engineer from scoping through commissioning. No subcontracting of core automation work.
              </p>
            </div>
            {/* Mission box */}
            <div className="rounded-xs p-10 bg-matrix-navy border-t-4 border-t-matrix-blue">
              <h3 className="font-barlow font-bold text-[28px] uppercase text-white mb-5">Our Mission</h3>
              <p className="font-dm text-[15.5px] text-white/75 leading-[1.7] mb-6">
                To deliver automation and energy solutions that genuinely improve plant performance, reduce downtime and transfer real knowledge to client teams — so they become more independent with every project we complete together.
              </p>
              <div className="flex flex-col gap-3">
                {['Engineering-first culture', 'No subcontracting of core work', 'Knowledge transfer in every project', 'Regional expertise, global standards'].map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-matrix-blue shrink-0" />
                    <span className="font-dm text-[14px] text-white/80">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsCounter stats={stats} />

      {/* Timeline */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label="History" title="Two Decades of Growth." centered />
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {TIMELINE.map(({ year, title, desc }) => (
              <div
                key={year}
                className="bg-matrix-off rounded-xs p-7"
                style={{ border: '1px solid #E2E8F0', borderTop: '3px solid #1B6FCC' }}
              >
                <span className="font-mono text-[13px] text-matrix-blue font-medium block mb-2">{year}</span>
                <h4 className="font-barlow font-bold text-[20px] uppercase text-matrix-navy mb-2">{title}</h4>
                <p className="font-dm text-[14px] text-matrix-muted leading-[1.6] m-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
