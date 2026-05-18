import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'

export const metadata: Metadata = { title: 'Install App' }

const STEPS = [
  {
    platform: 'iOS (iPhone / iPad)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    steps: [
      'Open Matrix EA in Safari',
      'Tap the Share button (rectangle with arrow)',
      'Scroll down and tap "Add to Home Screen"',
      'Tap "Add" to confirm',
    ],
  },
  {
    platform: 'Android',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C3.6327 10.1865 2.2044 12.0075 2 14.1908h20c-.2044-2.1833-1.6327-4.0043-4.1185-4.8694"/>
      </svg>
    ),
    steps: [
      'Open Matrix EA in Chrome',
      'Tap the three-dot menu (⋮) in the top right',
      'Tap "Add to Home screen" or "Install app"',
      'Tap "Add" or "Install" to confirm',
    ],
  },
  {
    platform: 'Desktop (Chrome / Edge)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
      </svg>
    ),
    steps: [
      'Open Matrix EA in Chrome or Edge',
      'Click the install icon (⊕) in the address bar',
      'Or open browser menu → "Install Matrix EA"',
      'Click "Install" to add to your desktop',
    ],
  },
]

export default function InstallPage() {
  return (
    <>
      <PageHero
        title="Install App"
        subtitle="Add Matrix EA to your home screen for instant access — no app store needed."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Install App' }]}
      />

      <section className="bg-[#F8F9FB] py-[110px] max-[768px]:py-[72px]">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
          {/* Intro */}
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <div className="w-20 h-20 bg-[#2A2F3A] rounded-[3px] grid place-items-center mx-auto mb-6 overflow-hidden">
              <img src="/images/logo.jpg" alt="Matrix EA" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-barlow font-bold text-[36px] uppercase text-[#1F2330] mb-4">Matrix EA App</h2>
            <p className="font-dm text-[16px] text-[#64748B] leading-[1.7]">
              Install our Progressive Web App for a native-app experience. Access your courses, the live dashboard and contact our team — all offline-capable.
            </p>
          </div>

          {/* Platform cards */}
          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
            {STEPS.map(({ platform, icon, steps }) => (
              <div
                key={platform}
                className="bg-white rounded-[2px] p-8"
                style={{ border: '1px solid #E2E8F0', borderTop: '4px solid #1B6FCC' }}
              >
                <div className="w-14 h-14 bg-[rgba(27,111,204,.1)] text-[#1B6FCC] rounded-[2px] grid place-items-center mb-5">
                  {icon}
                </div>
                <h3 className="font-barlow font-bold text-[22px] uppercase text-[#2A2F3A] mb-5">{platform}</h3>
                <ol className="list-none p-0 m-0 flex flex-col gap-3">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="font-mono text-[11px] text-[#1B6FCC] bg-[rgba(27,111,204,.1)] w-6 h-6 rounded-[2px] grid place-items-center flex-shrink-0 mt-[1px]">
                        {i + 1}
                      </span>
                      <span className="font-dm text-[14px] text-[#64748B] leading-[1.6]">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* Features */}
          <div
            className="mt-16 rounded-[2px] p-10 grid grid-cols-4 gap-8 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1"
            style={{ background: '#2A2F3A' }}
          >
            {[
              { icon: '⚡', title: 'Offline Access', desc: 'Browse courses and content without internet' },
              { icon: '🔔', title: 'Push Notifications', desc: 'Get alerts for new courses and updates' },
              { icon: '📊', title: 'Live Dashboard', desc: 'Real-time monitoring data on your device' },
              { icon: '🎓', title: 'Your Courses', desc: 'Access enrolled courses anytime' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <span className="text-[32px] block mb-3">{icon}</span>
                <h4 className="font-barlow font-bold text-[18px] uppercase text-white mb-2">{title}</h4>
                <p className="font-dm text-[13.5px] text-white/65">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
