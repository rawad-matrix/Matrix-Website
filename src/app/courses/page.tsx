// Server component — always fetches fresh data from Supabase on every request.
// No client-side caching; changes made in the admin panel are immediately visible.
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/sections/PageHero'
import { ContactStrip } from '@/components/sections/ContactStrip'
import CoursesClient from './CoursesClient'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('slug, title, short_description, level, duration_hours, price, category, featured_image')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHero
        title="Training Courses"
        subtitle="Hands-on automation courses taught by working engineers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Courses' }]}
      />
      <CoursesClient courses={courses ?? []} />
      <ContactStrip />
    </>
  )
}
