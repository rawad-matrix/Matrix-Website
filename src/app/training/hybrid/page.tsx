export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { TrainingSubPage } from '@/components/sections/TrainingSubPage'
import { createClient } from '@/lib/supabase/server'
import { textOverridesFrom, makeTx } from '@/lib/site-text'

export const metadata = { title: 'Hybrid Learning — Matrix Energy & Automation' }

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    return Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value as string]))
  } catch {
    return {}
  }
}

export default async function HybridTrainingPage() {
  const t = makeTx(textOverridesFrom(await getSiteSettings()))

  return (
    <TrainingSubPage
      crumb="Hybrid"
      titleLine1={t('thybrid.hero.title1')}
      titleAccent={t('thybrid.hero.accent')}
      subtitle={t('thybrid.hero.subtitle')}
      stats={[
        { label: 'Format', value: t('thybrid.stat1.value') },
        { label: 'Online Sessions', value: t('thybrid.stat2.value') },
        { label: 'Lab Days', value: t('thybrid.stat3.value') },
        { label: 'Duration', value: t('thybrid.stat4.value') },
        { label: 'Cohort Size', value: t('thybrid.stat5.value') },
        { label: 'Next Intake', value: t('thybrid.stat6.value') },
      ]}
      sectionLabel={t('thybrid.modules.label')}
      sectionTitle={t('thybrid.modules.title')}
      modules={[1, 2, 3, 4, 5, 6].map((n) => ({
        num: String(n).padStart(2, '0'),
        title: t(`thybrid.module${n}.title`),
        desc: t(`thybrid.module${n}.desc`),
      }))}
      whoLabel={t('thybrid.who.label')}
      whoTitle={t('thybrid.who.title')}
      whoCards={[1, 2, 3].map((n) => ({
        title: t(`thybrid.who${n}.title`),
        desc: t(`thybrid.who${n}.desc`),
      }))}
      ctaTitle={t('thybrid.cta.title')}
      ctaDesc={t('thybrid.cta.desc')}
      ctaButton={t('thybrid.cta.button')}
    />
  )
}
