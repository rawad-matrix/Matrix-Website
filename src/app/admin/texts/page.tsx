'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'
import { SITE_TEXT_PAGES, TEXT_PREFIX, type TextBlock, type TextSection } from '@/lib/site-text'

// ── Classify each field by its role on the real page, so the editor can ─────
// mirror page structure (label → title → paragraph → small values) without
// needing a custom layout per page. No design/images — text only.
type FieldKind = 'label' | 'title' | 'paragraph' | 'item'

function classify(block: TextBlock): FieldKind {
  const seg = block.key.split('.').pop() ?? ''
  if (seg === 'label') return 'label'
  if (seg.startsWith('title') || seg === 'accent' || seg.endsWith('accent') || seg === 'headline') return 'title'
  if (block.multiline) return 'paragraph'
  if (/^(subtitle|lead|desc|summary|p\d+)$/.test(seg)) return 'paragraph'
  return 'item'
}

type Group = { type: 'single'; block: TextBlock; kind: FieldKind } | { type: 'row'; blocks: TextBlock[] }

function groupBlocks(blocks: TextBlock[]): Group[] {
  const groups: Group[] = []
  let buffer: TextBlock[] = []
  const flush = () => { if (buffer.length) { groups.push({ type: 'row', blocks: buffer }); buffer = [] } }
  for (const b of blocks) {
    const kind = classify(b)
    if (kind === 'item') {
      buffer.push(b)
    } else {
      flush()
      groups.push({ type: 'single', block: b, kind })
    }
  }
  flush()
  return groups
}

// Required: every title, plus the first paragraph in each section (its
// opening description). Everything else may be left blank and falls back
// to the built-in default.
function requiredKeysForSection(section: TextSection): Set<string> {
  const req = new Set<string>()
  let paragraphClaimed = false
  for (const b of section.blocks) {
    const kind = classify(b)
    if (kind === 'title') req.add(b.key)
    else if (kind === 'paragraph' && !paragraphClaimed) { req.add(b.key); paragraphClaimed = true }
  }
  return req
}

const inputBase = {
  width: '100%',
  border: '1px solid #E2E8F0',
  borderRadius: '2px',
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  color: '#1F2330',
} as const

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5 font-dm font-semibold uppercase text-[10.5px] tracking-[.14em] text-matrix-muted">
      {text}
      {required && <span style={{ color: '#DC2626' }}>*</span>}
    </label>
  )
}

function TextFieldRow({
  block, kind, value, required, invalid, onChange,
}: {
  block: TextBlock
  kind: FieldKind
  value: string
  required: boolean
  invalid: boolean
  onChange: (v: string) => void
}) {
  const borderColor = invalid ? '#DC2626' : '#E2E8F0'
  const focusColor = '#1B6FCC'

  if (kind === 'title') {
    return (
      <div>
        <FieldLabel text={block.label} required={required} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-barlow font-bold uppercase"
          style={{ ...inputBase, fontSize: '21px', padding: '11px 14px', borderColor }}
          onFocus={(e) => (e.target.style.borderColor = focusColor)}
          onBlur={(e) => (e.target.style.borderColor = borderColor)}
        />
        {invalid && <p className="mt-1 font-dm text-[11.5px]" style={{ color: '#DC2626' }}>This field is required.</p>}
      </div>
    )
  }

  if (kind === 'paragraph') {
    return (
      <div>
        <FieldLabel text={block.label} required={required} />
        <textarea
          value={value}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className="font-dm"
          style={{ ...inputBase, fontSize: '15px', lineHeight: 1.65, padding: '11px 14px', minHeight: '76px', resize: 'vertical', borderColor }}
          onFocus={(e) => (e.target.style.borderColor = focusColor)}
          onBlur={(e) => (e.target.style.borderColor = borderColor)}
        />
        {invalid && <p className="mt-1 font-dm text-[11.5px]" style={{ color: '#DC2626' }}>This field is required.</p>}
      </div>
    )
  }

  if (kind === 'label') {
    return (
      <div style={{ maxWidth: '340px' }}>
        <FieldLabel text={block.label} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-dm uppercase"
          style={{ ...inputBase, fontSize: '12px', letterSpacing: '.12em', padding: '9px 12px' }}
          onFocus={(e) => (e.target.style.borderColor = focusColor)}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
        />
      </div>
    )
  }

  // item — compact value used within a wrapping row
  return (
    <div style={{ flex: '1 1 200px', minWidth: '160px' }}>
      <FieldLabel text={block.label} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-dm"
        style={{ ...inputBase, fontSize: '13px', padding: '8px 11px' }}
        onFocus={(e) => (e.target.style.borderColor = focusColor)}
        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
      />
    </div>
  )
}

export default function TextsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [openPage, setOpenPage] = useState<string>(SITE_TEXT_PAGES[0].page)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [invalidKeys, setInvalidKeys] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      const overrides: Record<string, string> = {}
      ;(data ?? []).forEach((r: { key: string; value: string | null }) => {
        if (r.key.startsWith(TEXT_PREFIX) && r.value) overrides[r.key.slice(TEXT_PREFIX.length)] = r.value
      })
      const init: Record<string, string> = {}
      for (const page of SITE_TEXT_PAGES) {
        for (const section of page.sections) {
          for (const b of section.blocks) init[b.key] = overrides[b.key] ?? b.def
        }
      }
      setValues(init)
      setLoading(false)
    })
  }, [])

  function setValue(key: string, v: string) {
    setValues(prev => ({ ...prev, [key]: v }))
    if (invalidKeys.has(key) && v.trim()) {
      setInvalidKeys(prev => { const n = new Set(prev); n.delete(key); return n })
    }
  }

  async function savePage(pageName: string) {
    const page = SITE_TEXT_PAGES.find(p => p.page === pageName)!

    // Validate: every required key (titles + each section's first paragraph) must be non-empty.
    const missing = new Set<string>()
    for (const section of page.sections) {
      for (const key of requiredKeysForSection(section)) {
        if (!values[key]?.trim()) missing.add(key)
      }
    }
    if (missing.size > 0) {
      setInvalidKeys(missing)
      setError('Please fill in the required fields highlighted below before saving.')
      return
    }

    setInvalidKeys(new Set())
    setSaving(pageName)
    setError('')
    try {
      const supabase = createClient()
      const rows = page.sections.flatMap(s =>
        s.blocks.map(b => ({
          key: TEXT_PREFIX + b.key,
          // Storing the default is harmless; empty optional fields fall back to default on the site
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
              Fields are laid out in the same order and weight as the real page — heading, then paragraph, then small
              details — text only, no layout or images to worry about. Titles and each section&apos;s opening paragraph
              (marked *) are required; everything else falls back to the built-in default when left blank.
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
                      {page.sections.map(section => {
                        const required = requiredKeysForSection(section)
                        return (
                          <div key={section.section} className="px-6 py-5 border-b border-matrix-border">
                            <h3 className="font-dm font-bold uppercase text-[12.5px] tracking-[.16em] text-matrix-blue mb-4">
                              {section.section}
                            </h3>
                            <div className="flex flex-col gap-4 max-w-165">
                              {groupBlocks(section.blocks).map((group, gi) => {
                                if (group.type === 'row') {
                                  return (
                                    <div key={gi} className="flex flex-wrap gap-3">
                                      {group.blocks.map(b => (
                                        <TextFieldRow
                                          key={b.key}
                                          block={b}
                                          kind="item"
                                          value={values[b.key] ?? ''}
                                          required={false}
                                          invalid={invalidKeys.has(b.key)}
                                          onChange={(v) => setValue(b.key, v)}
                                        />
                                      ))}
                                    </div>
                                  )
                                }
                                return (
                                  <TextFieldRow
                                    key={group.block.key}
                                    block={group.block}
                                    kind={group.kind}
                                    value={values[group.block.key] ?? ''}
                                    required={required.has(group.block.key)}
                                    invalid={invalidKeys.has(group.block.key)}
                                    onChange={(v) => setValue(group.block.key, v)}
                                  />
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}

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
