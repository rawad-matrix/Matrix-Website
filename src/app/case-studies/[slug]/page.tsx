export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/sections/PageHero'
import { ContactStrip } from '@/components/sections/ContactStrip'
import { CaseStudyGallery } from '@/components/sections/CaseStudyGallery'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: cs } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!cs) notFound()

  const allImages: string[] = cs.image_urls && cs.image_urls.length > 0
    ? cs.image_urls
    : cs.image_url
    ? [cs.image_url]
    : []

  return (
    <>
      <PageHero
        title={cs.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Case Studies', href: '/case-studies' },
          { label: cs.tag ?? cs.sector ?? 'Project' },
        ]}
      />

      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">

          {/* Row 1: Gallery + Project Details — same height, sidebar sticky */}
          <div className="grid grid-cols-[1.6fr_1fr] gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-8">

            {/* Interactive gallery */}
            <CaseStudyGallery images={allImages} title={cs.title} />

            {/* Project Details — stretches to gallery height, sticky */}
            <aside
              className="rounded-xs p-7 sticky top-28 flex flex-col justify-between h-full"
              style={{ background: '#F8F9FB', border: '1px solid #E2E8F0', borderTop: '4px solid #1B6FCC' }}
            >
              <div>
                <h3 className="font-barlow font-bold text-[18px] uppercase text-matrix-ink mb-5">Project Details</h3>
                {[
                  { k: 'Client', v: cs.client },
                  { k: 'Sector', v: cs.sector },
                  { k: 'Year', v: cs.year?.toString() },
                ]
                  .filter(({ v }) => v)
                  .map(({ k, v }) => (
                    <div key={k} className="flex justify-between py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <span className="font-dm text-[12px] uppercase tracking-[0.12em] text-matrix-muted">{k}</span>
                      <span className="font-mono text-[12px] text-matrix-blue">{v}</span>
                    </div>
                  ))}
                {cs.systems_used && cs.systems_used.length > 0 && (
                  <div className="pt-4">
                    <span className="font-dm text-[12px] uppercase tracking-[0.12em] text-matrix-muted block mb-3">Systems Used</span>
                    <div className="flex flex-wrap gap-2">
                      {cs.systems_used.map((s: string) => (
                        <span key={s} className="font-mono text-[11px] text-matrix-ink bg-white border border-matrix-border px-3 py-1 rounded-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/contact"
                className="mt-6 block w-full text-center bg-matrix-blue text-white px-5 py-3 font-dm font-semibold text-[12.5px] uppercase tracking-[0.04em] rounded-xs hover:bg-matrix-blue-dark transition-colors"
              >
                Discuss a Similar Project
              </Link>
            </aside>
          </div>

          {/* Row 2: Description — centered */}
          <div className="mt-16 pt-14 max-w-200 mx-auto" style={{ borderTop: '1px solid #E2E8F0' }}>
            {cs.tag && (
              <span className="inline-block bg-matrix-blue text-white font-dm font-semibold text-[11px] uppercase tracking-[0.16em] px-3 py-1.25 rounded-xs mb-5">
                {cs.tag}
              </span>
            )}
            <h2 className="font-barlow font-bold text-[34px] uppercase text-matrix-ink mb-5">{cs.title}</h2>
            {cs.summary && (
              <p className="font-dm text-[16.5px] text-matrix-ink leading-[1.7] mb-5 font-semibold">{cs.summary}</p>
            )}
            {cs.description && (
              <p className="font-dm text-[15.5px] text-matrix-muted leading-[1.85]">{cs.description}</p>
            )}
          </div>

          {/* Row 3: Video — centered, wide */}
          {cs.video_url && (
            <div className="mt-16 max-w-225 mx-auto">
              {/* Section header style */}
              <div className="flex flex-col items-center mb-7">
                <div className="w-10 h-0.75 bg-matrix-blue mb-3" />
                <span className="font-dm text-[11px] uppercase tracking-[3px] text-matrix-blue mb-2">Documentation</span>
                <h3 className="font-barlow font-bold text-[32px] uppercase text-matrix-ink text-center leading-none">
                  Project Video
                </h3>
              </div>
              <div
                className="rounded-xs overflow-hidden"
                style={{ position: 'relative', paddingBottom: '56.25%', height: 0, border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              >
                <iframe
                  src={cs.video_url}
                  title={`${cs.title} — project video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          )}

        </div>
      </section>

      <ContactStrip />
    </>
  )
}
