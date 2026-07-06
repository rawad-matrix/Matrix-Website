import Link from 'next/link'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { createClient } from '@/lib/supabase/server'
import type { CaseStudy } from '@/types/database'

async function getFeaturedCases(): Promise<CaseStudy[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3)
    if (error) console.error('[case-studies-preview]', error.message)
    return data ?? []
  } catch (err) {
    console.error('[case-studies-preview] client error:', err)
    return []
  }
}

export async function CaseStudiesPreview() {
  const cases = await getFeaturedCases()

  return (
    <section
      className="py-[clamp(48px,6vh,80px)] relative min-h-[calc(100vh-72px)] flex items-center"
      style={{ background: '#0A0A12' }}
    >
      {/* Subtle circuit overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(27,111,204,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,111,204,.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-8 max-[640px]:px-5 w-full">
        <div className="mb-12">
          <SectionHeader label="Recent Work" title="Projects That Prove the Point." light />
        </div>

        {cases.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-4.5">
            {cases.map((c, i) => (
              <Link
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                className="group relative overflow-hidden rounded-xs bg-[#0A0A12] text-white cursor-pointer"
                style={{ height: 'clamp(280px, 38vh, 460px)' }}
              >
                <span className="absolute top-6 right-6 z-10 font-mono text-[11px] tracking-widest text-white/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Image or gradient */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  {c.image_url ? (
                    <Image src={c.image_url} alt={c.title} fill style={{ objectFit: 'contain' }} sizes="(max-width: 900px) 100vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2a4a70 0%, #2A2F3A 90%)' }} />
                  )}
                </div>
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(42,47,58,.92) 95%)' }}
                />
                {/* Content */}
                <div className="absolute left-0 right-0 bottom-0 p-7 z-10">
                  {c.tag && (
                    <span className="inline-block text-white font-dm font-semibold text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1.25 rounded-xs mb-3.5 bg-matrix-blue">
                      {c.tag}
                    </span>
                  )}
                  <h4 className="font-barlow font-bold text-[24px] uppercase text-white mb-2 leading-[1.1]">
                    {c.title}
                  </h4>
                  <div className="flex items-center gap-3.5 text-[12.5px] text-white/70">
                    {c.client && <span>{c.client}</span>}
                    {c.year && <span>· {c.year}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white/40 font-dm text-[15px] text-center mt-8">No featured projects yet.</p>
        )}

        {/* View All — bottom center */}
        <div className="flex justify-center mt-12">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 px-5.5 py-3 font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-xs border btn-ghost-dark"
          >
            View All Case Studies
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
