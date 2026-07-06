'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'
import Image from 'next/image'

type CaseStudy = {
  id: string
  title: string
  slug: string
  tag: string | null
  client: string | null
  sector: string | null
  year: number | null
  summary: string | null
  description: string | null
  systems_used: string[] | null
  image_url: string | null
  image_urls: string[] | null
  video_url: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
}

type FormState = {
  title: string
  tag: string
  client: string
  sector: string
  year: string
  summary: string
  description: string
  systems_used: string[]
  image_urls: string[]
  video_url: string
  is_featured: boolean
  is_published: boolean
}

const EMPTY: FormState = {
  title: '', tag: '', client: '', sector: '',
  year: String(new Date().getFullYear()),
  summary: '', description: '',
  systems_used: [], image_urls: [], video_url: '',
  is_featured: false, is_published: true,
}

const REQUIRED: (keyof FormState)[] = ['title', 'tag', 'client', 'sector', 'year', 'description']

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? '#1B6FCC' : '#E2E8F0', border: 'none', cursor: 'pointer', opacity: disabled ? 0.5 : 1 }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
        style={{ left: value ? 'calc(100% - 18px)' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}
      />
    </button>
  )
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block font-dm text-[11px] uppercase tracking-[.18em] text-[#64748B] font-semibold mb-1.5">
      {text}{required && <span className="text-[#DC2626] ml-0.5">*</span>}
    </label>
  )
}

const inputCls = "w-full font-dm text-[13.5px] text-[#1F2330] px-3 py-2 rounded-[2px] outline-none transition-colors"
const inputStyle = { border: '1px solid #E2E8F0', background: '#fff' }
const inputFocus = { border: '1px solid #1B6FCC' }

export default function AdminCaseStudiesPage() {
  const [cases, setCases] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<CaseStudy | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [systemInput, setSystemInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchCases = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setCases(data)
    setLoading(false)
  }

  useEffect(() => { fetchCases() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setErrors({})
    setSystemInput('')
    setDrawerOpen(true)
  }

  const openEdit = (cs: CaseStudy) => {
    setEditing(cs)
    setForm({
      title: cs.title,
      tag: cs.tag ?? '',
      client: cs.client ?? '',
      sector: cs.sector ?? '',
      year: cs.year?.toString() ?? '',
      summary: cs.summary ?? '',
      description: cs.description ?? '',
      systems_used: cs.systems_used ?? [],
      image_urls: cs.image_urls ?? (cs.image_url ? [cs.image_url] : []),
      video_url: cs.video_url ?? '',
      is_featured: cs.is_featured,
      is_published: cs.is_published,
    })
    setErrors({})
    setSystemInput('')
    setDrawerOpen(true)
  }

  const closeDrawer = () => { setDrawerOpen(false); setEditing(null) }

  const set = (field: keyof FormState, value: FormState[keyof FormState]) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {}
    REQUIRED.forEach(f => {
      const val = form[f]
      if (!val || (typeof val === 'string' && !val.trim())) e[f] = 'Required'
    })
    if (form.systems_used.length === 0) e.systems_used = 'Add at least one system'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    const supabase = createClient()
    const slug = editing ? editing.slug : toSlug(form.title)
    const payload = {
      title: form.title.trim(),
      slug,
      tag: form.tag.trim() || null,
      client: form.client.trim() || null,
      sector: form.sector.trim() || null,
      year: form.year ? parseInt(form.year) : null,
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
      systems_used: form.systems_used.length > 0 ? form.systems_used : null,
      image_url: form.image_urls[0] ?? null,
      image_urls: form.image_urls.length > 0 ? form.image_urls : null,
      video_url: form.video_url.trim() || null,
      is_featured: form.is_featured,
      is_published: form.is_published,
    }
    if (editing) {
      await supabase.from('case_studies').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('case_studies').insert(payload)
    }
    await fetchCases()
    setSaving(false)
    closeDrawer()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this case study? This cannot be undone.')) return
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('case_studies').delete().eq('id', id)
    setCases(prev => prev.filter(c => c.id !== id))
    setDeleting(null)
  }

  const handleToggle = async (id: string, field: 'is_published' | 'is_featured', current: boolean) => {
    setToggling(id + field)
    const supabase = createClient()
    await supabase.from('case_studies').update({ [field]: !current }).eq('id', id)
    setCases(prev => prev.map(c => c.id === id ? { ...c, [field]: !current } : c))
    setToggling(null)
  }

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return
    setUploading(true)
    const supabase = createClient()
    const slug = editing ? editing.slug : toSlug(form.title || 'case-study')
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('case-studies').upload(path, file, { upsert: true })
      if (!error) {
        const { data: urlData } = supabase.storage.from('case-studies').getPublicUrl(path)
        newUrls.push(urlData.publicUrl)
      }
    }
    set('image_urls', [...form.image_urls, ...newUrls])
    setUploading(false)
  }

  const removeImage = (url: string) => {
    set('image_urls', form.image_urls.filter(u => u !== url))
  }

  // Move an image to the front — it becomes the main card photo and the
  // first image shown in the gallery.
  const makeMain = (url: string) => {
    set('image_urls', [url, ...form.image_urls.filter(u => u !== url)])
  }

  const addSystem = () => {
    const val = systemInput.trim().replace(/,$/, '')
    if (val && !form.systems_used.includes(val)) {
      set('systems_used', [...form.systems_used, val])
      if (errors.systems_used) setErrors(e => ({ ...e, systems_used: undefined }))
    }
    setSystemInput('')
  }

  const removeSystem = (s: string) => {
    set('systems_used', form.systems_used.filter(x => x !== s))
  }

  return (
    <div className="bg-[#F4F6FA] min-h-screen py-8 pb-20">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-5">
        <div className="mb-7">
          <h1 className="font-barlow font-bold uppercase text-[42px] text-[#1F2330] leading-none">Admin Panel</h1>
        </div>

        <div className="grid max-[900px]:grid-cols-1 gap-6" style={{ gridTemplateColumns: '240px 1fr', alignItems: 'start' }}>
          <AdminSidebar />

          <div className="bg-white border border-[#E2E8F0] rounded-[2px] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-barlow font-bold uppercase text-[22px] tracking-[.04em] text-[#1F2330]">
                Case Studies ({cases.length})
              </h3>
              <button
                onClick={openCreate}
                className="font-dm font-semibold uppercase text-[11.5px] px-4 py-2 text-white transition-colors"
                style={{ background: '#1B6FCC', borderRadius: '2px', border: 'none', cursor: 'pointer' }}
              >
                + New Case Study
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-8 text-center font-mono text-[12px] text-[#64748B] tracking-[.1em]">LOADING…</div>
            ) : cases.length === 0 ? (
              <div className="p-12 text-center font-dm text-[14px] text-[#64748B]">
                No case studies yet.{' '}
                <button onClick={openCreate} className="text-[#1B6FCC] underline">Create the first one.</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Title', 'Tag', 'Client', 'Year', 'Published', 'Featured', ''].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-[10.5px] tracking-[.18em] uppercase text-[#64748B] font-semibold bg-[#F8F9FB]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map(cs => (
                      <tr key={cs.id} className="border-t border-[#E2E8F0] hover:bg-[#F8F9FB]">
                        <td className="px-5 py-3 max-w-[220px]">
                          <div className="font-medium text-[#1F2330] truncate">{cs.title}</div>
                          <div className="font-mono text-[11px] text-[#64748B] mt-0.5">{cs.slug}</div>
                        </td>
                        <td className="px-5 py-3">
                          {cs.tag && (
                            <span className="inline-block font-dm font-semibold text-[10.5px] px-2 py-[3px] uppercase tracking-[.1em] rounded-[2px]"
                              style={{ background: 'rgba(27,111,204,.1)', color: '#1B6FCC' }}>
                              {cs.tag}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#64748B]">{cs.client ?? '—'}</td>
                        <td className="px-5 py-3 font-mono text-[12.5px] text-[#64748B]">{cs.year ?? '—'}</td>
                        <td className="px-5 py-3">
                          <Toggle
                            value={cs.is_published}
                            onChange={() => handleToggle(cs.id, 'is_published', cs.is_published)}
                            disabled={toggling === cs.id + 'is_published'}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <Toggle
                            value={cs.is_featured}
                            onChange={() => handleToggle(cs.id, 'is_featured', cs.is_featured)}
                            disabled={toggling === cs.id + 'is_featured'}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2 items-center">
                            <a
                              href={`/case-studies/${cs.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-dm font-semibold uppercase text-[11px] px-[10px] py-[6px] text-[#64748B] transition-colors hover:text-[#1B6FCC]"
                              style={{ border: '1px solid #E2E8F0', borderRadius: '2px' }}
                            >
                              View
                            </a>
                            <button
                              onClick={() => openEdit(cs)}
                              className="font-dm font-semibold uppercase text-[11px] px-[10px] py-[6px] text-white transition-colors"
                              style={{ background: '#2A2F3A', borderRadius: '2px', border: 'none', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cs.id)}
                              disabled={deleting === cs.id}
                              className="font-dm font-semibold uppercase text-[11px] px-[10px] py-[6px] transition-colors"
                              style={{ background: 'rgba(220,38,38,.08)', color: '#DC2626', borderRadius: '2px', border: '1px solid rgba(220,38,38,.2)', cursor: 'pointer', opacity: deleting === cs.id ? 0.5 : 1 }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          style={{ background: 'rgba(0,0,0,.45)' }}
          onClick={closeDrawer}
        />
      )}

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 bg-white flex flex-col overflow-hidden transition-transform duration-300"
        style={{
          width: 'min(580px, 100vw)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-8px 0 40px rgba(0,0,0,.15)',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom: '1px solid #E2E8F0' }}>
          <h2 className="font-barlow font-bold uppercase text-[22px] text-[#1F2330]">
            {editing ? 'Edit Case Study' : 'New Case Study'}
          </h2>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#1F2330] transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}
          >
            ✕
          </button>
        </div>

        {/* Drawer body — scrollable */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* REQUIRED SECTION */}
          <div className="pb-1" style={{ borderBottom: '2px solid #1B6FCC' }}>
            <span className="font-dm text-[10px] uppercase tracking-[.2em] text-[#1B6FCC] font-semibold">Required Fields</span>
          </div>

          {/* Title */}
          <div>
            <Label text="Title" required />
            <input
              className={inputCls}
              style={focusedField === 'title' ? { ...inputStyle, ...inputFocus } : inputStyle}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Flying Shear Automation Migration — Benin"
            />
            {errors.title && <p className="font-dm text-[11px] text-[#DC2626] mt-1">{errors.title}</p>}
            {form.title && (
              <p className="font-mono text-[11px] text-[#64748B] mt-1">slug: {toSlug(form.title)}</p>
            )}
          </div>

          {/* Tag + Client row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label text="Tag / Category" required />
              <input
                className={inputCls}
                style={focusedField === 'tag' ? { ...inputStyle, ...inputFocus } : inputStyle}
                onFocus={() => setFocusedField('tag')}
                onBlur={() => setFocusedField(null)}
                value={form.tag}
                onChange={e => set('tag', e.target.value)}
                placeholder="Manufacturing"
              />
              {errors.tag && <p className="font-dm text-[11px] text-[#DC2626] mt-1">{errors.tag}</p>}
            </div>
            <div>
              <Label text="Client" required />
              <input
                className={inputCls}
                style={focusedField === 'client' ? { ...inputStyle, ...inputFocus } : inputStyle}
                onFocus={() => setFocusedField('client')}
                onBlur={() => setFocusedField(null)}
                value={form.client}
                onChange={e => set('client', e.target.value)}
                placeholder="SIAB"
              />
              {errors.client && <p className="font-dm text-[11px] text-[#DC2626] mt-1">{errors.client}</p>}
            </div>
          </div>

          {/* Sector + Year row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label text="Sector" required />
              <input
                className={inputCls}
                style={focusedField === 'sector' ? { ...inputStyle, ...inputFocus } : inputStyle}
                onFocus={() => setFocusedField('sector')}
                onBlur={() => setFocusedField(null)}
                value={form.sector}
                onChange={e => set('sector', e.target.value)}
                placeholder="Steel Manufacturing"
              />
              {errors.sector && <p className="font-dm text-[11px] text-[#DC2626] mt-1">{errors.sector}</p>}
            </div>
            <div>
              <Label text="Year" required />
              <input
                type="number"
                className={inputCls}
                style={focusedField === 'year' ? { ...inputStyle, ...inputFocus } : inputStyle}
                onFocus={() => setFocusedField('year')}
                onBlur={() => setFocusedField(null)}
                value={form.year}
                onChange={e => set('year', e.target.value)}
                placeholder="2025"
                min="2000"
                max="2099"
              />
              {errors.year && <p className="font-dm text-[11px] text-[#DC2626] mt-1">{errors.year}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label text="Full Description" required />
            <textarea
              className={inputCls}
              style={focusedField === 'description' ? { ...inputStyle, ...inputFocus, resize: 'vertical' } : { ...inputStyle, resize: 'vertical' }}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              rows={6}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the project in detail…"
            />
            {errors.description && <p className="font-dm text-[11px] text-[#DC2626] mt-1">{errors.description}</p>}
          </div>

          {/* Systems Used chip input */}
          <div>
            <Label text="Systems Used" required />
            <div className="flex gap-2">
              <input
                className={inputCls}
                style={focusedField === 'systems' ? { ...inputStyle, ...inputFocus } : inputStyle}
                onFocus={() => setFocusedField('systems')}
                onBlur={() => setFocusedField(null)}
                value={systemInput}
                onChange={e => setSystemInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSystem() } }}
                placeholder="Type system name and press Enter"
              />
              <button
                onClick={addSystem}
                className="font-dm font-semibold text-[11.5px] px-3 flex-shrink-0 text-white"
                style={{ background: '#2A2F3A', borderRadius: '2px', border: 'none', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
            {form.systems_used.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.systems_used.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 font-mono text-[11px] text-[#1F2330] px-2 py-1 rounded-[2px]"
                    style={{ background: '#F8F9FB', border: '1px solid #E2E8F0' }}>
                    {s}
                    <button onClick={() => removeSystem(s)} className="text-[#DC2626] ml-1 hover:opacity-70" style={{ background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                  </span>
                ))}
              </div>
            )}
            {errors.systems_used && <p className="font-dm text-[11px] text-[#DC2626] mt-1">{errors.systems_used}</p>}
          </div>

          {/* OPTIONAL SECTION */}
          <div className="pt-2 pb-1" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <span className="font-dm text-[10px] uppercase tracking-[.2em] text-[#64748B] font-semibold">Optional Fields</span>
          </div>

          {/* Summary */}
          <div>
            <Label text="Short Summary" />
            <textarea
              className={inputCls}
              style={focusedField === 'summary' ? { ...inputStyle, ...inputFocus, resize: 'vertical' } : { ...inputStyle, resize: 'vertical' }}
              onFocus={() => setFocusedField('summary')}
              onBlur={() => setFocusedField(null)}
              rows={3}
              value={form.summary}
              onChange={e => set('summary', e.target.value)}
              placeholder="1–2 sentence overview shown in bold above the description…"
            />
          </div>

          {/* Photos */}
          <div>
            <Label text="Photos" />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files && handleImageUpload(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-dm font-semibold uppercase text-[11.5px] px-4 py-2 text-[#1B6FCC] transition-colors w-full text-center"
              style={{ border: '1px dashed #1B6FCC', borderRadius: '2px', background: 'rgba(27,111,204,.04)', cursor: 'pointer', opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? 'Uploading…' : '+ Upload Photos'}
            </button>
            <p className="font-dm text-[11px] text-[#64748B] mt-1">
              The photo marked MAIN is shown on the card and first in the gallery. Click any other photo to make it the main one.
            </p>
            {form.image_urls.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {form.image_urls.map((url, i) => (
                  <div key={url} className="relative group flex-shrink-0" style={{ width: 80, height: 56 }}>
                    <button
                      onClick={() => i !== 0 && makeMain(url)}
                      title={i === 0 ? 'Main photo' : 'Set as main photo'}
                      className="relative w-full h-full rounded-[2px] overflow-hidden block p-0"
                      style={{
                        border: i === 0 ? '2px solid #1B6FCC' : '1px solid #E2E8F0',
                        cursor: i === 0 ? 'default' : 'pointer',
                        background: 'none',
                      }}
                    >
                      <Image src={url} alt={`Photo ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="80px" />
                      {i !== 0 && (
                        <span
                          className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(27,111,204,.55)' }}
                        >
                          Set main
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => removeImage(url)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-white text-[9px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: '#DC2626', border: 'none', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0.5 left-0.5 font-mono text-[8px] text-white px-1 rounded-[1px]" style={{ background: '#1B6FCC' }}>MAIN</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video URL */}
          <div>
            <Label text="YouTube Embed URL" />
            <input
              className={inputCls}
              style={focusedField === 'video_url' ? { ...inputStyle, ...inputFocus } : inputStyle}
              onFocus={() => setFocusedField('video_url')}
              onBlur={() => setFocusedField(null)}
              value={form.video_url}
              onChange={e => set('video_url', e.target.value)}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
            />
            <p className="font-dm text-[11px] text-[#64748B] mt-1">YouTube → Share → Embed → copy only the src URL.</p>
          </div>

          {/* Toggles row */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center gap-3">
              <Toggle value={form.is_published} onChange={() => set('is_published', !form.is_published)} />
              <span className="font-dm text-[13px] text-[#1F2330]">Published</span>
            </div>
            <div className="flex items-center gap-3">
              <Toggle value={form.is_featured} onChange={() => set('is_featured', !form.is_featured)} />
              <span className="font-dm text-[13px] text-[#1F2330]">Featured on homepage</span>
            </div>
          </div>

        </div>

        {/* Drawer footer */}
        <div className="flex gap-3 px-7 py-5 flex-shrink-0" style={{ borderTop: '1px solid #E2E8F0', background: '#F8F9FB' }}>
          <button
            onClick={closeDrawer}
            className="font-dm font-semibold uppercase text-[11.5px] px-5 py-2.5 text-[#64748B] flex-shrink-0"
            style={{ border: '1px solid #E2E8F0', borderRadius: '2px', background: '#fff', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="font-dm font-semibold uppercase text-[11.5px] px-5 py-2.5 text-white flex-1 transition-opacity"
            style={{ background: '#1B6FCC', borderRadius: '2px', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Case Study'}
          </button>
        </div>
      </div>
    </div>
  )
}
