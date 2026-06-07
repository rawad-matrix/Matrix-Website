'use client'

import { useState, useEffect } from 'react'

// Bump the key suffix if you want the bar to re-appear for users who already dismissed it
const DISMISS_KEY = 'matrix_branch_announcement_v2'
const MAPS_URL    = 'https://maps.app.goo.gl/z94Gr9NJ4FASvKVK7'

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(DISMISS_KEY)) setVisible(true)
  }, [])

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="banner"
      style={{
        background: 'linear-gradient(95deg,#1a3a6e 0%,#1B6FCC 55%,#1760c0 100%)',
        borderBottom: '1px solid rgba(255,255,255,.12)',
        padding: '10px 48px 10px 20px',   // right padding leaves room for × button
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
        flexWrap: 'wrap',
        position: 'relative',
        animation: 'fade-in .4s ease forwards',
      }}
    >
      {/* ── Inner content ── */}
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

        {/* Discount badge */}
        <span style={{
          background: 'rgba(255,178,0,.18)',
          border: '1px solid rgba(255,178,0,.50)',
          color: '#FFB200',
          fontSize: '12px',
          fontWeight: 700,
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          padding: '2px 10px',
          borderRadius: '2px',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          Opening Offer: 25% Off All Courses
        </span>

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
            transition: 'opacity .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {/* Map pin icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          View on Maps
        </a>
      </div>

      {/* Dismiss × */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,.55)',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color .15s',
          borderRadius: '2px',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.55)')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
