import { Hero } from '@/components/sections/Hero'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { WhyMatrix } from '@/components/sections/WhyMatrix'
import { TrainingCTABanner } from '@/components/sections/TrainingCTABanner'
import { CaseStudiesPreview } from '@/components/sections/CaseStudiesPreview'
import { BrandsRow } from '@/components/sections/BrandsRow'
import { MapSection } from '@/components/sections/MapSection'
import { ContactStrip } from '@/components/sections/ContactStrip'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <WhyMatrix />
      <TrainingCTABanner />
      <CaseStudiesPreview />
      <BrandsRow />
      <MapSection />
      <ContactStrip />
    </>
  )
}
