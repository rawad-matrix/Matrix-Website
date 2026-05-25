import { TrainingSubPage } from '@/components/sections/TrainingSubPage'

export const metadata = { title: 'Hybrid Learning — Matrix Energy & Automation' }

export default function HybridTrainingPage() {
  return (
    <TrainingSubPage
      crumb="Hybrid"
      titleLine1="Hybrid"
      titleAccent="Learning."
      subtitle="Live online theory every week. Hands-on lab intensives at Matrix HQ. Designed for engineers who can't leave their jobs but won't settle for video-only courses."
      stats={[
        { label: 'Format', value: 'Online + Lab visits' },
        { label: 'Online Sessions', value: 'Weekly · 2 hours' },
        { label: 'Lab Days', value: '2–4 visits to HQ' },
        { label: 'Duration', value: '6–10 weeks' },
        { label: 'Cohort Size', value: 'Up to 25 online' },
        { label: 'Next Intake', value: 'Rolling' },
      ]}
      sectionLabel="Program Structure"
      sectionTitle="How Each Week Runs."
      modules={[
        { num: '01', title: 'Live Online Lectures', desc: 'Two-hour instructor-led sessions via video call. Recordings available 24 hours after each session for review.' },
        { num: '02', title: 'Self-Paced Exercises', desc: 'Simulation exercises and reading tasks released after each lecture. Complete on your own schedule before the next session.' },
        { num: '03', title: 'Lab Intensives', desc: 'Two to four full-day visits to the Matrix facility in Beirut. Real PLC racks, real wiring, real commissioning tasks.' },
        { num: '04', title: 'Capstone Exam', desc: 'A timed practical assessment at the lab. Trainees configure, program, and fault-find a live control system from scratch.' },
        { num: '05', title: 'Office Hours', desc: 'Weekly 30-minute open Q&A slot with the lead instructor. Ask anything — course content, career, or engineering problems on your current job.' },
        { num: '06', title: 'Alumni Channel', desc: 'Private group for graduates. Ongoing peer support, job leads, and access to new course materials as the curriculum evolves.' },
      ]}
      whoLabel="Who It's For"
      whoTitle="Who Thrives Here."
      whoCards={[
        { title: 'Working Engineers', desc: 'Employed engineers who want to upskill without taking time off. Online theory fits around shifts; lab visits are scheduled on weekends.' },
        { title: 'Regional Teams', desc: 'Engineers based outside Beirut who can travel for the lab intensives but need online delivery for the theory component.' },
        { title: 'Career Returners', desc: 'Professionals returning after a gap who need to refresh practical skills at a real control panel, not just re-read a textbook.' },
      ]}
      ctaTitle="Join the Next Cohort."
      ctaDesc="Rolling intakes — a new session begins every 4 weeks. Reserve your seat before it fills."
      ctaButton="Reserve Your Seat"
    />
  )
}
