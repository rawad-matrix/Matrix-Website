import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

// Escape user input before embedding it in the notification email's HTML.
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Verify a Cloudflare Turnstile token server-side. Returns true when the
// secret isn't configured (feature off) so the form keeps working.
async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const form = new URLSearchParams({ secret, response: token })
    if (ip) form.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, company, subject, phone, email, message, website, captchaToken } = body

  // Honeypot — a real user never fills this. Pretend success so bots don't retry.
  if (website) {
    return NextResponse.json({ success: true })
  }

  // Bot check (no-op until TURNSTILE_SECRET_KEY is set).
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')
  if (!(await verifyTurnstile(captchaToken, ip))) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  }

  if (!name || !subject || !message || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Reject oversized payloads (spam / abuse).
  if (
    String(name).length > 200 || String(subject).length > 300 ||
    String(message).length > 5000 || String(company ?? '').length > 200 ||
    String(phone ?? '').length > 60 || String(email ?? '').length > 200
  ) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.from('contact_submissions').insert({
    name, company, subject, phone, email, message, status: 'new',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send email via Resend if API key is configured
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Matrix EA Website <noreply@matrixea.co>',
          to: process.env.CONTACT_EMAIL_TO ?? 'info@matrixea.co',
          reply_to: email || undefined,
          subject: `New Contact Form: ${esc(subject)}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${esc(name)}</p>
            ${company ? `<p><strong>Company:</strong> ${esc(company)}</p>` : ''}
            <p><strong>Subject:</strong> ${esc(subject)}</p>
            ${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ''}
            ${email ? `<p><strong>Email:</strong> ${esc(email)}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${esc(message).replace(/\n/g, '<br>')}</p>
          `,
        }),
      })
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }
  }

  return NextResponse.json({ success: true })
}
