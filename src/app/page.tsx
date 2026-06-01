export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { Hero } from '@/components/sections/Hero'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { WhyMatrix } from '@/components/sections/WhyMatrix'
import { StatsCounter } from '@/components/sections/StatsCounter'
import { TrainingCTABanner } from '@/components/sections/TrainingCTABanner'
import { CaseStudiesPreview } from '@/components/sections/CaseStudiesPreview'
import { BrandsRow } from '@/components/sections/BrandsRow'
import { MapSection } from '@/components/sections/MapSection'
import { ContactStrip } from '@/components/sections/ContactStrip'
import { createClient } from '@/lib/supabase/server'

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    return Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value as string]))
  } catch {
    return {}
  }
}

export default async function HomePage() {
  const s = await getSiteSettings()

  return (
    <>
      <Hero
        slideImages={[
          s.hero_slide_1_image ?? null,
          s.hero_slide_2_image ?? null,
          s.hero_slide_3_image ?? null,
          s.hero_slide_4_image ?? null,
          s.hero_slide_5_image ?? null,
          s.hero_slide_6_image ?? null,
          s.hero_slide_7_image ?? null,
          s.hero_slide_8_image ?? null,
          s.hero_slide_9_image ?? null,
          s.hero_slide_10_image ?? null,
        ]}
        stats={{
          projects: s.stat_projects ? parseInt(s.stat_projects) : undefined,
          clients: s.stat_clients ? parseInt(s.stat_clients) : undefined,
          years: s.stat_years ? parseInt(s.stat_years) : undefined,
        }}
      />
      <ServicesGrid />
      <WhyMatrix imageUrl={s.why_matrix_image ?? null} />
      <StatsCounter
        stats={{
          projects: s.stat_projects ? parseInt(s.stat_projects) : undefined,
          clients: s.stat_clients ? parseInt(s.stat_clients) : undefined,
          years: s.stat_years ? parseInt(s.stat_years) : undefined,
          satisfaction: s.stat_satisfaction ? parseInt(s.stat_satisfaction) : undefined,
        }}
      />
      <TrainingCTABanner />
      <CaseStudiesPreview />
      <BrandsRow />
      <MapSection />
      <ContactStrip />
    </>
  )
}
