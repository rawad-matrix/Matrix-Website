import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  className?: string
}

export function SectionHeader({ label, title, subtitle, centered, light, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-14', centered && 'text-center', className)}>
      <div className={cn('flex items-center gap-3 mb-3', centered && 'justify-center')}>
        <span className="block w-10 h-0.75 bg-matrix-blue shrink-0" />
        <span className="font-dm text-[12px] font-semibold uppercase tracking-[3px] text-matrix-blue">
          {label}
        </span>
      </div>
      <h2
        className={cn(
          'font-barlow font-extrabold uppercase text-[clamp(34px,4.6vw,52px)] leading-[1.02]',
          light ? 'text-white' : 'text-matrix-ink'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 font-dm text-[16px] md:text-[18px] leading-relaxed max-w-150', light ? 'text-white/70' : 'text-matrix-muted', centered && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
