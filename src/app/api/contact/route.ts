import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, company, subject, phone, email, message } = body

  if (!name || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
          subject: `New Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        }),
      })
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }
  }

  return NextResponse.json({ success: true })
}
