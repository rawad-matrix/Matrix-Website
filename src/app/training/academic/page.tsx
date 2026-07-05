export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { TrainingSubPage } from '@/components/sections/TrainingSubPage'
import { createClient } from '@/lib/supabase/server'
import { textOverridesFrom, makeTx } from '@/lib/site-text'

export const metadata = { title: 'Academic Training — Matrix Energy & Automation' }

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    return Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value as string]))
  } catch {
    return {}
  }
}

export default async function AcademicTrainingPage() {
  const t = makeTx(textOverridesFrom(await getSiteSettings()))

  return (
    <TrainingSubPage
      crumb="Academic"
      titleLine1={t('tacademic.hero.title1')}
      titleAccent={t('tacademic.hero.accent')}
      subtitle={t('tacademic.hero.subtitle')}
      stats={[
        { label: 'Format', value: t('tacademic.stat1.value') },
        { label: 'Cohort Size', value: t('tacademic.stat2.value') },
        { label: 'Duration', value: t('tacademic.stat3.value') },
        { label: 'Schedule', value: t('tacademic.stat4.value') },
        { label: 'Certificate', value: t('tacademic.stat5.value') },
        { label: 'Next Intake', value: t('tacademic.stat6.value') },
      ]}
      sectionLabel={t('tacademic.modules.label')}
      sectionTitle={t('tacademic.modules.title')}
      modules={[1, 2, 3, 4, 5, 6].map((n) => ({
        num: String(n).padStart(2, '0'),
        title: t(`tacademic.module${n}.title`),
        desc: t(`tacademic.module${n}.desc`),
      }))}
      whoLabel={t('tacademic.who.label')}
      whoTitle={t('tacademic.who.title')}
      whoCards={[1, 2, 3].map((n) => ({
        title: t(`tacademic.who${n}.title`),
        desc: t(`tacademic.who${n}.desc`),
      }))}
      ctaTitle={t('tacademic.cta.title')}
      ctaDesc={t('tacademic.cta.desc')}
      ctaButton={t('tacademic.cta.button')}
    />
  )
}
