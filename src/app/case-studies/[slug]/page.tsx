import { PageHero } from '@/components/sections/PageHero'
import { ContactStrip } from '@/components/sections/ContactStrip'
import Link from 'next/link'

const CASES: Record<string, {
  tag: string; title: string; client: string; sector: string; year: string;
  summary: string; description: string; systems: string[]; c1: string; c2: string;
}> = {
  'coastal-water-treatment': {
    tag: 'Water Treatment', title: 'Coastal Water Treatment SCADA Upgrade',
    client: 'Lebanese Water Authority', sector: 'Utilities', year: '2023',
    summary: 'Complete migration of obsolete Wonderware SCADA to Siemens WinCC with S7-1500 PLCs across 4 pumping stations.',
    description: 'The Lebanese Water Authority needed to replace an aging Wonderware SCADA system that was causing repeated unplanned downtime at their coastal pumping stations. Matrix EA designed and delivered a full migration to Siemens S7-1500 PLCs with WinCC SCADA, covering 4 pumping stations over a 9-month period. All work was performed hot, with no planned service interruptions. The new system reduced alarm nuisance rates by 68% and gave the operator team remote visibility for the first time.',
    systems: ['Siemens S7-1500', 'WinCC V7 SCADA', 'Profinet', 'EPLAN Documentation'],
    c1: '#2a4a70', c2: '#1a2a44',
  },
  'automated-packaging-line': {
    tag: 'Manufacturing', title: 'Automated Packaging Line Integration',
    client: 'Al-Rashed Foods', sector: 'Food & Beverage', year: '2022',
    summary: 'Greenfield Allen Bradley ControlLogix system integrating 7 packaging machines with a central MES interface.',
    description: 'Al-Rashed Foods commissioned Matrix EA to design and commission the automation for their new packaging hall in Saudi Arabia. The project involved integrating 7 heterogeneous packaging machines from 4 different OEMs into a single Allen Bradley ControlLogix backbone, with a standardised operator HMI on every line and a central data interface to their SAP MES system. The system was commissioned on schedule and achieved target OEE of 78% within 3 months of go-live.',
    systems: ['Allen Bradley ControlLogix', 'PanelView HMI', 'EtherNet/IP', 'SAP MES Interface'],
    c1: '#2a3a2a', c2: '#1a2a1a',
  },
  'industrial-solar-storage': {
    tag: 'Energy', title: '500kW Industrial Solar + Battery Storage',
    client: 'Al-Furat Power', sector: 'Energy', year: '2023',
    summary: '500kW rooftop solar array with 1MWh CATL battery storage and Siemens energy management system.',
    description: 'Responding to Iraq\'s unreliable grid supply, Al-Furat Power commissioned Matrix EA to design and install a 500kW solar array with 1MWh battery storage. The system is managed by a Siemens SICAM energy management controller that automatically prioritises solar, battery and grid depending on tariff and availability. The installation achieved payback within 4.2 years and eliminated 94% of diesel generator runtime.',
    systems: ['Huawei SUN2000 Inverters', 'CATL Battery ESS', 'Siemens SICAM', 'Modbus TCP'],
    c1: '#3a2a10', c2: '#2a2010',
  },
}

export async function generateStaticParams() {
  return Object.keys(CASES).map((slug) => ({ slug }))
}

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const cs = CASES[params.slug]

  if (!cs) {
    return (
      <div className="py-40 text-center">
        <h1 className="font-barlow text-[40px] uppercase">Case study not found</h1>
        <Link href="/case-studies" className="text-[#1B6FCC] mt-4 block">← Back to Case Studies</Link>
      </div>
    )
  }

  return (
    <>
      <PageHero
        title={cs.title}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Case Studies', href: '/case-studies' }, { label: cs.tag }]}
      />

      <section className="bg-white py-[110px] max-[768px]:py-[72px]">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
          <div className="grid grid-cols-[1.5fr_1fr] gap-14 items-start max-[900px]:grid-cols-1 max-[900px]:gap-10">
            {/* Main content */}
            <div>
              {/* Photo placeholder */}
              <div
                className="w-full rounded-[2px] mb-8"
                style={{
                  aspectRatio: '16/10',
                  background: `linear-gradient(45deg, rgba(42,47,58,.15) 0%, transparent 60%), repeating-linear-gradient(110deg, rgba(255,255,255,.04) 0 2px, transparent 2px 14px), linear-gradient(160deg, ${cs.c1} 0%, ${cs.c2} 90%)`,
                  border: '1px solid #E2E8F0',
                }}
              />
              <span className="inline-block bg-[#1B6FCC] text-white font-dm font-semibold text-[11px] uppercase tracking-[0.16em] px-3 py-[5px] rounded-[2px] mb-4">{cs.tag}</span>
              <h2 className="font-barlow font-bold text-[34px] uppercase text-[#1F2330] mb-4">{cs.title}</h2>
              <p className="font-dm text-[16px] text-[#64748B] leading-[1.7] mb-4 font-medium">{cs.summary}</p>
              <p className="font-dm text-[15.5px] text-[#64748B] leading-[1.75]">{cs.description}</p>
            </div>

            {/* Sidebar */}
            <aside
              className="rounded-[2px] p-7 sticky top-28"
              style={{ background: '#F8F9FB', border: '1px solid #E2E8F0', borderTop: '4px solid #1B6FCC' }}
            >
              <h3 className="font-barlow font-bold text-[18px] uppercase text-[#1F2330] mb-5">Project Details</h3>
              {[
                { k: 'Client', v: cs.client },
                { k: 'Sector', v: cs.sector },
                { k: 'Year', v: cs.year },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <span className="font-dm text-[12px] uppercase tracking-[0.12em] text-[#64748B]">{k}</span>
                  <span className="font-mono text-[12px] text-[#1B6FCC]">{v}</span>
                </div>
              ))}
              <div className="pt-4">
                <span className="font-dm text-[12px] uppercase tracking-[0.12em] text-[#64748B] block mb-3">Systems Used</span>
                <div className="flex flex-wrap gap-2">
                  {cs.systems.map((s) => (
                    <span key={s} className="font-mono text-[11px] text-[#1F2330] bg-white border border-[#E2E8F0] px-3 py-[4px] rounded-[2px]">{s}</span>
                  ))}
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-6 block w-full text-center bg-[#1B6FCC] text-white px-5 py-3 font-dm font-semibold text-[12.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] transition-colors"
              >
                Discuss a Similar Project
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
