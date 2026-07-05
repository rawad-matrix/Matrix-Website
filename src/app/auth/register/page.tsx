'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { safeRedirect } from '@/lib/utils'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  company: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Select your role'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((v) => v, 'You must agree to the terms'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

const ROLES = [
  'Plant Manager', 'Maintenance Lead', 'Operator', 'Electrical Engineer',
  'Mechanical Engineer', 'Mechatronics Engineer', 'Industrial / Process Engineer',
  'Automation / Controls Engineer', 'Instrumentation Engineer', 'Energy / Solar Engineer',
  'Technician', 'Student', 'Procurement', 'Executive / Management', 'Other',
]

const fieldStyle = (error?: boolean) => ({
  width: '100%',
  padding: '14px 16px',
  border: `1px solid ${error ? '#DC2626' : '#E2E8F0'}`,
  borderRadius: '2px',
  fontSize: '14.5px',
  color: '#1F2330',
  outline: 'none',
  transition: 'border-color .15s',
  fontFamily: 'inherit',
  background: '#fff',
})

function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = safeRedirect(searchParams.get('redirect'), '/user/dashboard')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    const supabase = createClient()
    const fullName = `${data.firstName} ${data.lastName}`.trim()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: fullName, company: data.company, role: data.role },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div
      style={{ minHeight: 'calc(100vh - 108px)' }}
      className="grid grid-cols-1 md:grid-cols-2"
    >
      {/* Left aside */}
      <aside
        className="relative overflow-hidden flex flex-col justify-between px-16 py-20 max-md:px-8 max-md:py-12"
        style={{ background: '#2A2F3A', color: '#fff' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(rgba(27,111,204,.05) 1px, transparent 1px) 0 0/40px 40px,
              linear-gradient(90deg, rgba(27,111,204,.05) 1px, transparent 1px) 0 0/40px 40px,
              radial-gradient(ellipse at 80% 20%, rgba(27,111,204,.18) 0%, transparent 50%)
            `,
          }}
        />
        <div className="relative z-10">
          <span
            className="inline-flex items-center gap-2 mb-6"
            style={{
              background: 'rgba(27,111,204,.12)',
              border: '1px solid rgba(27,111,204,.35)',
              color: '#1B6FCC',
              padding: '8px 14px',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              borderRadius: '2px',
            }}
          >
            Client Access
          </span>
          <h2
            className="font-barlow font-bold uppercase leading-none mb-4"
            style={{ fontSize: '48px' }}
          >
            Request a Matrix<br />
            <span style={{ color: '#1B6FCC' }}>Client Account.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '16px', lineHeight: 1.6, maxWidth: '380px' }}>
            Matrix accounts are issued to verified clients with active projects or maintenance contracts.
          </p>
          <ul className="mt-9 flex flex-col gap-3">
            {[
              'Free for all active Matrix clients',
              'Per-user permissions & site access',
              '2FA enabled by default',
              'Audited access logs',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3" style={{ color: 'rgba(255,255,255,.78)', fontSize: '14px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#1B6FCC" strokeWidth="2" width="18" height="18" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <span
          className="relative z-10 font-mono"
          style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', letterSpacing: '.08em' }}
        >
          MATRIX EA · provisioning · &lt; 24h SLA
        </span>
      </aside>

      {/* Right form */}
      <main className="flex flex-col justify-center px-16 py-12 bg-white max-md:px-6 max-md:py-10">
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          <h1 className="font-barlow font-bold uppercase text-[42px] mb-2" style={{ color: '#1F2330' }}>
            Create Account
          </h1>
          <p className="mb-8" style={{ color: '#64748B', fontSize: '14.5px' }}>
            All fields required. We verify against your active contract.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                  First Name
                </label>
                <input type="text" {...register('firstName')} style={fieldStyle(!!errors.firstName)}
                  onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                  onBlur={(e) => (e.target.style.borderColor = errors.firstName ? '#DC2626' : '#E2E8F0')} />
                {errors.firstName && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                  Last Name
                </label>
                <input type="text" {...register('lastName')} style={fieldStyle(!!errors.lastName)}
                  onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                  onBlur={(e) => (e.target.style.borderColor = errors.lastName ? '#DC2626' : '#E2E8F0')} />
                {errors.lastName && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                Email
              </label>
              <input type="email" {...register('email')} style={fieldStyle(!!errors.email)}
                onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                onBlur={(e) => (e.target.style.borderColor = errors.email ? '#DC2626' : '#E2E8F0')} />
              {errors.email && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
            </div>

            {/* Company */}
            <div className="mb-4">
              <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                Company
              </label>
              <input type="text" {...register('company')} style={fieldStyle(!!errors.company)}
                onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                onBlur={(e) => (e.target.style.borderColor = errors.company ? '#DC2626' : '#E2E8F0')} />
              {errors.company && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.company.message}</p>}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                Role
              </label>
              <select {...register('role')} style={fieldStyle(!!errors.role)}
                onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                onBlur={(e) => (e.target.style.borderColor = errors.role ? '#DC2626' : '#E2E8F0')}>
                <option value="">Select your role</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.role.message}</p>}
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                  Password
                </label>
                <input type="password" placeholder="Min 8 chars" {...register('password')} style={fieldStyle(!!errors.password)}
                  onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                  onBlur={(e) => (e.target.style.borderColor = errors.password ? '#DC2626' : '#E2E8F0')} />
                {errors.password && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>}
              </div>
              <div>
                <label className="block mb-2 font-dm font-semibold uppercase" style={{ fontSize: '11px', letterSpacing: '.18em', color: '#64748B' }}>
                  Confirm
                </label>
                <input type="password" {...register('confirmPassword')} style={fieldStyle(!!errors.confirmPassword)}
                  onFocus={(e) => (e.target.style.borderColor = '#1B6FCC')}
                  onBlur={(e) => (e.target.style.borderColor = errors.confirmPassword ? '#DC2626' : '#E2E8F0')} />
                {errors.confirmPassword && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 mb-6" style={{ fontSize: '13px' }}>
              <input type="checkbox" {...register('terms')} style={{ accentColor: '#1B6FCC', width: '16px', height: '16px' }} />
              <label style={{ color: '#1F2330', cursor: 'pointer' }}>
                I agree to the{' '}
                <Link href="/terms" style={{ color: '#1B6FCC', fontWeight: 500 }}>terms of service</Link>
              </label>
            </div>
            {errors.terms && <p style={{ color: '#DC2626', fontSize: '12px', marginBottom: '12px' }}>{errors.terms.message}</p>}

            {serverError && (
              <div
                className="mb-4 px-4 py-3"
                style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', borderRadius: '2px', color: '#DC2626', fontSize: '13.5px' }}
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-dm font-semibold uppercase"
              style={{
                padding: '16px',
                background: loading ? '#64748B' : '#1B6FCC',
                color: '#fff',
                border: 'none',
                borderRadius: '2px',
                fontSize: '13.5px',
                letterSpacing: '.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .15s',
              }}
            >
              {loading ? 'Creating account…' : 'Create an Account'}
              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>

            <p className="text-center mt-6" style={{ fontSize: '13.5px', color: '#64748B' }}>
              Already have an account?{' '}
              <Link href="/auth/sign-in" style={{ color: '#1B6FCC', fontWeight: 600 }}>
                Sign in →
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function RegisterPageWrapper() {
  return <Suspense><RegisterPage /></Suspense>
}
