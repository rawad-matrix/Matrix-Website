export function Topbar() {
  return (
    <div className="bg-[#F4F6FA] border-b border-[#E2E8F0] text-[13px] font-medium text-[#1F2330]">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5 h-9 flex items-center justify-between gap-4">
        {/* Left: contact info */}
        <div className="flex items-center gap-[22px]">
          <a href="tel:+9611277663" className="inline-flex items-center gap-2 transition-opacity hover:opacity-70" aria-label="Phone">
            <svg className="text-[#1B6FCC]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
            </svg>
            +961 1 277 663
          </a>
          <a href="mailto:info@matrixea.co" className="inline-flex items-center gap-2 transition-opacity hover:opacity-70" aria-label="Email">
            <svg className="text-[#1B6FCC]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            info@matrixea.co
          </a>
          <a href="#" className="inline-flex items-center gap-2 transition-opacity hover:opacity-70 max-[760px]:hidden" aria-label="Hours">
            <svg className="text-[#1B6FCC]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Mon–Sat 09:00–20:00
          </a>
        </div>

        {/* Right: social icons */}
        <div className="flex items-center gap-[22px]">
          <a href="#" aria-label="Facebook" className="text-[#1F2330] hover:text-[#1B6FCC] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/matrixea/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#1F2330] hover:text-[#1B6FCC] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="#" aria-label="TikTok" className="text-[#1F2330] hover:text-[#1B6FCC] transition-colors max-[760px]:hidden">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.6 6.3a4.8 4.8 0 0 1-3.8-4.3h-3.4v14.1a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.9a6.3 6.3 0 1 0 5.4 6.2V9.4a8.2 8.2 0 0 0 3.8 1.2V7.2c-.7 0-.7 0 0-.9z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/matrix-energy-automation-sarl/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#1F2330] hover:text-[#1B6FCC] transition-colors max-[760px]:hidden">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
