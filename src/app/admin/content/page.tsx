'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'

type Settings = Record<string, string>

const IMAGE_SLOTS = [
  { key: 'hero_slide_1_image',  label: 'Slide 1', hint: 'Industrial automation' },
  { key: 'hero_slide_2_image',  label: 'Slide 2', hint: 'SCADA systems' },
  { key: 'hero_slide_3_image',  label: 'Slide 3', hint: 'PLC programming' },
  { key: 'hero_slide_4_image',  label: 'Slide 4', hint: 'Energy management' },
  { key: 'hero_slide_5_image',  label: 'Slide 5', hint: 'Process control' },
  { key: 'hero_slide_6_image',  label: 'Slide 6', hint: 'Motor drives' },
  { key: 'hero_slide_7_image',  label: 'Slide 7', hint: 'Factory automation' },
  { key: 'hero_slide_8_image',  label: 'Slide 8', hint: 'Power systems' },
  { key: 'hero_slide_9_image',  label: 'Slide 9', hint: 'Training & certification' },
  { key: 'hero_slide_10_image', label: 'Slide 10', hint: 'System integration' },
]

const WHY_SLOT = {
  key: 'why_matrix_image',
  label: 'Why Matrix - Photo',
  hint: 'Factory / site photo beside the checklist on homepage',
}

const TRAINING_SLOT = {
  key: 'training_banner_image',
  label: 'Training Page Banner',
  hint: 'Photo shown in the Training page hero (right panel). Recommended: 1200x900 px.',
}

const STAT_FIELDS = [
  { key: 'stat_projects', label: 'Projects Completed', suffix: '+', placeholder: '1200' },
  { key: 'stat_clients', label: 'Satisfied Clients', suffix: '+', placeholder: '800' },
  { key: 'stat_years', label: 'Years Experience', suffix: 'yrs', placeholder: '21' },
  { key: 'stat_satisfaction', label: 'Satisfaction Rate', suffix: '%', placeholder: '99' },
]

function ImageSlot({
  slotKey, label, hint, settings, onUpload, onRemove, uploading,
}: {
  slotKey: string; label: string; hint: string; settings: Settings
  onUpload: (key: string, file: File) => void
  onRemove: (key: string) => void
  uploading: string | null
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const currentUrl = settings[slotKey]
  const isUploading = uploading === slotKey

  return (
    <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
      {/* Preview */}
      <div className="relative" style={{ height: '180px', background: '#0A0A12' }}>
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: 'linear-gradient(160deg,#1a2a3a 0%,#0a1a28 90%)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,.3)' }}>
              No image set
            </span>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.55)' }}>
            <span className="font-mono text-[11px] text-white uppercase tracking-widest">Uploading...</span>
          </div>
        )}
      </div>

      {/* Info + buttons */}
      <div className="p-4">
        <p className="font-dm font-semibold text-[13px] text-matrix-ink mb-0.5">{label}</p>
        <p className="font-dm text-[11.5px] text-matrix-muted mb-3">{hint}</p>
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            style={{
              flex: 1, background: '#1B6FCC', color: '#fff', border: 'none',
              borderRadius: '2px', padding: '8px 0',
              fontFamily: 'inherit', fontWeight: 600, fontSize: '11.5px',
              letterSpacing: '.1em', textTransform: 'uppercase',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1,
            }}
          >
            {currentUrl ? 'Replace' : 'Upload'}
          </button>
          {currentUrl && (
            <button
              onClick={() => onRemove(slotKey)}
              style={{
                background: 'transparent', border: '1px solid rgba(220,38,38,.3)',
                color: '#DC2626', borderRadius: '2px', padding: '8px 12px',
                fontFamily: 'inherit', fontWeight: 600, fontSize: '11.5px',
                letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(slotKey, f) }}
        className="hidden"
      />
    </div>
  )
}

export default function ContentPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [statValues, setStatValues] = useState<Record<string, string>>({})
  const [statsSaving, setStatsSaving] = useState(false)
  const [statsSaved, setStatsSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data) {
        const map: Settings = {}
        data.forEach((r: { key: string; value: string | null }) => {
          if (r.value) map[r.key] = r.value
        })
        setSettings(map)
        const statMap: Record<string, string> = {}
        STAT_FIELDS.forEach(f => { statMap[f.key] = map[f.key] ?? f.placeholder })
        setStatValues(statMap)
      }
      setLoading(false)
    })
  }, [])

  async function uploadImage(key: string, file: File) {
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB.'); return }
    setUploading(key)
    setError('')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${key}/${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('site-images').upload(path, file, { upsert: true })
      if (uploadError) { setError(`Upload failed: ${uploadError.message}`); setUploading(null); return }
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(uploadData.path)
      await supabase.from('site_settings').upsert({ key, value: publicUrl }, { onConflict: 'key' })
      setSettings(prev => ({ ...prev, [key]: publicUrl }))
    } catch {
      setError('Upload failed. Please try again.')
    }
    setUploading(null)
  }

  async function removeImage(key: string) {
    const supabase = createClient()
    await supabase.from('site_settings').upsert({ key, value: null }, { onConflict: 'key' })
    setSettings(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  async function saveStats() {
    setStatsSaving(true)
    setError('')
    try {
      const supabase = createClient()
      const rows = STAT_FIELDS.map(f => ({ key: f.key, value: statValues[f.key] ?? f.placeholder }))
      await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
      setStatsSaved(true)
      setTimeout(() => setStatsSaved(false), 2500)
    } catch {
      setError('Failed to save statistics.')
    }
    setStatsSaving(false)
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
            <h1 className="font-barlow font-bold uppercase text-[32px] text-matrix-ink">Content</h1>
            <p className="text-matrix-muted text-[14px] mt-1">
              Manage homepage photos and site statistics. Changes go live immediately after saving.
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xs text-[13.5px]"
              style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-7">

            {/* â”€â”€ Hero Slides â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="bg-white border border-matrix-border rounded-xs">
              <div className="px-6 py-4 border-b border-matrix-border">
                <h2 className="font-barlow font-bold uppercase text-[18px] text-matrix-ink">
                  Hero Slider Images
                </h2>
                <p className="font-dm text-[13px] text-matrix-muted mt-0.5">
                  Background photos for the 3 rotating slides on the homepage hero (right panel).
                  Recommended size: 1200 x 900 px, landscape.
                </p>
              </div>
              <div className="p-6 grid grid-cols-5 gap-4 max-[1200px]:grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
                {IMAGE_SLOTS.map(slot => (
                  <ImageSlot
                    key={slot.key}
                    slotKey={slot.key}
                    label={slot.label}
                    hint={slot.hint}
                    settings={settings}
                    onUpload={uploadImage}
                    onRemove={removeImage}
                    uploading={uploading}
                  />
                ))}
              </div>
            </section>

            {/* â”€â”€ Why Matrix Image â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="bg-white border border-matrix-border rounded-xs">
              <div className="px-6 py-4 border-b border-matrix-border">
                <h2 className="font-barlow font-bold uppercase text-[18px] text-matrix-ink">
                  Why Matrix - Section Photo
                </h2>
                <p className="font-dm text-[13px] text-matrix-muted mt-0.5">
                  The photo displayed beside the &quot;Why Choose Matrix EA&quot; checklist on the homepage.
                  Recommended size: 800 x 600 px.
                </p>
              </div>
              <div className="p-6" style={{ maxWidth: '320px' }}>
                <ImageSlot
                  slotKey={WHY_SLOT.key}
                  label={WHY_SLOT.label}
                  hint={WHY_SLOT.hint}
                  settings={settings}
                  onUpload={uploadImage}
                  onRemove={removeImage}
                  uploading={uploading}
                />
              </div>
            </section>

            {/* â”€â”€ Training Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="bg-white border border-matrix-border rounded-xs">
              <div className="px-6 py-4 border-b border-matrix-border">
                <h2 className="font-barlow font-bold uppercase text-[18px] text-matrix-ink">
                  Training Page Banner
                </h2>
                <p className="font-dm text-[13px] text-matrix-muted mt-0.5">
                  Photo shown in the right panel of the Training page hero. Recommended: 1200 x 900 px, landscape.
                </p>
              </div>
              <div className="p-6" style={{ maxWidth: '320px' }}>
                <ImageSlot
                  slotKey={TRAINING_SLOT.key}
                  label={TRAINING_SLOT.label}
                  hint={TRAINING_SLOT.hint}
                  settings={settings}
                  onUpload={uploadImage}
                  onRemove={removeImage}
                  uploading={uploading}
                />
              </div>
            </section>

            {/* â”€â”€ Site Statistics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section className="bg-white border border-matrix-border rounded-xs">
              <div className="px-6 py-4 border-b border-matrix-border">
                <h2 className="font-barlow font-bold uppercase text-[18px] text-matrix-ink">
                  Site Statistics
                </h2>
                <p className="font-dm text-[13px] text-matrix-muted mt-0.5">
                  Numbers shown in the homepage stats banner and hero stats bar. Click Save to apply.
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-5 mb-6 max-[900px]:grid-cols-2">
                  {STAT_FIELDS.map(f => (
                    <div key={f.key}>
                      <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-matrix-muted">
                        {f.label}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={statValues[f.key] ?? f.placeholder}
                          onChange={(e) => setStatValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="font-mono w-full"
                          style={{
                            padding: '10px 36px 10px 14px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '2px',
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#1F2330',
                            outline: 'none',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                        />
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[14px]"
                          style={{ color: '#64748B' }}
                        >
                          {f.suffix}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={saveStats}
                  disabled={statsSaving}
                  style={{
                    background: statsSaved ? '#22C55E' : statsSaving ? '#64748B' : '#1B6FCC',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '11px 28px',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '.04em',
                    textTransform: 'uppercase',
                    cursor: statsSaving ? 'not-allowed' : 'pointer',
                    transition: 'background .2s',
                  }}
                >
                  {statsSaved ? 'Saved' : statsSaving ? 'Saving...' : 'Save Statistics'}
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

