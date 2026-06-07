'use client'

import { useState, useEffect } from 'react'

const DISMISS_KEY = 'matrix_branch_announcement_v1'

// ── Update these two values when the branch info changes ──────────────────────
const BRANCH_CITY    = 'Tripoli, Lebanon'   // ← replace with real location
const BRANCH_DETAIL  = 'Our second training center is now open — serving North Lebanon.'
// ─────────────────────────────────────────────────────────────────────────────

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show once per session; respect if dismissed before
    if (!sessionStorage.getItem(DISMISS_KEY)) {
      setVisible(true)
    }
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
        background: 'linear-gradient(90deg,#155AA8 0%,#1B6FCC 60%,#1560B8 100%)',
        borderBottom: '1px solid rgba(255,255,255,.15)',
        padding: '9px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        position: 'relative',
        animation: 'fade-in .4s ease forwards',
      }}
    >
      {/* NEW badge */}
      <span
        style={{
          background: '#FFB200',
          color: '#1F2330',
          fontSize: '9px',
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '2px 7px',
          borderRadius: '2px',
          flexShrink: 0,
          fontFamily: 'var(--font-jetbrains-mono, JetBrains Mono, monospace)',
        }}
      >
        New Branch
      </span>

      {/* Location */}
      <span
        style={{
          color: '#fff',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
          letterSpacing: '0.01em',
        }}
      >
        {BRANCH_CITY}
      </span>

      {/* Separator */}
      <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '13px' }}>·</span>

      {/* Detail text */}
      <span
        style={{
          color: 'rgba(255,255,255,.82)',
          fontSize: '12.5px',
          fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
        }}
      >
        {BRANCH_DETAIL}
      </span>

      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,.65)',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color .15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.65)')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
