import { TrainingSubPage } from '@/components/sections/TrainingSubPage'

export const metadata = { title: 'On-the-Job Training — Matrix Energy & Automation' }

export default function OnTheJobTrainingPage() {
  return (
    <TrainingSubPage
      crumb="On-the-Job"
      titleLine1="On-the-Job"
      titleAccent="Training."
      subtitle="We come to your facility. Real plant, real machines, real problems — your team learns by doing, not by watching slides in a classroom."
      stats={[
        { label: 'Format', value: 'On-site · Client facility' },
        { label: 'Group Size', value: '3–20 trainees' },
        { label: 'Duration', value: 'Custom · 1–8 weeks' },
        { label: 'Delivery', value: 'Lecture + lab + shadow' },
        { label: 'Certification', value: 'Matrix + brand-specific' },
        { label: 'Lead Time', value: '3–4 weeks' },
      ]}
      sectionLabel="How It Works"
      sectionTitle="The Four Phases."
      modules={[
        { num: '01', title: 'Skills Audit', desc: 'We interview your team, review your equipment list, and audit current skill gaps before writing a single training objective.' },
        { num: '02', title: 'Curriculum Design', desc: 'A tailored program is drafted around your specific PLCs, drives, and control systems — no generic off-the-shelf content.' },
        { num: '03', title: 'On-Site Delivery', desc: 'Matrix instructors arrive on-site. Morning theory sessions, afternoon live-machine exercises, and shadowing on your actual control panels.' },
        { num: '04', title: 'Assessment & Handoff', desc: 'Trainees complete a practical assessment on your equipment. We deliver a skills matrix report and recommend next steps.' },
      ]}
      whoLabel="Who It's For"
      whoTitle="Best Fit Scenarios."
      whoCards={[
        { title: 'Maintenance Teams', desc: 'Technicians who maintain PLCs and drives daily but have never had formal training on the specific brands installed at their site.' },
        { title: 'Universities & Institutes', desc: 'Technical colleges seeking industrial-grade instruction delivered by practising engineers, not academic lecturers alone.' },
        { title: 'Post-EPC Clients', desc: 'Companies that just took over a Matrix-commissioned system and need their operations team trained on the exact hardware we installed.' },
      ]}
      ctaTitle="Build a Program for Your Team."
      ctaDesc="Tell us about your facility and team size. We'll come back with a scoped proposal in 5 business days."
      ctaButton="Request a Program"
    />
  )
}
