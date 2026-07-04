import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = (process.env.NEXT_PUBLIC_APP_URL || 'https://matrixea.co').replace(/\/$/, '')

// Static public routes (kept in sync with the app router).
const STATIC_PATHS = [
  '', '/system-integrator', '/training', '/training/academic',
  '/training/on-the-job', '/training/hybrid', '/about', '/contact',
  '/case-studies', '/courses', '/install',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }))

  // Best-effort: append published course + case-study detail pages.
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const [{ data: courses }, { data: cases }] = await Promise.all([
      supabase.from('courses').select('slug').eq('is_published', true),
      supabase.from('case_studies').select('slug').eq('is_published', true),
    ])
    for (const c of courses ?? []) {
      entries.push({ url: `${BASE}/courses/${c.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 })
    }
    for (const c of cases ?? []) {
      entries.push({ url: `${BASE}/case-studies/${c.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })
    }
  } catch {
    // If the DB is unreachable at build time, ship the static routes only.
  }

  return entries
}
