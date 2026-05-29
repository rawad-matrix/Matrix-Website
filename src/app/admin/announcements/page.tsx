'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'

type SendResult = { sent: number; total: number; failed?: string[] }

export default function AnnouncementsPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canSend = subject.trim().length > 0 && message.trim().length > 0 && !loading && !uploading

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    setLoading(true)
    setError('')
    setResult(null)

    let imageUrl: string | null = null

    // Upload image to Supabase Storage if one was selected
    if (imageFile) {
      setUploading(true)
      try {
        const supabase = createClient()
        const ext = imageFile.name.split('.').pop()
        const path = `announcements/${Date.now()}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('announcement-images')
          .upload(path, imageFile, { upsert: false })

        if (uploadError) {
          setError(`Image upload failed: ${uploadError.message}. Make sure the "announcement-images" storage bucket exists in Supabase.`)
          setLoading(false)
          setUploading(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('announcement-images')
          .getPublicUrl(uploadData.path)
        imageUrl = publicUrl
      } catch {
        setError('Image upload failed. Check your Supabase Storage settings.')
        setLoading(false)
        setUploading(false)
        return
      }
      setUploading(false)
    }

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          imageUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send. Please try again.')
      } else {
        setResult(data)
        if (data.sent > 0) {
          setSubject('')
          setMessage('')
          removeImage()
        }
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    padding: '12px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '2px',
    fontSize: '14px',
    color: '#1F2330',
    outline: 'none',
    width: '100%',
  }

  return (
    <div style={{ background: '#F4F6FA', minHeight: 'calc(100vh - 108px)' }}>
      <div
        className="max-w-7xl mx-auto px-6 py-10"
        style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}
      >
        <AdminSidebar />

        <main>
          <div className="mb-6">
            <h1 className="font-barlow font-bold uppercase text-[32px] text-matrix-ink">
              Announcements
            </h1>
            <p className="text-matrix-muted text-[14px] mt-1">
              Send an email announcement to all registered client accounts.
            </p>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
            {/* Compose form */}
            <div className="bg-white border border-matrix-border p-8 rounded-xs">
              <h2 className="font-barlow font-bold uppercase text-[20px] text-matrix-ink mb-6">
                Compose Message
              </h2>

              <form onSubmit={handleSend}>
                {/* Subject */}
                <div className="mb-5">
                  <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-matrix-muted">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. New PLC Training Courses Available"
                    required
                    className="font-dm"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>

                {/* Message */}
                <div className="mb-5">
                  <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-matrix-muted">
                    Message Body
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your announcement here. Line breaks are preserved in the email."
                    required
                    rows={10}
                    className="font-dm"
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block mb-2 font-dm font-semibold uppercase text-[11px] tracking-[.18em] text-matrix-muted">
                    Announcement Image <span className="font-normal normal-case tracking-normal text-matrix-muted">(optional · max 5 MB)</span>
                  </label>

                  {imagePreview ? (
                    <div className="relative">
                      {/* Preview */}
                      <div className="border border-matrix-border rounded-xs overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover" />
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-dm text-[12px] text-matrix-muted truncate flex-1">{imageFile?.name}</span>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="font-dm font-semibold text-[11px] uppercase tracking-widest text-matrix-red px-2.5 py-1 rounded-xs border border-matrix-red/30"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="font-dm font-semibold text-[11px] uppercase tracking-widest text-matrix-muted px-2.5 py-1 rounded-xs border border-matrix-border"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-matrix-border rounded-xs text-matrix-muted hover:border-matrix-blue hover:text-matrix-blue transition-colors"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span className="font-dm font-semibold text-[12px] uppercase tracking-widest">Click to attach an image</span>
                      <span className="font-dm text-[11px]">PNG, JPG, WEBP · max 5 MB</span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Error / Result */}
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xs text-[13.5px]"
                    style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', color: '#DC2626' }}>
                    {error}
                  </div>
                )}

                {result && (
                  <div className="mb-4 px-4 py-3 rounded-xs text-[13.5px]"
                    style={{
                      background: result.sent > 0 ? 'rgba(34,197,94,.08)' : 'rgba(255,178,0,.08)',
                      border: `1px solid ${result.sent > 0 ? 'rgba(34,197,94,.25)' : 'rgba(255,178,0,.3)'}`,
                      color: result.sent > 0 ? '#16A34A' : '#B45309',
                    }}>
                    {result.total === 0
                      ? 'No client accounts found to send to.'
                      : `Sent to ${result.sent} of ${result.total} recipients.${result.failed?.length ? ` ${result.failed.length} failed.` : ''}`
                    }
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSend}
                  className="flex items-center gap-2 font-dm font-semibold uppercase"
                  style={{
                    padding: '13px 28px',
                    background: canSend ? '#1B6FCC' : '#64748B',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '13px',
                    letterSpacing: '.04em',
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    transition: 'background .15s',
                  }}
                >
                  {uploading ? 'Uploading image…' : loading ? 'Sending…' : 'Send to All Clients'}
                  {!loading && !uploading && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </form>
            </div>

            {/* Info card */}
            <div className="bg-white border border-matrix-border p-6 rounded-xs">
              <h3 className="font-barlow font-bold uppercase text-[16px] text-matrix-ink mb-4">
                How It Works
              </h3>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="16" height="16">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ),
                    text: 'Sent to all registered users except admin accounts.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="16" height="16">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    ),
                    text: 'Optional image appears in the email body — great for promotions or banners.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="16" height="16">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    text: 'Sent from info@matrixea.co with your full branding.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#FFB200" strokeWidth="2" width="16" height="16">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    ),
                    text: 'This sends immediately — double-check before clicking Send.',
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13.5px] text-matrix-ink">
                    <span style={{ flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-matrix-border">
                <p className="font-dm text-[11.5px] text-matrix-muted leading-relaxed">
                  <strong className="text-matrix-ink">Storage bucket required</strong> for images:<br />
                  In Supabase → Storage, create a public bucket named{' '}
                  <code className="font-mono bg-matrix-off px-1 py-0.5 rounded border border-matrix-border text-[10.5px]">
                    announcement-images
                  </code>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
