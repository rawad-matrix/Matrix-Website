export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { TrainingSubPage } from '@/components/sections/TrainingSubPage'
import { createClient } from '@/lib/supabase/server'
import { textOverridesFrom, makeTx } from '@/lib/site-text'

export const metadata = { title: 'On-the-Job Training — Matrix Energy & Automation' }

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    return Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value as string]))
  } catch {
    return {}
  }
}

export default async function OnTheJobTrainingPage() {
  const t = makeTx(textOverridesFrom(await getSiteSettings()))

  return (
    <TrainingSubPage
      crumb="On-the-Job"
      titleLine1={t('tjob.hero.title1')}
      titleAccent={t('tjob.hero.accent')}
      subtitle={t('tjob.hero.subtitle')}
      stats={[
        { label: 'Format', value: t('tjob.stat1.value') },
        { label: 'Group Size', value: t('tjob.stat2.value') },
        { label: 'Duration', value: t('tjob.stat3.value') },
        { label: 'Delivery', value: t('tjob.stat4.value') },
        { label: 'Certification', value: t('tjob.stat5.value') },
        { label: 'Lead Time', value: t('tjob.stat6.value') },
      ]}
      sectionLabel={t('tjob.modules.label')}
      sectionTitle={t('tjob.modules.title')}
      modules={[1, 2, 3, 4].map((n) => ({
        num: String(n).padStart(2, '0'),
        title: t(`tjob.module${n}.title`),
        desc: t(`tjob.module${n}.desc`),
      }))}
      whoLabel={t('tjob.who.label')}
      whoTitle={t('tjob.who.title')}
      whoCards={[1, 2, 3].map((n) => ({
        title: t(`tjob.who${n}.title`),
        desc: t(`tjob.who${n}.desc`),
      }))}
      ctaTitle={t('tjob.cta.title')}
      ctaDesc={t('tjob.cta.desc')}
      ctaButton={t('tjob.cta.button')}
    />
  )
}
