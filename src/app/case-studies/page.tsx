export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/sections/PageHero'
import { ContactStrip } from '@/components/sections/ContactStrip'
import { createClient } from '@/lib/supabase/server'
import type { CaseStudy } from '@/types/database'

export const metadata: Metadata = { title: 'Case Studies' }

async function getCases(): Promise<CaseStudy[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_published', true)
      .order('year', { ascending: false })
    if (error) console.error('[case-studies]', error.message)
    return data ?? []
  } catch (err) {
    console.error('[case-studies] client error:', err)
    return []
  }
}

export default async function CaseStudiesPage() {
  const cases = await getCases()

  return (
    <>
      <PageHero
        title="Case Studies"
        subtitle="Real projects, real results. See how Matrix EA has delivered across industries."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Case Studies' }]}
      />

      <section className="bg-matrix-off py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          {cases.length === 0 ? (
            <p className="text-center text-matrix-muted font-dm text-[16px] py-20">
              No case studies published yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
              {cases.map(({ slug, tag, title, client, year, image_url, systems_used }, i) => (
                <Link
                  key={slug}
                  href={`/case-studies/${slug}`}
                  className="group relative overflow-hidden rounded-xs bg-[#0A0A12] text-white cursor-pointer transition-all duration-250 hover:-translate-y-1"
                  style={{ aspectRatio: '4/5' }}
                >
                  <span className="absolute top-6 right-6 z-10 font-mono text-[11px] tracking-widest text-white/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Image or gradient fallback */}
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {image_url ? (
                      <Image
                        src={image_url}
                        alt={title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2a4a70 0%, #1a2a44 90%)' }} />
                    )}
                  </div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(42,47,58,.92) 95%)' }} />

                  {/* Card content */}
                  <div className="absolute left-0 right-0 bottom-0 p-7 z-10">
                    {tag && (
                      <span className="inline-block bg-matrix-blue text-white font-dm font-semibold text-[10.5px] uppercase tracking-[0.16em] px-2.5 py-1.25 rounded-xs mb-3.5">
                        {tag}
                      </span>
                    )}
                    <h4 className="font-barlow font-bold text-[22px] uppercase text-white mb-2 leading-[1.1]">{title}</h4>
                    <div className="flex items-center gap-3 text-[12.5px] text-white/70 flex-wrap">
                      {client && <span>{client}</span>}
                      {client && year && <span className="w-0.75 h-0.75 rounded-full bg-matrix-blue" />}
                      {year && <span>{year}</span>}
                    </div>
                    {systems_used && systems_used.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {systems_used.map((s) => (
                          <span key={s} className="font-mono text-[10px] text-white/60 bg-white/6 px-2 py-0.75 rounded-xs">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactStrip />
    </>
  )
}
