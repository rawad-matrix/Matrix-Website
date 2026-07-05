'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { COUNTRIES } from '@/lib/country-codes'

// Real flag images (PNG) — flag emoji don't render on Windows, so we use
// flagcdn.com bitmaps instead. w40 is served for crisp retina at 20px wide.
export function FlagIcon({ iso, size = 20 }: { iso: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      alt=""
      width={size}
      height={Math.round(size * 0.75)}
      loading="lazy"
      style={{ display: 'inline-block', objectFit: 'cover', borderRadius: '1px', flexShrink: 0 }}
    />
  )
}

type Props = {
  value: string            // dial code, e.g. '+961'
  onChange: (dial: string) => void
  error?: boolean
}

export function CountryCodeSelect({ value, onChange, error }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  // Some dial codes are shared (+1 US/Canada, +7 Russia/Kazakhstan) — remember
  // the exact country the user picked so the right flag stays displayed.
  const [selectedIso, setSelectedIso] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected =
    (selectedIso ? COUNTRIES.find((c) => c.iso === selectedIso && c.dial === value) : undefined) ??
    COUNTRIES.find((c) => c.dial === value) ??
    COUNTRIES.find((c) => c.dial === '+961')!

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase() === q
    )
  }, [query])

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Focus search when opening
  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => searchRef.current?.focus(), 10)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0" style={{ width: '118px' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-1.5"
        style={{
          padding: '14px 10px',
          border: `1px solid ${error ? '#DC2626' : open ? '#1B6FCC' : '#E2E8F0'}`,
          borderRadius: '2px',
          fontSize: '14px',
          color: '#1F2330',
          background: '#fff',
          cursor: 'pointer',
          transition: 'border-color .15s',
          fontFamily: 'inherit',
        }}
      >
        <span className="flex items-center gap-2 min-w-0">
          <FlagIcon iso={selected.iso} />
          <span className="font-mono" style={{ fontSize: '13.5px' }}>{selected.dial}</span>
        </span>
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .15s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1"
          style={{
            width: '300px',
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderTop: '2px solid #1B6FCC',
            borderRadius: '2px',
            boxShadow: '0 12px 32px rgba(0,0,0,.14)',
          }}
        >
          {/* Search */}
          <div style={{ padding: '10px', borderBottom: '1px solid #E2E8F0' }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code…"
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: '2px',
                fontSize: '13.5px',
                color: '#1F2330',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <p style={{ padding: '14px', fontSize: '13px', color: '#64748B', margin: 0 }}>No match found.</p>
            )}
            {filtered.map((c) => {
              const isSelected = c.dial === value && c.iso === selected.iso
              return (
                <button
                  key={c.iso}
                  type="button"
                  onClick={() => { onChange(c.dial); setSelectedIso(c.iso); setOpen(false) }}
                  className="w-full flex items-center gap-3 text-left"
                  style={{
                    padding: '9px 14px',
                    background: isSelected ? 'rgba(27,111,204,.08)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F8F9FB' }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                >
                  <FlagIcon iso={c.iso} />
                  <span style={{ fontSize: '13.5px', color: '#1F2330', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </span>
                  <span className="font-mono" style={{ fontSize: '12.5px', color: '#64748B', flexShrink: 0 }}>
                    {c.dial}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
