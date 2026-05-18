'use client'

import Image from 'next/image'

const BRANDS = [
  { name: 'Siemens', sub: 'Automation', imageSrc: '/images/brands/logo_siemens.png' },
  { name: 'ABB', sub: 'Drives & Robots', imageSrc: '/images/brands/ABB_logo.png' },
  { name: 'Delta', sub: 'Drives & PLC', imageSrc: '/images/brands/delta_logo.png' },
  { name: 'Veichi', sub: 'VFD & Servo', imageSrc: '/images/brands/veichi_logo.png' },
  { name: 'Danfoss', sub: 'Drives', imageSrc: '/images/brands/Danfoss-Logo.jpg' },
  { name: 'Festo', sub: 'Pneumatics', imageSrc: '/images/brands/festo_logo.png' },
  { name: 'Mitsubishi', sub: 'Automation', imageSrc: '/images/brands/Mitsubishi_Electric_logo.png' },
  { name: 'Omron', sub: 'Automation', imageSrc: '/images/brands/omron_logo.jpg' },
  { name: 'Schneider', sub: 'Energy Mgmt', imageSrc: '/images/brands/schneider_logo.png' },
]

export function BrandsRow() {
  return (
    <section
      className="bg-white py-20"
      style={{ borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}
    >
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
        <div className="flex justify-between items-end flex-wrap gap-6 mb-12">
          <h3
            className="font-barlow font-bold uppercase text-[#2A2F3A] m-0"
            style={{ fontSize: 'clamp(24px, 2.6vw, 32px)' }}
          >
            Trusted by Industry
          </h3>
          <p className="font-dm text-[14.5px] text-[#64748B] max-w-[380px] m-0">
            Authorised partner and integrator for the world's leading industrial automation brands.
          </p>
        </div>

        <div
          className="grid overflow-hidden rounded-[2px]"
          style={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            border: '1px solid #E2E8F0',
          }}
        >
          {BRANDS.map(({ name, sub, imageSrc }, i) => {
            const col = i % 3
            const row = Math.floor(i / 3)
            const totalRows = Math.ceil(BRANDS.length / 3)
            return (
              <div
                key={name}
                className="group h-[120px] grid place-items-center px-6 cursor-default transition-all duration-250 ease-out"
                style={{
                  borderRight: col < 2 ? '1px solid #E2E8F0' : undefined,
                  borderBottom: row < totalRows - 1 ? '1px solid #E2E8F0' : undefined,
                  filter: 'grayscale(1)',
                  opacity: 0.55,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.filter = 'grayscale(0)'
                  el.style.opacity = '1'
                  el.style.background = '#F8F9FB'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.filter = 'grayscale(1)'
                  el.style.opacity = '0.55'
                  el.style.background = ''
                }}
              >
                <div className="relative w-full h-14 flex items-center justify-center">
                  <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 33vw, 426px"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
