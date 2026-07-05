import { SectionHeader } from '@/components/ui/SectionHeader'
import { makeTx } from '@/lib/site-text'

// Two branch locations — Khaldeh (registered Google business) and Sarba (pin).
export const BRANCH_EMBEDS = [
  {
    nameKey: 'home.map.branch1.name',
    addressKey: 'home.map.branch1.address',
    embed: 'https://maps.google.com/maps?q=Matrixea%20Automation%20Academy%2C%20Khaldeh%2C%20Beirut&z=16&output=embed',
    title: 'Matrix EA — Khaldeh, Beirut',
  },
  {
    nameKey: 'home.map.branch2.name',
    addressKey: 'home.map.branch2.address',
    embed: 'https://maps.google.com/maps?q=33.980071,35.626639&z=16&output=embed',
    title: 'Matrix EA — Sarba, Jounieh',
  },
]

export function MapSection({ texts }: { texts?: Record<string, string> }) {
  const t = makeTx(texts)
  return (
    <section className="bg-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5 pt-14 pb-14 w-full">
        <SectionHeader
          label={t('home.map.label')}
          title={t('home.map.title')}
          subtitle={t('home.map.subtitle')}
          className="mb-10"
        />
        <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
          {BRANCH_EMBEDS.map((b) => (
            <div
              key={b.nameKey}
              className="rounded-xs overflow-hidden"
              style={{ border: '1px solid #E2E8F0', borderTop: '3px solid #1B6FCC' }}
            >
              {/* Branch header */}
              <div className="px-6 py-4 bg-white flex items-start gap-3.5" style={{ borderBottom: '1px solid #E2E8F0' }}>
                <div className="shrink-0 w-9 h-9 grid place-items-center bg-[rgba(27,111,204,.10)] rounded-xs text-matrix-blue mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <span className="font-barlow font-bold text-[20px] uppercase text-matrix-navy block leading-tight">
                    {t(b.nameKey)}
                  </span>
                  <span className="font-dm text-[13.5px] text-matrix-muted block mt-0.5">
                    {t(b.addressKey)}
                  </span>
                </div>
              </div>
              {/* Map */}
              <iframe
                src={b.embed}
                width="100%"
                height="380"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={b.title}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
