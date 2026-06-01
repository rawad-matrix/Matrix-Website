'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCountUp } from '@/hooks/useCountUp'
import { useInView } from '@/hooks/useInView'

const SLIDES = [
  {
    gradient: 'linear-gradient(135deg, rgba(27,111,204,.35) 0%, rgba(10,10,18,.95) 100%)',
    label: 'Industrial Automation',
  },
  {
    gradient: 'linear-gradient(135deg, rgba(220,38,38,.25) 0%, rgba(10,10,18,.95) 100%)',
    label: 'SCADA Systems',
  },
  {
    gradient: 'linear-gradient(135deg, rgba(34,197,94,.18) 0%, rgba(10,10,18,.95) 100%)',
    label: 'PLC Programming',
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { ref: statsRef, inView } = useInView(0.3)
  const c1 = useCountUp(1200, 1400, inView)
  const c2 = useCountUp(800, 1400, inView)
  const c3 = useCountUp(21, 1400, inView)

  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % SLIDES.length)
    }, 4000)
  }

  useEffect(() => {
    startInterval()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function goTo(idx: number) {
    setCurrentSlide(idx)
    startInterval()
  }

  return (
    <header
      className="relative min-h-screen flex items-center"
      style={{ background: '#0A0A12' }}
    >
      {/* Base gradient layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(115deg, rgba(42,47,58,.88) 0%, rgba(42,47,58,.65) 55%, rgba(42,47,58,.40) 100%),
            radial-gradient(ellipse at 30% 50%, rgba(27,111,204,.08) 0%, transparent 60%)
          `,
        }}
      />
      {/* Circuit grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(27,111,204,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,111,204,.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Image slider — replaces the right decorative panel */}
      <div
        className="absolute right-0 top-0 bottom-0 hidden lg:block pointer-events-none"
        style={{
          width: '40%',
          clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{
              opacity: i === currentSlide ? 1 : 0,
              background: slide.gradient,
              borderLeft: '1px solid rgba(27,111,204,.18)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(110deg, rgba(255,255,255,.018) 0 2px, transparent 2px 14px)',
              }}
            />
            <span
              className="absolute font-mono text-[11px] uppercase tracking-[0.2em] left-8 bottom-8"
              style={{ color: 'rgba(255,255,255,.32)' }}
            >
              {slide.label}
            </span>
          </div>
        ))}
      </div>

      {/* Slider controls — need pointer-events, so outside the no-pointer-events wrapper */}
      <div
        className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center pointer-events-auto"
        style={{ width: '40%', clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        {/* Prev arrow */}
        <button
          onClick={() => goTo((currentSlide - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-matrix-navy/80 text-white flex items-center justify-center hover:bg-matrix-blue transition-colors duration-150"
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        {/* Next arrow */}
        <button
          onClick={() => goTo((currentSlide + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-matrix-navy/80 text-white flex items-center justify-center hover:bg-matrix-blue transition-colors duration-150"
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                background: i === currentSlide ? '#1B6FCC' : 'rgba(255,255,255,.4)',
                transform: i === currentSlide ? 'scale(1.35)' : 'scale(1)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 max-[640px]:px-5 w-full py-[clamp(48px,6vh,96px)]">
        {/* Tag pill */}
        <div
          className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-xs animate-fade-in"
          style={{
            background: 'rgba(27,111,204,.12)',
            border: '1px solid rgba(27,111,204,.35)',
            animationDelay: '0ms',
            animationFillMode: 'both',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-matrix-red animate-pulse-red shrink-0" />
          <span className="font-dm font-semibold text-[11px] uppercase tracking-[0.28em] text-white/80">
            Automation & Energy Solutions
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-barlow font-extrabold uppercase text-white mb-8 max-w-195 animate-fade-in-up"
          style={{
            fontSize: 'clamp(44px, 7.2vw, 86px)',
            lineHeight: '0.95',
            letterSpacing: '-0.01em',
            animationDelay: '200ms',
            animationFillMode: 'both',
          }}
        >
          Powering{' '}
          <span
            style={{
              WebkitTextStroke: '2px rgba(255,255,255,0.55)',
              color: 'transparent',
            }}
          >
            Lebanon's
          </span>
          <br />
          Industrial{' '}
          <span className="text-matrix-red">Future.</span>
        </h1>

        {/* Lead */}
        <p
          className="font-dm text-[18px] mb-6 max-w-140 animate-fade-in-up"
          style={{ color: 'rgba(255,255,255,.78)', lineHeight: '1.6', animationDelay: '400ms', animationFillMode: 'both' }}
        >
          21 years of SCADA, PLC, and system integration experience across Lebanon,
          Iraq, Saudi Arabia and Africa. Turnkey EPC delivery, 24/7 maintenance, and
          hands-on training that builds your team's independence.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3.5 mb-8 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <Link
            href="/system-integrator"
            className="inline-flex items-center gap-2 bg-matrix-blue text-white px-7 py-4 font-dm font-semibold text-[14px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark hover:-translate-y-px transition-all duration-150"
          >
            Explore Solutions
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 px-7 py-4 font-dm font-semibold text-[14px] uppercase tracking-[0.04em] rounded-xs border btn-ghost-dark"
          >
            Our Case Studies
          </Link>
        </div>

        {/* Stats bar — count-up animation */}
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className="max-w-170 pt-8 grid grid-cols-3 gap-0 animate-fade-in-up"
          style={{ borderTop: '1px solid rgba(255,255,255,.12)', animationDelay: '800ms', animationFillMode: 'both' }}
        >
          {[
            { count: c1, suffix: '+', l: 'Projects' },
            { count: c2, suffix: '+', l: 'Clients' },
            { count: c3, suffix: '', l: 'Years Experience' },
          ].map((s, i) => (
            <div
              key={s.l}
              className="flex flex-col gap-1 px-4 first:pl-0"
              style={i < 2 ? { borderRight: '1px solid rgba(27,111,204,.35)' } : {}}
            >
              <span
                className="font-mono font-medium leading-none"
                style={{ fontSize: '36px', color: '#fff' }}
              >
                <span style={{ color: '#1B6FCC' }}>{s.count.toLocaleString()}</span>{s.suffix}
              </span>
              <span
                className="font-dm font-medium uppercase"
                style={{ fontSize: '11.5px', letterSpacing: '0.18em', color: 'rgba(255,255,255,.6)' }}
              >
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </div>

    </header>
  )
}
