import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-matrix-navy-mid text-white/70 pt-20 relative overflow-hidden">
      {/* Circuit grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(27,111,204,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,111,204,.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 max-[640px]:px-5">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.5fr_1fr_1.3fr] lg:gap-15">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-white rounded-[3px] overflow-hidden shrink-0">
                <Image src="/images/logo.jpg" alt="Matrix" width={44} height={44} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-barlow font-extrabold text-[26px] text-white italic">Matrix</span>
                <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/55 font-medium">Energy & Automation sarl</span>
              </div>
            </div>
            <p className="text-[14px] leading-[1.7] max-w-85 mb-6">
              Industrial automation, system integration and energy solutions across Lebanon, Iraq, Saudi Arabia and Africa. Two decades of field-tested engineering.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {[
                { label: 'Facebook', href: '#', svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>, fill: true },
                { label: 'Instagram', href: 'https://www.instagram.com/matrixea/', svg: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>, fill: false },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/matrix-energy-automation-sarl/', svg: <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>, fill: true },
              ].map(({ label, href, svg, fill }) => (
                <a
                  key={label}
                  href={href}
                  target={href === '#' ? undefined : '_blank'}
                  rel={href === '#' ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className="w-9 h-9 grid place-items-center bg-white/6 border border-white/10 text-white/70 hover:bg-matrix-blue hover:text-white hover:border-matrix-blue transition-all duration-150 rounded-xs"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke={fill ? undefined : 'currentColor'} strokeWidth={fill ? undefined : 2}>
                    {svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-[14px] uppercase tracking-[0.22em] text-white font-dm font-semibold mb-5.5 relative pb-3.5 after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-matrix-blue">
              Quick Links
            </h5>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/system-integrator', label: 'System Integrator' },
                { href: '/training', label: 'Training' },
                { href: '/courses', label: 'Courses' },
                { href: '/case-studies', label: 'Case Studies' },
                { href: '/about', label: 'About Us' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[14px] inline-flex items-center gap-2 hover:text-white transition-colors before:content-['›'] before:text-matrix-blue">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h5 className="text-[14px] uppercase tracking-[0.22em] text-white font-dm font-semibold mb-5.5 relative pb-3.5 after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-matrix-blue">
              Contact
            </h5>
            <div className="flex flex-col gap-4 text-[14px]">
              {[
                {
                  icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>,
                  label: 'Address',
                  value: '3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon',
                  href: undefined,
                },
                {
                  icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>,
                  label: 'Phone',
                  value: '+961 78 800 274',
                  href: 'tel:+9611277663',
                },
                {
                  icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
                  label: 'Email',
                  value: 'info@matrixea.co',
                  href: 'mailto:info@matrixea.co',
                },
                {
                  icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
                  label: 'Hours',
                  value: 'Mon–Sat 09:00 – 20:00 · Sunday Closed',
                  href: undefined,
                },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex gap-3.5 items-start">
                  <div className="shrink-0 w-8 h-8 grid place-items-center bg-[rgba(27,111,204,.12)] rounded-xs text-matrix-blue">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                  </div>
                  <div>
                    <strong className="text-white block font-semibold text-[13px] tracking-[0.04em] mb-0.5">{label}</strong>
                    {href ? (
                      <a href={href} className="hover:text-white transition-colors">{value}</a>
                    ) : (
                      <span>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-18 border-t border-white/8 py-6 flex flex-wrap justify-between gap-6 text-[12.5px] text-white/50 relative">
          <span>© 2026 Matrix Energy & Automation sarl. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/install" className="hover:text-white transition-colors">Install App</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
