'use client'
import { useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { useCountUp } from '@/hooks/useCountUp'

type StatProps = { projects?: number; clients?: number; years?: number; satisfaction?: number }

function StatItem({ n, suffix, label, active }: { n: number; suffix: string; label: string; active: boolean }) {
  const val = useCountUp(n, 1400, active)
  return (
    <div
      className="flex flex-col gap-[6px] px-3 border-r border-[rgba(42,47,58,.12)] last:border-r-0"
    >
      <span
        className="font-mono font-medium leading-none"
        style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', letterSpacing: '-0.03em', color: '#2A2F3A' }}
      >
        {val}{suffix}
      </span>
      <span className="font-dm font-medium text-[12px] uppercase tracking-[0.22em] text-[#64748B]">
        {label}
      </span>
    </div>
  )
}

export function StatsCounter({ stats = {} }: { stats?: StatProps }) {
  const { projects = 1200, clients = 800, years = 21, satisfaction = 99 } = stats
  const containerRef = useRef<HTMLElement | null>(null)
  const { ref, inView } = useInView(0.2)

  const STATS = [
    { n: projects, suffix: '+', label: 'Projects Completed' },
    { n: clients, suffix: '+', label: 'Satisfied Clients' },
    { n: years, suffix: '', label: 'Years Experience' },
    { n: satisfaction, suffix: '%', label: 'Satisfaction Rate' },
  ]

  return (
    <section
      ref={(el) => { ref.current = el; containerRef.current = el }}
      className="relative overflow-hidden py-10 md:py-16"
      style={{
        background: '#F4F6FA',
        borderTop: '3px solid #1B6FCC',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      {/* Stripe overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent 0 80px, rgba(42,47,58,.06) 80px 81px)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-8 max-[640px]:px-5">
        <div className="grid grid-cols-4 gap-8 max-[768px]:grid-cols-2 max-[768px]:gap-6">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} active={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
