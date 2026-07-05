'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'
import { SITE_TEXT_PAGES, TEXT_DEFAULTS, TEXT_PREFIX, type TextBlock } from '@/lib/site-text'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #E2E8F0',
  borderRadius: '2px',
  fontSize: '14px',
  color: '#1F2330',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  lineHeight: 1.5,
} as const

function TextField({
  block, value, onChange,
}: {
  block: TextBlock
  value: string
  onChange: (v: string) => void
}) {
  const isDefault = value === TEXT_DEFAULTS[block.key]
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-dm font-semibold uppercase text-[11px] tracking-[.14em] text-matrix-muted">
          {block.label}
        </label>
        {!isDefault && (
          <button
            type="button"
            onClick={() => onChange(TEXT_DEFAULTS[block.key])}
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ background: 'none', border: 'none', color: '#1B6FCC', cursor: 'pointer', padding: 0 }}
          >
            Reset to default
          </button>
        )}
      </div>
      {block.multiline ? (
        <textarea
          value={value}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
          onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
        />
      )}
    </div>
  )
}

export default function TextsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [openPage, setOpenPage] = useState<string>(SITE_TEXT_PAGES[0].page)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      const overrides: Record<string, string> = {}
      ;(data ?? []).forEach((r: { key: string; value: string | null }) => {
        if (r.key.startsWith(TEXT_PREFIX) && r.value) overrides[r.key.slice(TEXT_PREFIX.length)] = r.value
      })
      // Initialize every field: override if present, else registry default
      const init: Record<string, string> = {}
      for (const [key, def] of Object.entries(TEXT_DEFAULTS)) {
        init[key] = overrides[key] ?? def
      }
      setValues(init)
      setLoading(false)
    })
  }, [])

  async function savePage(pageName: string) {
    setSaving(pageName)
    setError('')
    try {
      const supabase = createClient()
      const page = SITE_TEXT_PAGES.find(p => p.page === pageName)!
      const rows = page.sections.flatMap(s =>
        s.blocks.map(b => ({
          key: TEXT_PREFIX + b.key,
          // Storing the default is harmless; empty fields fall back to default on the site
          value: values[b.key]?.trim() ? values[b.key] : null,
        }))
      )
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key' })
      if (upsertError) {
        setError(`Save failed: ${upsertError.message}`)
      } else {
        setSaved(pageName)
        setTimeout(() => setSaved(null), 2500)
      }
    } catch {
      setError('Save failed. Please try again.')
    }
    setSaving(null)
  }

  const panelStyle = { background: '#F4F6FA', minHeight: 'calc(100vh - 108px)' }
  const gridStyle = { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px', alignItems: 'start' }

  if (loading) return (
    <div style={panelStyle}>
      <div className="max-w-7xl mx-auto px-6 py-10" style={gridStyle}>
        <AdminSidebar />
        <div className="font-mono text-[11px] text-matrix-muted tracking-widest mt-16 text-center">LOADING...</div>
      </div>
    </div>
  )

  return (
    <div style={panelStyle}>
      <div className="max-w-7xl mx-auto px-6 py-10" style={gridStyle}>
        <AdminSidebar />

        <main>
          <div className="mb-6">
            <h1 className="font-barlow font-bold uppercase text-[32px] text-matrix-ink">Page Text</h1>
            <p className="text-matrix-muted text-[14px] mt-1">
              Edit the text of each page. Layout and design stay fixed — only the words change.
              Empty fields fall back to the built-in default. Changes go live immediately after saving.
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xs text-[13.5px]"
              style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {SITE_TEXT_PAGES.map(page => {
              const isOpen = openPage === page.page
              const isSaving = saving === page.page
              const isSaved = saved === page.page
              return (
                <section key={page.page} className="bg-white border border-matrix-border rounded-xs overflow-hidden">
                  {/* Page header — click to expand */}
                  <button
                    type="button"
                    onClick={() => setOpenPage(isOpen ? '' : page.page)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <span className="font-barlow font-bold uppercase text-[18px] text-matrix-ink">
                      {page.page}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-t border-matrix-border">
                      {page.sections.map(section => (
                        <div key={section.section} className="px-6 py-5 border-b border-matrix-border">
                          <h3 className="font-dm font-bold uppercase text-[12.5px] tracking-[.16em] text-matrix-blue mb-4">
                            {section.section}
                          </h3>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-[900px]:grid-cols-1">
                            {section.blocks.map(block => (
                              <div key={block.key} className={block.multiline ? 'col-span-2 max-[900px]:col-span-1' : ''}>
                                <TextField
                                  block={block}
                                  value={values[block.key] ?? ''}
                                  onChange={(v) => setValues(prev => ({ ...prev, [block.key]: v }))}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Save bar */}
                      <div className="px-6 py-4 flex items-center gap-4" style={{ background: '#F8F9FB' }}>
                        <button
                          onClick={() => savePage(page.page)}
                          disabled={isSaving}
                          style={{
                            background: isSaved ? '#22C55E' : isSaving ? '#64748B' : '#1B6FCC',
                            color: '#fff', border: 'none', borderRadius: '2px',
                            padding: '11px 28px', fontFamily: 'inherit', fontWeight: 600,
                            fontSize: '13px', letterSpacing: '.04em', textTransform: 'uppercase',
                            cursor: isSaving ? 'not-allowed' : 'pointer', transition: 'background .2s',
                          }}
                        >
                          {isSaved ? 'Saved' : isSaving ? 'Saving...' : `Save ${page.page}`}
                        </button>
                        <span className="font-dm text-[12.5px] text-matrix-muted">
                          Saves every field in this page group.
                        </span>
                      </div>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
