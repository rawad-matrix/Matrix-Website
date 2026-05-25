'use client'

import React from 'react'
import { PageHero } from '@/components/sections/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ContactStrip } from '@/components/sections/ContactStrip'
import Link from 'next/link'
import { useInView } from '@/hooks/useInView'

const EPC = [
  {
    letter: 'E',
    title: 'Engineering',
    desc: 'Feasibility studies, P&ID review, SCADA architecture design, panel schematics in EPLAN, FAT procedures and full documentation packages.',
    items: ['Feasibility & scope definition', 'P&ID and SCADA architecture', 'Panel schematics (EPLAN)', 'FAT / SAT procedures'],
  },
  {
    letter: 'P',
    title: 'Procurement',
    desc: 'Authorised supply of Siemens, ABB, Allen Bradley, Delta and Veichi automation equipment. Technical pre-sales, sizing and logistics managed in-house.',
    items: ['Siemens / ABB / AB authorised', 'Delta & Veichi authorised', 'Technical pre-sales sizing', 'Import logistics & customs'],
  },
  {
    letter: 'C',
    title: 'Construction',
    desc: 'Panel fabrication, site installation, cable management, instrument loop testing, PLC commissioning and operator handover training.',
    items: ['Panel fabrication & wiring', 'Site installation & cabling', 'Loop testing & commissioning', 'Operator handover training'],
  },
]

const SERVICES = [
  { title: 'SCADA System Design', desc: 'Custom SCADA solutions for water, energy and manufacturing using iFIX, WinCC and Ignition platforms.' },
  { title: 'PLC Programming', desc: 'Siemens S7-1200/1500, Allen Bradley CompactLogix/ControlLogix, Delta DVP/AS series.' },
  { title: 'HMI Development', desc: 'Intuitive operator interfaces on Siemens, Weintek, Weinview and Delta HMI panels.' },
  { title: 'Network & Comms', desc: 'Profinet, Profibus, Modbus TCP/RTU, OPC-UA and industrial Ethernet design.' },
  { title: 'Legacy Upgrades', desc: 'Migrating obsolete PLC/SCADA systems with minimal downtime and full data continuity.' },
  { title: 'Cybersecurity', desc: 'OT network segmentation, firewall configuration and ICS security assessments.' },
]

const INDUSTRIES = [
  'Water & Wastewater', 'Food & Beverage', 'Pharmaceuticals',
  'Oil & Gas', 'Power Generation', 'Building Automation',
  'Manufacturing', 'Packaging', 'Mining & Quarrying',
]

const PROCESS = [
  { n: '01', title: 'Scope & Feasibility', desc: 'Site visit, existing system audit, requirements gathering and budget estimate.' },
  { n: '02', title: 'Engineering Design', desc: 'Detailed engineering, P&ID, SCADA architecture, panel schematics and BOM.' },
  { n: '03', title: 'Procurement', desc: 'Equipment sourcing, factory acceptance test (FAT) and logistics to site.' },
  { n: '04', title: 'Installation', desc: 'Panel fabrication, site cabling, instrument installation and pre-commissioning.' },
  { n: '05', title: 'Commissioning', desc: 'Loop testing, PLC/SCADA commissioning, site acceptance test (SAT).' },
  { n: '06', title: 'Handover & Support', desc: 'Documentation package, operator training and ongoing maintenance agreement.' },
]

export default function SystemIntegratorPage() {
  const { ref: epcRef, inView: epcInView } = useInView()
  const { ref: processRef, inView: processInView } = useInView()
  return (
    <>
      <PageHero
        title="System Integrator"
        subtitle="End-to-end EPC delivery for industrial automation and energy systems."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'System Integrator' }]}
      />

      {/* What we do intro */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <div className="grid grid-cols-[1.3fr_1fr] gap-16 items-center max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div>
              <SectionHeader label="What We Do" title="Full EPC System Integration." />
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7] mb-4">
                Matrix EA delivers complete Engineering, Procurement and Construction packages for industrial automation projects. We own the project from first concept through commissioning handover — one point of contact, one contract, zero finger-pointing.
              </p>
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7]">
                With 21 years and over 1,200 completed projects, we have delivered for water utilities, food processors, power plants, pharmaceutical manufacturers and OEMs across Lebanon, Iraq, Saudi Arabia and Africa.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-matrix-border">
                {[['1200+', 'Projects'], ['21', 'Years'], ['99%', 'Satisfaction']].map(([n, l]) => (
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
                Why EPC?
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {[
                  'Single-vendor accountability from design to commissioning',
                  'Optimised lead times through parallel engineering and procurement',
                  'Consistent documentation and standards throughout',
                  'Reduced project risk with one experienced team',
                ].map((item) => (
                  <li
                    key={item}
                    className="font-dm text-[15px] text-white/80 py-3 flex gap-3 items-start"
                    style={{ borderLeft: '2px solid rgba(27,111,204,.55)', paddingLeft: '14px' }}
                  >
                    {item}
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
          <SectionHeader label="Our Process" title="Engineering. Procurement. Construction." centered />
          <div ref={epcRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
            {EPC.map(({ letter, title, desc, items }, i) => (
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
                <h3 className="font-barlow font-bold text-[24px] uppercase text-matrix-navy mb-3">{title}</h3>
                <p className="font-dm text-[14.5px] text-matrix-muted leading-[1.6] mb-5">{desc}</p>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item} className="font-dm text-[13.5px] text-matrix-ink flex items-start gap-2">
                      <span className="text-matrix-blue font-bold mt-px">›</span> {item}
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
          <SectionHeader label="Capabilities" title="Technical Services." />
          <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xs p-[28px_24px]"
                style={{ border: '1px solid #E2E8F0', borderLeft: '3px solid #1B6FCC' }}
              >
                <h4 className="font-barlow font-bold text-[20px] uppercase text-matrix-navy mb-2">{s.title}</h4>
                <p className="font-dm text-[14px] text-matrix-muted leading-[1.6] m-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-matrix-off py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label="Sectors" title="Industries We Serve." />
          <div
            className="grid grid-cols-3 max-[600px]:grid-cols-1 max-[900px]:grid-cols-2 rounded-xs overflow-hidden"
            style={{ border: '1px solid #E2E8F0', gap: '1px', background: '#E2E8F0' }}
          >
            {INDUSTRIES.map((ind) => (
              <div
                key={ind}
                className="bg-matrix-off p-[32px_28px] font-barlow font-bold text-[20px] uppercase text-matrix-navy transition-colors hover:bg-white"
              >
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label="Methodology" title="How We Deliver." centered />
          <div ref={processRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {PROCESS.map(({ n, title, desc }, i) => (
              <div
                key={n}
                className={`reveal ${processInView ? 'in-view' : ''}`}
                style={{ transitionDelay: processInView ? '0ms' : `${i * 60}ms` }}
              >
                <div
                  className="bg-matrix-off rounded-xs p-[28px_26px] h-full transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    border: '1px solid #E2E8F0',
                    borderTop: '3px solid transparent',
                    backgroundClip: 'padding-box',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderTopColor = '#1B6FCC' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderTopColor = 'transparent' }}
                >
                <span className="font-mono text-[13px] text-matrix-blue font-medium block mb-3">{n}</span>
                <h4 className="font-barlow font-bold text-[20px] uppercase text-matrix-navy mb-2">{title}</h4>
                <p className="font-dm text-[14px] text-matrix-muted leading-[1.6] m-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
