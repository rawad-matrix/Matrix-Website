export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { textOverridesFrom } from '@/lib/site-text'
import { parseIndustries, INDUSTRIES_SETTINGS_KEY } from '@/lib/industries'
import { SystemIntegratorClient } from './SystemIntegratorClient'

export const metadata: Metadata = { title: 'System Integrator' }

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    return Object.fromEntries((data ?? []).filter(r => r.value).map(r => [r.key, r.value as string]))
  } catch {
    return {}
  }
}

export default async function SystemIntegratorPage() {
  const s = await getSiteSettings()

  const stats = {
    projects:     s.stat_projects     ? parseInt(s.stat_projects)     : undefined,
    years:        s.stat_years        ? parseInt(s.stat_years)        : undefined,
    satisfaction: s.stat_satisfaction ? parseInt(s.stat_satisfaction) : undefined,
  }

  return (
    <SystemIntegratorClient
      texts={textOverridesFrom(s)}
      stats={stats}
      industries={parseIndustries(s[INDUSTRIES_SETTINGS_KEY])}
    />
  )
}
