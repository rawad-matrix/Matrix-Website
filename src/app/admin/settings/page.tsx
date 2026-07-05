'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '../AdminSidebar'
import { Turnstile, TURNSTILE_ENABLED } from '@/components/ui/Turnstile'

type ProfileForm = {
  full_name: string
  phone: string
  company: string
}

export default function AdminSettingsPage() {
  const [email, setEmail] = useState('')
  const [form, setForm] = useState<ProfileForm>({ full_name: '', phone: '', company: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [resetSending, setResetSending] = useState(false)
  const [resetMsg, setResetMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [captchaToken, setCaptchaToken] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setEmail(user.email ?? '')
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, company')
        .eq('id', user.id)
        .single()
      if (profile) {
        setForm({
          full_name: profile.full_name ?? '',
          phone: profile.phone ?? '',
          company: profile.company ?? '',
        })
      }
      setLoading(false)
    })
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    setSaveMsg(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name.trim() || null,
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
    }).eq('id', user.id)
    setSaving(false)
    if (error) setSaveMsg({ ok: false, text: error.message })
    else setSaveMsg({ ok: true, text: 'Profile updated successfully.' })
  }

  const sendReset = async () => {
    if (TURNSTILE_ENABLED && !captchaToken) {
      setResetMsg({ ok: false, text: 'Please complete the verification below.' })
      return
    }
    setResetSending(true)
    setResetMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      captchaToken: captchaToken || undefined,
    })
    setResetSending(false)
    if (error) setResetMsg({ ok: false, text: error.message })
    else setResetMsg({ ok: true, text: `Password reset email sent to ${email}.` })
  }

  const fieldClass = 'w-full px-3 py-2.5 text-[14px] font-dm text-matrix-ink border border-matrix-border rounded-xs outline-none focus:border-matrix-blue transition-colors'
  const labelClass = 'font-dm text-[11px] uppercase tracking-widest text-matrix-muted font-semibold'

  return (
    <div className="bg-matrix-topbar min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-8 max-[640px]:px-5">
        <div className="mb-7">
          <h1 className="font-barlow font-bold uppercase text-[42px] text-matrix-ink leading-none">Admin Panel</h1>
        </div>

        <div className="grid max-[900px]:grid-cols-1 gap-6" style={{ gridTemplateColumns: '240px 1fr', alignItems: 'start' }}>
          <AdminSidebar />

          <div className="flex flex-col gap-6">

            {/* ── Profile ─────────────────────────────────── */}
            <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-matrix-border">
                <h3 className="font-barlow font-bold uppercase text-[20px] tracking-[.04em] text-matrix-ink leading-none">
                  Profile
                </h3>
                <p className="font-dm text-[13px] text-matrix-muted mt-1">
                  Update your admin display name and contact info.
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-center font-mono text-[12px] text-matrix-muted tracking-widest">LOADING…</div>
              ) : (
                <div className="px-6 py-6 flex flex-col gap-4">
                  {/* Email (read-only) */}
                  <div className="flex flex-col gap-1.5">
                    <span className={labelClass}>Email (read-only)</span>
                    <input
                      value={email}
                      readOnly
                      className={`${fieldClass} bg-matrix-off text-matrix-muted cursor-not-allowed`}
                    />
                    <span className="text-[11.5px] text-matrix-muted font-dm">Email is managed through Supabase Auth and cannot be changed here.</span>
                  </div>

                  <div className="grid grid-cols-2 max-[520px]:grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="full_name" className={labelClass}>Full Name</label>
                      <input
                        id="full_name"
                        value={form.full_name}
                        onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                        className={fieldClass}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className={labelClass}>Phone</label>
                      <input
                        id="phone"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className={fieldClass}
                        placeholder="+961 78 800 274"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className={labelClass}>Company / Title</label>
                    <input
                      id="company"
                      value={form.company}
                      onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                      className={fieldClass}
                      placeholder="e.g. Matrix Energy & Automation"
                    />
                  </div>

                  {saveMsg && (
                    <div
                      className="text-[13px] px-4 py-3 rounded-xs"
                      style={{
                        background: saveMsg.ok ? 'rgba(34,197,94,.08)' : 'rgba(220,38,38,.08)',
                        border: `1px solid ${saveMsg.ok ? 'rgba(34,197,94,.25)' : 'rgba(220,38,38,.25)'}`,
                        color: saveMsg.ok ? '#16A34A' : '#DC2626',
                      }}
                    >
                      {saveMsg.text}
                    </div>
                  )}

                  <div>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="px-6 py-3 font-dm font-semibold text-[13px] uppercase tracking-[.04em] text-white rounded-xs transition-colors"
                      style={{ background: saving ? '#6B9FD4' : '#1B6FCC', cursor: saving ? 'not-allowed' : 'pointer' }}
                    >
                      {saving ? 'Saving…' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Security ────────────────────────────────── */}
            <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-matrix-border">
                <h3 className="font-barlow font-bold uppercase text-[20px] tracking-[.04em] text-matrix-ink leading-none">
                  Security
                </h3>
                <p className="font-dm text-[13px] text-matrix-muted mt-1">
                  Change your admin account password.
                </p>
              </div>
              <div className="px-6 py-6 flex flex-col gap-4">
                <p className="font-dm text-[14px] text-matrix-ink">
                  Click the button below to receive a password reset link at <strong>{email || '…'}</strong>.
                  The link expires after 1 hour.
                </p>

                {resetMsg && (
                  <div
                    className="text-[13px] px-4 py-3 rounded-xs"
                    style={{
                      background: resetMsg.ok ? 'rgba(34,197,94,.08)' : 'rgba(220,38,38,.08)',
                      border: `1px solid ${resetMsg.ok ? 'rgba(34,197,94,.25)' : 'rgba(220,38,38,.25)'}`,
                      color: resetMsg.ok ? '#16A34A' : '#DC2626',
                    }}
                  >
                    {resetMsg.text}
                  </div>
                )}

                <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />

                <div>
                  <button
                    onClick={sendReset}
                    disabled={resetSending || !email}
                    className="px-6 py-3 font-dm font-semibold text-[13px] uppercase tracking-[.04em] rounded-xs transition-colors"
                    style={{
                      background: 'transparent',
                      border: '1px solid #1B6FCC',
                      color: '#1B6FCC',
                      cursor: resetSending ? 'not-allowed' : 'pointer',
                      opacity: resetSending ? 0.6 : 1,
                    }}
                  >
                    {resetSending ? 'Sending…' : 'Send Password Reset Email'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── About ──────────────────────────────────── */}
            <div className="bg-white border border-matrix-border rounded-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-matrix-border">
                <h3 className="font-barlow font-bold uppercase text-[20px] tracking-[.04em] text-matrix-ink leading-none">
                  Site Info
                </h3>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 max-[520px]:grid-cols-1 gap-x-8 gap-y-3 text-[13.5px]">
                {[
                  ['Domain', 'matrixea.co'],
                  ['Contact Email', 'info@matrixea.co'],
                  ['Phone', '+961 78 800 274'],
                  ['Address', 'Khaldeh, Beirut — Lebanon'],
                  ['Hours', 'Mon–Sat 09:00–20:00'],
                  ['Stack', 'Next.js · Supabase · Vercel'],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <span className="font-dm text-[10.5px] uppercase tracking-widest text-matrix-muted font-semibold">{k}</span>
                    <span className="font-dm text-matrix-ink">{v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
