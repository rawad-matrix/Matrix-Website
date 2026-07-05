'use client'

import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { makeTx } from '@/lib/site-text'

const BRANDS = [
  { name: 'Siemens', imageSrc: '/images/brands/logo_siemens.png' },
  { name: 'ABB', imageSrc: '/images/brands/ABB_logo.png' },
  { name: 'Delta', imageSrc: '/images/brands/delta_logo.png' },
  { name: 'Veichi', imageSrc: '/images/brands/veichi_logo.png' },
  { name: 'Danfoss', imageSrc: '/images/brands/Danfoss-Logo.jpg' },
  { name: 'Festo', imageSrc: '/images/brands/festo_logo.png' },
  { name: 'Mitsubishi', imageSrc: '/images/brands/Mitsubishi_Electric_logo.png' },
  { name: 'Omron', imageSrc: '/images/brands/omron_logo.jpg' },
  { name: 'Schneider', imageSrc: '/images/brands/schneider_logo.png' },
]

function BrandGrid({ cols, cellHeight, logoHeight, padding }: {
  cols: number
  cellHeight: string
  logoHeight: string
  padding: string
}) {
  const totalRows = Math.ceil(BRANDS.length / cols)
  return (
    <div
      className="grid overflow-hidden rounded-xs"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, border: '1px solid #E2E8F0' }}
    >
      {BRANDS.map(({ name, imageSrc }, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const hasNextInRow = i + 1 < BRANDS.length && Math.floor((i + 1) / cols) === row
        return (
          <div
            key={name}
            className="group grid place-items-center cursor-default transition-colors duration-200"
            style={{
              height: cellHeight,
              padding: `0 ${padding}`,
              borderRight: hasNextInRow ? '1px solid #E2E8F0' : undefined,
              borderBottom: row < totalRows - 1 ? '1px solid #E2E8F0' : undefined,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F8F9FB' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
          >
            <div className="relative w-full" style={{ height: logoHeight }}>
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-contain"
                sizes={cols === 5 ? '(max-width: 1280px) 20vw, 256px' : '33vw'}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function BrandsRow({ texts }: { texts?: Record<string, string> }) {
  const t = makeTx(texts)
  return (
    <section
      className="bg-white min-h-[calc(100vh-72px)] flex items-center"
      style={{ borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}
    >
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5 py-[clamp(32px,4vh,56px)] w-full">
        <SectionHeader
          label={t('home.brands.label')}
          title={t('home.brands.title')}
          subtitle={t('home.brands.subtitle')}
          className="mb-10"
        />

        {/* Desktop: 5 columns → 2 rows */}
        <div className="hidden md:block">
          <BrandGrid cols={5} cellHeight="clamp(180px,22vh,250px)" logoHeight="clamp(150px,18vh,210px)" padding="clamp(8px,1vw,16px)" />
        </div>

        {/* Mobile: 3 columns → 3 rows */}
        <div className="md:hidden">
          <BrandGrid cols={3} cellHeight="clamp(110px,15vh,160px)" logoHeight="clamp(80px,12vh,130px)" padding="8px" />
        </div>
      </div>
    </section>
  )
}
