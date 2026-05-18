import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Variant = 'primary' | 'red' | 'ghost' | 'dark' | 'whatsapp' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  external?: boolean
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-[#1B6FCC] text-white hover:bg-[#155AA8] hover:-translate-y-px',
  red:       'bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:-translate-y-px',
  ghost:     'bg-transparent text-white border border-white/45 hover:border-[#1B6FCC] hover:text-[#1B6FCC]',
  dark:      'bg-[#2A2F3A] text-white hover:bg-black hover:-translate-y-px',
  whatsapp:  'bg-[#25D366] text-white hover:brightness-110 hover:-translate-y-px',
  outline:   'bg-transparent text-[#1B6FCC] border border-[#1B6FCC] hover:bg-[#1B6FCC] hover:text-white',
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-[18px] py-[10px] text-[12px]',
  md:  'px-[22px] py-[12px] text-[13.5px]',
  lg:  'px-[28px] py-[16px] text-[14px]',
}

const base = 'font-dm font-semibold uppercase tracking-[0.04em] rounded-[2px] transition-all duration-150 inline-flex items-center gap-2 cursor-pointer shrink-0'

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className)

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
