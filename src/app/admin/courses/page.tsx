'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'

type Course = {
  id: string
  title: string
  slug: string
  short_description: string | null
  price: number
  level: string
  duration_hours: number
  category: string | null
  featured_image: string | null
  is_published: boolean
  created_at: string
}

type FormData = {
  title: string
  slug: string
  short_description: string
  description: string
  outcomes: string          // one outcome per line → converted to array on save
  level: string
  duration_hours: string
  price: string
  category: string
  is_published: boolean
  featured_image: string | null
}

const EMPTY_FORM: FormData = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  outcomes: '',
  level: 'Basic',
  duration_hours: '',
  price: '',
  category: '',
  is_published: true,       // default to published so it appears on the site
  featured_image: null,
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const LEVEL_COLORS: Record<string, string> = {
  All: '#1B6FCC', Basic: '#1B6FCC', Pro: '#1B6FCC', Advanced: '#1B6FCC',
}

const inputCls = 'w-full px-3 py-2.5 text-[14px] font-dm text-matrix-ink border border-matrix-border rounded-xs outline-none focus:border-matrix-blue bg-white'
const labelCls = 'font-dm text-[11px] uppercase tracking-widest text-matrix-muted font-semibold'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Fetch from the server-side API (uses service role → guaranteed) ──
  const fetchCourses = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/courses')
    if (res.ok) {
      const { courses: data } = await res.json()
      setCourses(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchCourses() }, [])

  // ── Toggle publish via API ──
  const togglePublish = async (id: string, current: boolean) => {
    setToggling(id)
    const res = await fetch('/api/admin/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_published: !current }),
    })
    if (res.ok) {
      setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: !current } : c))
    }
    setToggling(null)
  }

  // ── Drawer helpers ──
  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setError(null)
    setDrawerOpen(true)
  }

  const openEdit = (c: Course) => {
    setEditingId(c.id)
    setForm({
      title: c.title,
      slug: c.slug,
      short_description: c.short_description ?? '',
      description: '',         // loaded below via separate fetch if needed
      outcomes: '',
      level: c.level,
      duration_hours: String(c.duration_hours),
      price: String(c.price),
      category: c.category ?? '',
      is_published: c.is_published,
      featured_image: c.featured_image ?? null,
    })
    // Fetch full row to get description / outcomes
    fetch(`/api/admin/courses?id=${c.id}`)
      .then(r => r.json())
      .then(({ course }) => {
        if (course) {
          setForm(prev => ({
            ...prev,
            description: course.description ?? '',
            outcomes: Array.isArray(course.outcomes)
              ? course.outcomes.join('\n')
              : '',
          }))
        }
      })
      .catch(() => {/* ignore */})
    setImageFile(null)
    setImagePreview(c.featured_image ?? null)
    setError(null)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setError(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setForm(prev => ({ ...prev, featured_image: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleField = (key: keyof FormData, value: string | boolean) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !editingId) next.slug = toSlug(value as string)
      return next
    })
  }

  // ── Save via API (service role — guaranteed to work) ──
  const saveCourse = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError(null)

    // Upload image to Supabase Storage if one was selected
    let featuredImageUrl = form.featured_image
    if (imageFile) {
      setUploadingImage(true)
      const supabase = createClient()
      const ext = imageFile.name.split('.').pop()
      const path = `courses/${Date.now()}-${form.slug.trim()}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('course-images')
        .upload(path, imageFile, { upsert: false })
      setUploadingImage(false)
      if (uploadErr) {
        setError(`Image upload failed: ${uploadErr.message}. Make sure the "course-images" storage bucket exists and is public in Supabase Storage.`)
        setSaving(false)
        return
      }
      featuredImageUrl = supabase.storage.from('course-images').getPublicUrl(uploadData.path).data.publicUrl
    }

    // Parse outcomes from textarea (one per line)
    const outcomesArray = form.outcomes
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      outcomes: outcomesArray,
      level: form.level,
      duration_hours: parseInt(form.duration_hours) || 0,
      price: parseFloat(form.price) || 0,
      category: form.category.trim() || null,
      is_published: form.is_published,
      featured_image: featuredImageUrl,
    }

    const res = await fetch('/api/admin/courses', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || 'Save failed. Please try again.')
      setSaving(false)
      return
    }

    // Re-fetch the full list to stay in sync with DB
    await fetchCourses()
    setSaving(false)
    closeDrawer()
  }

  // ── Delete via API ──
  const deleteCourse = async (id: string) => {
    setDeleting(true)
    const res = await fetch('/api/admin/courses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setCourses(prev => prev.filter(c => c.id !== id))
    }
    setConfirmDelete(null)
    setDeleting(false)
  }

  return (
    <div className="bg-matrix-topbar min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
        <div className="mb-7">
          <h1 className="font-barlow font-bold uppercase text-[42px] text-matrix-ink leading-none">Admin Panel</h1>
        </div>

        <div className="grid max-[900px]:grid-cols-1 gap-6" style={{ gridTemplateColumns: '240px 1fr', alignItems: 'start' }}>
          <AdminSidebar />

          <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-matrix-border">
              <h3 className="font-barlow font-bold uppercase text-[22px] tracking-[.04em] text-matrix-ink">
                Courses ({courses.length})
              </h3>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 font-dm font-semibold text-[12px] uppercase tracking-[.04em] text-white rounded-xs transition-colors"
                style={{ background: '#1B6FCC' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#155AA8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1B6FCC')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Course
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center font-mono text-[12px] text-matrix-muted tracking-widest">LOADING…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {['Title', 'Level', 'Duration', 'Price', 'Status', 'Published', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-[10.5px] tracking-[.18em] uppercase text-matrix-muted font-semibold bg-matrix-off">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id} className="border-t border-matrix-border hover:bg-matrix-off">
                        <td className="px-6 py-3">
                          <div className="font-medium text-matrix-ink">{course.title}</div>
                          <div className="font-mono text-[11px] text-matrix-muted mt-0.5">{course.slug}</div>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className="inline-block font-mono text-[10.5px] px-2 py-1 uppercase tracking-widest rounded-xs"
                            style={{ border: `1px solid ${LEVEL_COLORS[course.level] ?? '#E2E8F0'}`, color: LEVEL_COLORS[course.level] ?? '#64748B' }}
                          >
                            {course.level}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-[12.5px] text-matrix-muted">{course.duration_hours}h</td>
                        <td className="px-6 py-3 font-mono text-[13px] text-matrix-ink font-medium">${course.price}</td>
                        <td className="px-6 py-3">
                          <span
                            className="inline-block text-[10.5px] px-2 py-1 font-semibold tracking-widest uppercase rounded-xs"
                            style={{
                              background: course.is_published ? 'rgba(34,197,94,.12)' : 'rgba(100,116,139,.1)',
                              color: course.is_published ? '#16A34A' : '#64748B',
                            }}
                          >
                            {course.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => togglePublish(course.id, course.is_published)}
                            disabled={toggling === course.id}
                            className="relative w-10 h-5 rounded-full transition-colors"
                            style={{
                              background: course.is_published ? '#1B6FCC' : '#E2E8F0',
                              border: 'none', cursor: 'pointer',
                              opacity: toggling === course.id ? 0.5 : 1,
                            }}
                            aria-label={course.is_published ? 'Unpublish' : 'Publish'}
                          >
                            <span
                              className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform"
                              style={{ left: course.is_published ? 'calc(100% - 18px)' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          {confirmDelete === course.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] text-matrix-ink">Delete?</span>
                              <button
                                onClick={() => deleteCourse(course.id)}
                                disabled={deleting}
                                className="text-[11px] font-semibold text-white px-2 py-1 rounded-xs"
                                style={{ background: '#DC2626' }}
                              >
                                {deleting ? '…' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-[11px] font-semibold text-matrix-muted px-2 py-1 rounded-xs"
                                style={{ border: '1px solid #E2E8F0' }}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <a
                                href={`/courses/${course.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-dm font-semibold uppercase text-[11px] px-2.5 py-1.5 text-matrix-muted rounded-xs"
                                style={{ border: '1px solid #E2E8F0' }}
                              >
                                View
                              </a>
                              <button
                                onClick={() => openEdit(course)}
                                className="font-dm font-semibold uppercase text-[11px] px-2.5 py-1.5 text-matrix-blue rounded-xs"
                                style={{ border: '1px solid #1B6FCC' }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setConfirmDelete(course.id)}
                                className="font-dm font-semibold uppercase text-[11px] px-2.5 py-1.5 text-matrix-red rounded-xs"
                                style={{ border: '1px solid #DC2626' }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-matrix-muted text-[14px]">
                          No courses yet — click <strong>Add Course</strong> to create your first one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Slide-in drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-300 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,.45)' }}
            onClick={closeDrawer}
          />
          {/* Panel */}
          <div
            className="relative ml-auto h-full overflow-y-auto flex flex-col"
            style={{ width: '520px', maxWidth: '100vw', background: '#fff', boxShadow: '-8px 0 40px rgba(0,0,0,.15)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-matrix-border shrink-0">
              <h2 className="font-barlow font-bold uppercase text-[22px] text-matrix-ink leading-none">
                {editingId ? 'Edit Course' : 'Add Course'}
              </h2>
              <button onClick={closeDrawer} className="text-matrix-muted hover:text-matrix-ink transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 px-6 py-6 flex flex-col gap-4">
              {error && (
                <div className="text-[13px] text-matrix-red px-4 py-3 rounded-xs" style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)' }}>
                  {error}
                </div>
              )}

              {/* Title */}
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Title *</span>
                <input
                  value={form.title}
                  onChange={e => handleField('title', e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Siemens TIA Portal Advanced"
                />
              </label>

              {/* Slug */}
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Slug * <span className="font-normal normal-case tracking-normal">(URL path — auto-generated)</span></span>
                <input
                  value={form.slug}
                  onChange={e => handleField('slug', e.target.value)}
                  className={`${inputCls} font-mono text-[13px]`}
                  placeholder="e.g. siemens-tia-portal"
                />
              </label>

              {/* Level + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelCls}>Level</span>
                  <select
                    value={form.level}
                    onChange={e => handleField('level', e.target.value)}
                    className={inputCls}
                  >
                    <option>Basic</option>
                    <option>Pro</option>
                    <option>Advanced</option>
                    <option>All</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelCls}>Duration (hours)</span>
                  <input
                    type="number"
                    value={form.duration_hours}
                    onChange={e => handleField('duration_hours', e.target.value)}
                    className={`${inputCls} font-mono`}
                    placeholder="e.g. 24"
                    min="1"
                  />
                </label>
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelCls}>Price (USD)</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => handleField('price', e.target.value)}
                    className={`${inputCls} font-mono`}
                    placeholder="e.g. 199"
                    min="0"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelCls}>Category</span>
                  <input
                    value={form.category}
                    onChange={e => handleField('category', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. PLC, SCADA, VFD"
                  />
                </label>
              </div>

              {/* Image upload */}
              <div className="flex flex-col gap-1.5">
                <span className={labelCls}>
                  Course Image <span className="font-normal normal-case tracking-normal text-matrix-muted">(optional · max 5 MB)</span>
                </span>
                {imagePreview ? (
                  <div>
                    <div className="border border-matrix-border rounded-xs overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-cover" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="font-dm font-semibold text-[11px] uppercase tracking-widest text-matrix-muted px-2.5 py-1 rounded-xs border border-matrix-border">
                        Change
                      </button>
                      <button type="button" onClick={removeImage}
                        className="font-dm font-semibold text-[11px] uppercase tracking-widest text-matrix-red px-2.5 py-1 rounded-xs border border-matrix-border">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-matrix-border rounded-xs text-matrix-muted hover:border-matrix-blue hover:text-matrix-blue transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span className="font-dm font-semibold text-[11px] uppercase tracking-widest">Click to upload image</span>
                    <span className="font-dm text-[11px]">PNG, JPG, WEBP · max 5 MB</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange} className="hidden" />
              </div>

              {/* Short Description */}
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Short Description <span className="font-normal normal-case tracking-normal">(shown on course cards)</span></span>
                <textarea
                  value={form.short_description}
                  onChange={e => handleField('short_description', e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="One or two sentences displayed on course listing cards"
                />
              </label>

              {/* Full Description */}
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Full Description <span className="font-normal normal-case tracking-normal">(shown on course detail page)</span></span>
                <textarea
                  value={form.description}
                  onChange={e => handleField('description', e.target.value)}
                  rows={5}
                  className={`${inputCls} resize-y`}
                  placeholder="Detailed course description — what students will study, tools used, depth of coverage, etc."
                />
              </label>

              {/* Learning Outcomes */}
              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Learning Outcomes <span className="font-normal normal-case tracking-normal">(one per line → shown as checklist)</span></span>
                <textarea
                  value={form.outcomes}
                  onChange={e => handleField('outcomes', e.target.value)}
                  rows={5}
                  className={`${inputCls} resize-y`}
                  placeholder={`Program a Siemens S7-1200 from scratch\nRead and interpret PLC ladder logic\nConfigure I/O modules and HMI screens`}
                />
              </label>

              {/* Publish toggle */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xs"
                style={{ background: form.is_published ? 'rgba(27,111,204,.06)' : '#F8F9FB', border: '1px solid #E2E8F0' }}
              >
                <div>
                  <p className="font-dm font-semibold text-[13.5px] text-matrix-ink">
                    {form.is_published ? 'Published — visible on the site' : 'Draft — hidden from visitors'}
                  </p>
                  <p className="font-dm text-[12px] text-matrix-muted mt-0.5">
                    Toggle off to hide this course without deleting it
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleField('is_published', !form.is_published)}
                  className="relative w-12 h-6 rounded-full transition-colors shrink-0"
                  style={{ background: form.is_published ? '#1B6FCC' : '#CBD5E1', border: 'none', cursor: 'pointer' }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    style={{ left: form.is_published ? 'calc(100% - 20px)' : '4px', boxShadow: '0 1px 3px rgba(0,0,0,.25)' }}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-5 border-t border-matrix-border flex gap-3">
              <button
                onClick={saveCourse}
                disabled={saving || uploadingImage}
                className="flex-1 py-3 font-dm font-semibold text-[13px] uppercase tracking-[.04em] text-white rounded-xs transition-colors"
                style={{
                  background: (saving || uploadingImage) ? '#6B9FD4' : '#1B6FCC',
                  cursor: (saving || uploadingImage) ? 'not-allowed' : 'pointer',
                }}
              >
                {uploadingImage ? 'Uploading image…' : saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Course'}
              </button>
              <button
                onClick={closeDrawer}
                className="px-5 py-3 font-dm font-semibold text-[13px] uppercase tracking-[.04em] text-matrix-ink rounded-xs"
                style={{ border: '1px solid #E2E8F0' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
