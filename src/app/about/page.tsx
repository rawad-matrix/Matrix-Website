export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatsCounter } from '@/components/sections/StatsCounter'
import { ContactStrip } from '@/components/sections/ContactStrip'
import { createClient } from '@/lib/supabase/server'
import { textOverridesFrom, makeTx } from '@/lib/site-text'

export const metadata: Metadata = { title: 'About' }

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    return Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value as string]))
  } catch {
    return {}
  }
}

const TIMELINE_KEYS = [1, 2, 3, 4, 5]

export default async function AboutPage() {
  const s = await getSiteSettings()
  const texts = textOverridesFrom(s)
  const t = makeTx(texts)

  const stats = {
    projects:     s.stat_projects     ? parseInt(s.stat_projects)     : undefined,
    clients:      s.stat_clients      ? parseInt(s.stat_clients)      : undefined,
    years:        s.stat_years        ? parseInt(s.stat_years)        : undefined,
    satisfaction: s.stat_satisfaction ? parseInt(s.stat_satisfaction) : undefined,
  }

  return (
    <>
      <PageHero
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      {/* Story section */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <div className="grid grid-cols-2 gap-16 items-start max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div>
              <SectionHeader label={t('about.story.label')} title={t('about.story.title')} />
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7] mb-4">
                {t('about.story.p1')}
              </p>
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7] mb-4">
                {t('about.story.p2')}
              </p>
              <p className="font-dm text-[16px] text-matrix-muted leading-[1.7]">
                {t('about.story.p3')}
              </p>
            </div>
            {/* Mission box */}
            <div className="rounded-xs p-10 bg-matrix-navy border-t-4 border-t-matrix-blue">
              <h3 className="font-barlow font-bold text-[28px] uppercase text-white mb-5">{t('about.mission.title')}</h3>
              <p className="font-dm text-[15.5px] text-white/75 leading-[1.7] mb-6">
                {t('about.mission.p')}
              </p>
              <div className="flex flex-col gap-3">
                {[t('about.mission.item1'), t('about.mission.item2'), t('about.mission.item3')].map((v) => (
                  <div key={v} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-matrix-blue shrink-0" />
                    <span className="font-dm text-[14px] text-white/80">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsCounter stats={stats} />

      {/* Timeline */}
      <section className="bg-white py-27.5 max-[768px]:py-18">
        <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
          <SectionHeader label={t('about.history.label')} title={t('about.history.title')} centered />
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {TIMELINE_KEYS.map((n) => (
              <div
                key={n}
                className="bg-matrix-off rounded-xs p-7"
                style={{ border: '1px solid #E2E8F0', borderTop: '3px solid #1B6FCC' }}
              >
                <span className="font-mono text-[13px] text-matrix-blue font-medium block mb-2">{t(`about.timeline.${n}.year`)}</span>
                <h4 className="font-barlow font-bold text-[20px] uppercase text-matrix-navy mb-2">{t(`about.timeline.${n}.title`)}</h4>
                <p className="font-dm text-[14px] text-matrix-muted leading-[1.6] m-0">{t(`about.timeline.${n}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactStrip texts={texts} />
    </>
  )
}
