const MAPS_URL = 'https://maps.app.goo.gl/z94Gr9NJ4FASvKVK7'

export function AnnouncementBar() {
  return (
    <div
      role="banner"
      style={{
        background: 'linear-gradient(95deg,#1a3a6e 0%,#1B6FCC 55%,#1760c0 100%)',
        borderBottom: '1px solid rgba(255,255,255,.12)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px 16px',
          maxWidth: '900px',
        }}
      >
        {/* Amber "New Branch" badge */}
        <span style={{
          background: '#FFB200',
          color: '#1F2330',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '2px',
          flexShrink: 0,
          fontFamily: 'var(--font-jetbrains-mono, JetBrains Mono, monospace)',
          whiteSpace: 'nowrap',
        }}>
          New Branch
        </span>

        {/* Main message */}
        <span style={{
          color: '#fff',
          fontSize: '13.5px',
          fontWeight: 700,
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          whiteSpace: 'nowrap',
        }}>
          Matrixea Automation Academy
        </span>

        <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '13px', flexShrink: 0 }}>·</span>

        <span style={{
          color: 'rgba(255,255,255,.92)',
          fontSize: '13px',
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          whiteSpace: 'nowrap',
        }}>
          Now open in <strong style={{ color: '#fff' }}>Sarba – Jounieh, Keserwan</strong>
        </span>

        <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '13px', flexShrink: 0 }}>·</span>

        {/* Google Maps link */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(255,255,255,.45)',
            paddingBottom: '1px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          View on Maps
        </a>
      </div>
    </div>
  )
}
