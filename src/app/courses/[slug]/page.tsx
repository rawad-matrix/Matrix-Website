import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactStrip } from '@/components/sections/ContactStrip'

const COURSES: Record<string, {
  title: string; level: string; hours: number; price: number; category: string;
  description: string; longDesc: string;
  modules: { n: string; title: string; desc: string }[];
  outcomes: string[];
  prerequisites: string;
}> = {
  'siemens-tia-portal': {
    title: 'Siemens TIA Portal PLC Programming',
    level: 'Advanced', hours: 40, price: 299, category: 'PLC',
    description: 'Master Siemens\' flagship engineering environment from first project creation through advanced library design. Built and taught by Matrix engineers who deploy TIA Portal on plant floors every week.',
    longDesc: 'TIA Portal is the engineering backbone of every Siemens deployment from the S7-1200 to the S7-1500. This 40-hour intensive moves from the absolute basics through to production-grade library design and HMI integration. You\'ll work on real S7-1500 hardware throughout — no simulators alone. By the end you will have programmed, commissioned and documented a small process from scratch.',
    modules: [
      { n: '01', title: 'Environment & Project Setup', desc: 'Workspaces, project structure, version control basics.' },
      { n: '02', title: 'S7-1200 / 1500 Hardware', desc: 'CPUs, signal modules, addressing, configuration.' },
      { n: '03', title: 'Ladder Logic', desc: 'Bits, timers, counters, comparison, math.' },
      { n: '04', title: 'Function Blocks & Functions', desc: 'Reusable code, instance data, libraries.' },
      { n: '05', title: 'Structured Text', desc: 'SCL syntax for complex routines.' },
      { n: '06', title: 'Data Types & UDTs', desc: 'Custom structures, arrays, optimised vs standard blocks.' },
      { n: '07', title: 'Communication', desc: 'Profinet, S7, OPC UA, GET/PUT.' },
      { n: '08', title: 'Diagnostics & Debugging', desc: 'Watch tables, trace, system diagnostics.' },
      { n: '09', title: 'HMI Integration', desc: 'Tag linking with WinCC Unified basics.' },
      { n: '10', title: 'Library Development', desc: 'Building your own reusable function library.' },
      { n: '11', title: 'Safety & Best Practices', desc: 'Naming, comments, scaling, documentation.' },
      { n: '12', title: 'Capstone Project', desc: 'End-to-end program for a real process simulator.' },
    ],
    outcomes: [
      'Configure S7-1200 / 1500 hardware confidently',
      'Write production-quality ladder and SCL code',
      'Design reusable function blocks and libraries',
      'Diagnose and troubleshoot a running PLC',
      'Integrate the PLC with a basic HMI',
      'Document your project for handover',
    ],
    prerequisites: 'Basic electrical knowledge. Familiarity with any PLC platform is helpful but not required.',
  },
  'delta-plc': {
    title: 'Delta PLC Programming',
    level: 'Intermediate', hours: 24, price: 199, category: 'PLC',
    description: 'Complete Delta ISPSoft programming for DVP and AS series PLCs with real industrial applications.',
    longDesc: 'Delta PLCs are widely deployed across Lebanese and regional industry. This 24-hour course covers the full Delta ISPSoft environment, from hardware configuration through to analog I/O, communication and HMI integration on Delta screens.',
    modules: [
      { n: '01', title: 'Delta Hardware Overview', desc: 'DVP and AS series CPUs, I/O modules, wiring.' },
      { n: '02', title: 'ISPSoft Introduction', desc: 'Environment setup, project creation, I/O addressing.' },
      { n: '03', title: 'Ladder Logic Basics', desc: 'Contacts, coils, timers, counters.' },
      { n: '04', title: 'Analog I/O', desc: 'Scaling, PID control, temperature input.' },
      { n: '05', title: 'Structured Text in ISPSoft', desc: 'ST programming for complex logic.' },
      { n: '06', title: 'Communication', desc: 'Modbus RTU/TCP, RS-485, Delta HMI link.' },
      { n: '07', title: 'Delta HMI Integration', desc: 'DOPSoft basics, tag connection, alarm pages.' },
      { n: '08', title: 'Capstone Project', desc: 'Complete process control application.' },
    ],
    outcomes: [
      'Configure Delta DVP and AS series hardware',
      'Write ladder and ST programs in ISPSoft',
      'Implement analog control and PID loops',
      'Connect PLCs over Modbus and serial networks',
      'Build basic Delta HMI screens',
    ],
    prerequisites: 'Basic electrical knowledge required. No prior PLC experience needed.',
  },
  'eplan-electric-p8': {
    title: 'EPLAN Electric P8',
    level: 'Intermediate', hours: 32, price: 229, category: 'Electrical',
    description: 'Professional electrical panel design — schematics, parts management, reports and automated documentation.',
    longDesc: 'EPLAN Electric P8 is the industry standard for professional electrical panel documentation. This 32-hour course covers the complete workflow from project setup through schematic capture, parts list generation and professional PDF report output.',
    modules: [
      { n: '01', title: 'EPLAN Environment', desc: 'Interface, project structure, settings.' },
      { n: '02', title: 'Project Setup', desc: 'Standards, templates, title blocks.' },
      { n: '03', title: 'Schematics', desc: 'Symbols, connections, cross-references.' },
      { n: '04', title: 'Parts Management', desc: 'Database, article numbers, macros.' },
      { n: '05', title: 'Device Lists', desc: 'Automatic BOM generation and editing.' },
      { n: '06', title: 'Cable Documentation', desc: 'Cable routing, wire numbering.' },
      { n: '07', title: 'Reports & Outputs', desc: 'PDF generation, terminal diagrams.' },
      { n: '08', title: 'Real Panel Project', desc: 'Complete panel package from scratch.' },
    ],
    outcomes: [
      'Create professional electrical schematics',
      'Manage parts database and BOMs',
      'Generate complete documentation packages',
      'Use EPLAN macros and templates efficiently',
      'Produce terminal and cable reports',
    ],
    prerequisites: 'Basic electrical knowledge. Computer literacy required.',
  },
  'scada-hmi-development': {
    title: 'SCADA & HMI Development',
    level: 'Advanced', hours: 36, price: 279, category: 'SCADA',
    description: 'Design and implement industrial SCADA systems and operator HMI interfaces using Siemens WinCC.',
    longDesc: 'SCADA and HMI are the operator\'s window into the automation system. This advanced 36-hour course covers complete SCADA architecture design, WinCC project configuration, alarm management, historian setup and remote access configuration.',
    modules: [
      { n: '01', title: 'SCADA Architecture', desc: 'System design, redundancy, remote I/O.' },
      { n: '02', title: 'WinCC Project Setup', desc: 'Server/client, tag management.' },
      { n: '03', title: 'Graphic Design', desc: 'Faceplate library, process mimic best practices.' },
      { n: '04', title: 'Alarm Management', desc: 'Alarm philosophy, priority, acknowledgement.' },
      { n: '05', title: 'Trending & Historian', desc: 'Historical data, reports, analysis.' },
      { n: '06', title: 'Communication', desc: 'OPC UA, Profinet, third-party drivers.' },
      { n: '07', title: 'Security', desc: 'User management, OT network segmentation.' },
      { n: '08', title: 'Remote Access', desc: 'VPN, WebNavigator, mobile HMI.' },
      { n: '09', title: 'FAT & Documentation', desc: 'Testing, handover documentation.' },
      { n: '10', title: 'Capstone Project', desc: 'Full SCADA for a simulated process plant.' },
    ],
    outcomes: [
      'Design SCADA architecture for industrial sites',
      'Configure WinCC server/client systems',
      'Build professional process graphics',
      'Implement alarm and historian systems',
      'Configure OPC UA communication',
    ],
    prerequisites: 'PLC programming experience required (any platform). Basic networking knowledge helpful.',
  },
  'battery-systems-storage': {
    title: 'Battery Systems & Storage',
    level: 'Intermediate', hours: 20, price: 179, category: 'Energy',
    description: 'Battery chemistry, BMS systems, sizing methodologies and integration with solar and grid systems.',
    longDesc: 'Battery storage has become essential for Lebanese industry facing grid reliability challenges. This 20-hour course covers lithium battery chemistry, BMS architecture, sizing methodologies for industrial and commercial applications, and integration with solar inverters and energy management systems.',
    modules: [
      { n: '01', title: 'Battery Chemistry', desc: 'Li-ion, LFP, NMC — cell to pack.' },
      { n: '02', title: 'BMS Architecture', desc: 'Cell balancing, protection, communication.' },
      { n: '03', title: 'Sizing Methodology', desc: 'Load analysis, autonomy, DoD calculations.' },
      { n: '04', title: 'Solar Integration', desc: 'Inverter types, DC coupling, AC coupling.' },
      { n: '05', title: 'Grid Integration', desc: 'UPS mode, peak shaving, demand response.' },
      { n: '06', title: 'Installation & Safety', desc: 'Wiring, protection, thermal management.' },
      { n: '07', title: 'Monitoring & Commissioning', desc: 'Modbus, SNMP, SOC calibration.' },
    ],
    outcomes: [
      'Select the right battery chemistry for the application',
      'Size battery storage for industrial loads',
      'Integrate ESS with solar and grid',
      'Configure BMS communication and monitoring',
      'Commission and troubleshoot a battery system',
    ],
    prerequisites: 'Basic electrical knowledge. Understanding of DC circuits.',
  },
  'veichi-vfd-servo': {
    title: 'Veichi VFD & Servo',
    level: 'Beginner', hours: 16, price: 149, category: 'Drives',
    description: 'Variable frequency drive and servo motor control — parameter setup, PID tuning and practical troubleshooting.',
    longDesc: 'Veichi drives and servos are widely used across Lebanese industry. This practical 16-hour course covers the complete setup, parameter configuration, control wiring, PID tuning and fault diagnosis workflow for Veichi AC drives and servo systems.',
    modules: [
      { n: '01', title: 'AC Drive Fundamentals', desc: 'V/F and vector control principles.' },
      { n: '02', title: 'Veichi AC10/AC300 Hardware', desc: 'Wiring, control terminals, encoder input.' },
      { n: '03', title: 'Parameter Configuration', desc: 'Motor data, run modes, protection settings.' },
      { n: '04', title: 'PID Control', desc: 'Feedback, setpoint, tuning for pump/fan.' },
      { n: '05', title: 'Communication', desc: 'Modbus RTU, RS-485 PLC integration.' },
      { n: '06', title: 'Servo SD700 Introduction', desc: 'Servo drive wiring, motor tuning, homing.' },
    ],
    outcomes: [
      'Wire and configure Veichi AC drives',
      'Set motor parameters and protection',
      'Implement and tune PID speed control',
      'Connect drives over Modbus to PLCs',
      'Diagnose common VFD faults',
    ],
    prerequisites: 'No prior experience required. Basic electrical safety awareness helpful.',
  },
  'vfd-fundamentals': {
    title: 'VFD Fundamentals',
    level: 'Beginner', hours: 12, price: 129, category: 'Drives',
    description: 'Core principles of variable frequency drives — motor selection, energy savings, installation and basic programming.',
    longDesc: 'Variable frequency drives control speed and save energy in pump, fan, conveyor and compressor applications. This 12-hour foundation course teaches the principles of VFD operation that apply across all brands and platforms.',
    modules: [
      { n: '01', title: 'AC Motor Principles', desc: 'Induction motor operation, speed, torque.' },
      { n: '02', title: 'VFD Topology', desc: 'Rectifier, DC bus, inverter, PWM.' },
      { n: '03', title: 'Control Modes', desc: 'V/F, closed-loop vector, torque control.' },
      { n: '04', title: 'Sizing & Selection', desc: 'Load types, duty cycle, IP rating.' },
      { n: '05', title: 'Installation', desc: 'Wiring, cable screening, EMC compliance.' },
      { n: '06', title: 'Energy Savings', desc: 'Affinity laws, payback calculation.' },
      { n: '07', title: 'Fault Finding', desc: 'Common faults and diagnostic approach.' },
    ],
    outcomes: [
      'Explain how a VFD controls motor speed',
      'Select an appropriate VFD for a given load',
      'Wire and install a VFD safely',
      'Configure basic startup parameters',
      'Calculate energy savings from VFD retrofit',
    ],
    prerequisites: 'No prior experience required. Basic electrical safety awareness helpful.',
  },
}

export async function generateStaticParams() {
  return Object.keys(COURSES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = COURSES[params.slug]
  return { title: c ? c.title : 'Course' }
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const c = COURSES[params.slug]

  if (!c) {
    return (
      <div className="py-40 text-center">
        <h1 className="font-barlow text-[40px] uppercase">Course not found</h1>
        <Link href="/courses" className="text-[#1B6FCC] mt-4 block">← Back to Courses</Link>
      </div>
    )
  }

  const enrollHref = `/auth/sign-in?redirect=/checkout?course=${params.slug}`

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#F8F9FB] border-b border-[#E2E8F0] py-[14px]">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
          <nav className="flex gap-[10px] items-center text-[12px] uppercase tracking-[0.18em] text-[#64748B] font-dm font-medium">
            <Link href="/" className="text-[#1F2330] hover:text-[#1B6FCC] transition-colors">Home</Link>
            <span className="opacity-50">›</span>
            <Link href="/training" className="text-[#1F2330] hover:text-[#1B6FCC] transition-colors">Training</Link>
            <span className="opacity-50">›</span>
            <span className="text-[#1B6FCC]">{c.title}</span>
          </nav>
        </div>
      </div>

      {/* Course hero */}
      <section
        className="relative overflow-hidden py-[60px] pb-[72px]"
        style={{ background: '#2A2F3A', color: '#fff' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(27,111,204,.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(27,111,204,.10) 0%, transparent 50%)`,
          }}
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-8 max-[640px]:px-5 grid grid-cols-[1.5fr_1fr] gap-12 items-start max-[900px]:grid-cols-1">
          <div>
            <span className="inline-block font-mono text-[11px] uppercase tracking-[0.22em] px-3 py-[5px] rounded-[2px] mb-5 text-[#1B6FCC]" style={{ border: '1px solid #1B6FCC' }}>
              {c.level} · {c.hours} hours
            </span>
            <h1
              className="font-barlow font-extrabold uppercase text-white mb-4"
              style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: '0.98' }}
            >
              {c.title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-[#1B6FCC]">{c.title.split(' ').slice(-1)}</span>
            </h1>
            <p className="font-dm text-[16px] leading-[1.6] max-w-[560px]" style={{ color: 'rgba(255,255,255,.78)' }}>
              {c.description}
            </p>
          </div>

          {/* Sidebar metadata card */}
          <aside
            className="rounded-[2px] p-6"
            style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,178,0,.18)' }}
          >
            {[
              { l: 'Level', v: c.level },
              { l: 'Duration', v: `${c.hours} hours` },
              { l: 'Format', v: 'In-person + lab' },
              { l: 'Cohort', v: '8–14 trainees' },
              { l: 'Language', v: 'English / Arabic' },
              { l: 'Certificate', v: 'Matrix EA' },
            ].map(({ l, v }) => (
              <div
                key={l}
                className="flex justify-between py-3 text-[13.5px]"
                style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}
              >
                <span className="font-dm uppercase tracking-[0.1em] text-[11px] font-medium" style={{ color: 'rgba(255,255,255,.55)' }}>{l}</span>
                <span className="font-mono" style={{ color: '#1B6FCC' }}>{v}</span>
              </div>
            ))}

            {/* Price */}
            <div className="flex items-center gap-3 py-4 mt-2">
              <span className="font-mono text-[32px] text-white font-medium leading-none">${c.price}</span>
              <span className="font-dm text-[12px] text-white/50 uppercase tracking-[0.1em]">USD</span>
            </div>

            <Link
              href={enrollHref}
              className="block w-full text-center bg-[#1B6FCC] text-white py-4 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] hover:-translate-y-px transition-all duration-150 mb-3"
            >
              Enroll Now
            </Link>
            <a
              href={`https://wa.me/96171483747?text=Hi%20Matrix%20—%20I'd%20like%20to%20enquire%20about%20the%20${encodeURIComponent(c.title)}%20course.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-transparent text-white py-3 font-dm font-semibold text-[12px] uppercase tracking-[0.04em] rounded-[2px] border border-white/30 hover:border-[#25D366] hover:text-[#25D366] transition-all duration-150"
            >
              Ask on WhatsApp
            </a>
          </aside>
        </div>
      </section>

      {/* Course body */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5 grid grid-cols-[1.5fr_1fr] gap-14 items-start max-[900px]:grid-cols-1">
          <div>
            <h2 className="font-barlow font-bold text-[28px] uppercase text-[#1F2330] mb-4">About This Course</h2>
            <p className="font-dm text-[15.5px] text-[#64748B] leading-[1.75] mb-8">{c.longDesc}</p>

            <h2 className="font-barlow font-bold text-[28px] uppercase text-[#1F2330] mb-5">Course Modules</h2>
            <ul
              className="list-none p-0 m-0 grid overflow-hidden rounded-[2px]"
              style={{ gridTemplateColumns: '1fr 1fr', background: '#E2E8F0', border: '1px solid #E2E8F0', gap: '1px' }}
            >
              {c.modules.map(({ n, title: mtitle, desc }) => (
                <li key={n} className="bg-white p-[18px_20px] flex gap-[14px] text-[14px] text-[#1F2330]">
                  <span className="font-mono text-[#1B6FCC] font-medium flex-shrink-0 text-[13px]">{n}</span>
                  <div>
                    <b className="block font-semibold mb-[2px]">{mtitle}</b>
                    <span className="text-[#64748B] text-[13px] leading-[1.5]">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky outcomes sidebar */}
          <aside
            className="rounded-[2px] p-7 sticky top-[120px] max-[900px]:static"
            style={{ background: '#F8F9FB', border: '1px solid #E2E8F0', borderTop: '4px solid #1B6FCC' }}
          >
            <h3 className="font-barlow font-bold text-[18px] uppercase text-[#1F2330] mb-4">You Will Learn To</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-[10px]">
              {c.outcomes.map((o) => (
                <li key={o} className="flex gap-[10px] items-start font-dm text-[14px] text-[#1F2330]">
                  <span className="text-[#1B6FCC] font-bold flex-shrink-0 mt-[1px]">✓</span>
                  {o}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-[14px] font-dm text-[13.5px] text-[#64748B] leading-[1.7]" style={{ borderTop: '1px solid #E2E8F0' }}>
              <b className="text-[#1F2330] font-semibold text-[11px] uppercase tracking-[0.18em] block mb-[6px]">Prerequisites</b>
              {c.prerequisites}
            </div>
            <Link
              href={enrollHref}
              className="mt-6 block w-full text-center bg-[#1B6FCC] text-white py-3 font-dm font-semibold text-[13px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] transition-colors"
            >
              Enroll — ${c.price}
            </Link>
          </aside>
        </div>
      </section>

      {/* CTA row */}
      <section className="bg-[#2A2F3A] py-16 text-center">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
          <h2
            className="font-barlow font-extrabold uppercase text-white mb-4"
            style={{ fontSize: 'clamp(26px, 3.2vw, 38px)' }}
          >
            Ready to Enroll?
          </h2>
          <p className="font-dm text-[15px] text-white/70 max-w-[520px] mx-auto mb-6 leading-[1.7]">
            Talk to our training team on WhatsApp for the next cohort dates, pricing and a full syllabus.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={enrollHref}
              className="inline-flex items-center gap-2 bg-[#1B6FCC] text-white px-[22px] py-[12px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-[#155AA8] hover:-translate-y-px transition-all duration-150"
            >
              Enroll Now
            </Link>
            <a
              href={`https://wa.me/96171483747?text=Hi%20Matrix%20—%20I'd%20like%20to%20enroll%20in%20the%20${encodeURIComponent(c.title)}%20course.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-[22px] py-[12px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] hover:brightness-110 hover:-translate-y-px transition-all duration-150"
            >
              Enroll via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
