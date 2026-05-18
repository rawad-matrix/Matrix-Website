import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { ContactStrip } from '@/components/sections/ContactStrip'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Case Studies' }

const CASES = [
  { slug: 'coastal-water-treatment', tag: 'Water Treatment', title: 'Coastal Water Treatment SCADA Upgrade', client: 'Lebanese Water Authority', year: '2023', c1: '#2a4a70', c2: '#1a2a44', systems: ['Siemens S7-1500', 'WinCC SCADA', 'Profinet'] },
  { slug: 'automated-packaging-line', tag: 'Manufacturing', title: 'Automated Packaging Line Integration', client: 'Al-Rashed Foods', year: '2022', c1: '#2a3a2a', c2: '#1a2a1a', systems: ['Allen Bradley', 'ControlLogix', 'Vision'] },
  { slug: 'industrial-solar-storage', tag: 'Energy', title: '500kW Industrial Solar + Battery Storage', client: 'Al-Furat Power', year: '2023', c1: '#3a2a10', c2: '#2a2010', systems: ['Huawei Inverters', 'CATL Battery', 'Modbus'] },
  { slug: 'pharmaceutical-hvac', tag: 'Pharmaceutical', title: 'Pharma HVAC & Clean Room Automation', client: 'Middle East Pharma', year: '2022', c1: '#2a2a40', c2: '#1a1a30', systems: ['Siemens S7-1200', 'KNX', 'BACnet'] },
  { slug: 'cement-process-control', tag: 'Industry', title: 'Cement Plant Process Control Upgrade', client: 'Sibline Cement', year: '2021', c1: '#3a3020', c2: '#2a2218', systems: ['ABB AC800M', 'InduSoft', 'Profibus'] },
  { slug: 'port-crane-automation', tag: 'Logistics', title: 'Container Port Crane Automation', client: 'Beirut Port Authority', year: '2020', c1: '#102a3a', c2: '#0a1e2a', systems: ['Siemens S7-400', 'WinCC', 'Profibus DP'] },
]

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        title="Case Studies"
        subtitle="Real projects, real results. See how Matrix EA has delivered across industries."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Case Studies' }]}
      />

      <section className="bg-[#F8F9FB] py-[110px] max-[768px]:py-[72px]">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
          <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
            {CASES.map(({ slug, tag, title, client, year, c1, c2, systems }, i) => (
              <Link
                key={slug}
                href={`/case-studies/${slug}`}
                className="group relative overflow-hidden rounded-[2px] bg-[#0A0A12] text-white cursor-pointer transition-all duration-250 hover:-translate-y-1"
                style={{ aspectRatio: '4/5' }}
              >
                <span className="absolute top-6 right-6 z-10 font-mono text-[11px] tracking-[0.1em] text-white/50">{String(i + 1).padStart(2, '0')}</span>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(45deg, rgba(42,47,58,.15) 0%, transparent 60%), repeating-linear-gradient(110deg, rgba(255,255,255,.04) 0 2px, transparent 2px 14px), linear-gradient(160deg, ${c1} 0%, ${c2} 90%)`,
                  }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(42,47,58,.92) 95%)' }} />
                <div className="absolute left-0 right-0 bottom-0 p-7 z-10">
                  <span className="inline-block bg-[#1B6FCC] text-white font-dm font-semibold text-[10.5px] uppercase tracking-[0.16em] px-[10px] py-[5px] rounded-[2px] mb-[14px]">{tag}</span>
                  <h4 className="font-barlow font-bold text-[22px] uppercase text-white mb-2 leading-[1.1]">{title}</h4>
                  <div className="flex items-center gap-3 text-[12.5px] text-white/70 flex-wrap">
                    <span>{client}</span>
                    <span className="w-[3px] h-[3px] rounded-full bg-[#1B6FCC]" />
                    <span>{year}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {systems.map((s) => (
                      <span key={s} className="font-mono text-[10px] text-white/60 bg-white/6 px-2 py-[3px] rounded-[2px]">{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
