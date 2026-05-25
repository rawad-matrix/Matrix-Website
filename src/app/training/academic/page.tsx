import { TrainingSubPage } from '@/components/sections/TrainingSubPage'

export const metadata = { title: 'Academic Training — Matrix Energy & Automation' }

export default function AcademicTrainingPage() {
  return (
    <TrainingSubPage
      crumb="Academic"
      titleLine1="Academic"
      titleAccent="Training."
      subtitle="Face-to-face cohort programs at the Matrix facility. Structured curriculum, working PLC hardware, and instructors who commission real systems for a living."
      stats={[
        { label: 'Format', value: 'In-person · Beirut' },
        { label: 'Cohort Size', value: '8–12 students' },
        { label: 'Duration', value: '4–12 weeks' },
        { label: 'Schedule', value: 'Weekdays · 09:00–13:00' },
        { label: 'Certificate', value: 'Matrix EA' },
        { label: 'Next Intake', value: 'Sept 2026' },
      ]}
      sectionLabel="Curriculum"
      sectionTitle="What You'll Learn."
      modules={[
        { num: '01', title: 'PLC Fundamentals', desc: 'Ladder logic, function blocks, structured text. Hands-on wiring from day one using Siemens S7-1200 and Delta DVP hardware.' },
        { num: '02', title: 'Siemens TIA Portal', desc: 'Full TIA Portal workflow — project setup, I/O configuration, program download, online diagnostics, and safety basics.' },
        { num: '03', title: 'HMI Design', desc: 'Siemens WinCC Comfort and Unified panels. Screen navigation, alarms, trends, and user management for industrial UIs.' },
        { num: '04', title: 'SCADA Architecture', desc: 'Data acquisition, historian, OPC-UA connectivity, and building supervisory dashboards using industry-standard platforms.' },
        { num: '05', title: 'Drives & Motors', desc: 'VFD commissioning with Danfoss and Veichi drives, motor protection relay settings, and energy optimisation routines.' },
        { num: '06', title: 'Capstone Project', desc: 'A full mini-automation system designed, wired, programmed, and presented by each team. Assessed by senior engineers.' },
      ]}
      whoLabel="Who It's For"
      whoTitle="Ideal Candidates."
      whoCards={[
        { title: 'Fresh Engineering Grads', desc: 'EE, ME, or mechatronics graduates who need hands-on industrial experience before entering the workforce.' },
        { title: 'Career Switchers', desc: 'Professionals from IT, maintenance, or general engineering who want to move into industrial automation roles.' },
        { title: 'Final-Year Students', desc: 'University students who want to complete a technical internship with a verifiable capstone project and certificate.' },
      ]}
      ctaTitle="Ready to Enroll?"
      ctaDesc="Next cohort starts September 2026. Limited to 12 seats. Apply early to secure your place."
      ctaButton="Request Application Form"
    />
  )
}
