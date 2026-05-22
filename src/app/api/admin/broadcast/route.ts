import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify caller is an admin using their session
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { subject, message } = await request.json()
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
  }

  // Use service role to list all auth users
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: authData, error: usersError } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
  if (usersError) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  // Get all admin profile IDs to exclude them
  const { data: adminProfiles } = await adminClient
    .from('profiles')
    .select('id')
    .eq('role', 'admin')

  const adminIds = new Set(adminProfiles?.map((p) => p.id) ?? [])

  const recipients = authData.users.filter((u) => u.email && !adminIds.has(u.id))

  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, total: 0 })
  }

  let sent = 0
  const failed: string[] = []

  for (const recipient of recipients) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Matrix EA <info@matrixea.co>',
          to: recipient.email,
          subject,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #E2E8F0;">
              <div style="background:#2A2F3A;padding:28px 32px;">
                <p style="color:#fff;margin:0;font-size:20px;font-weight:700;letter-spacing:0.04em;">
                  MATRIX ENERGY &amp; AUTOMATION
                </p>
                <p style="color:rgba(255,255,255,0.55);margin:6px 0 0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;">
                  matrixea.co
                </p>
              </div>
              <div style="padding:36px 32px;background:#ffffff;">
                <p style="color:#1F2330;font-size:15px;line-height:1.7;white-space:pre-line;">${message}</p>
              </div>
              <div style="padding:20px 32px;background:#F4F6FA;border-top:1px solid #E2E8F0;text-align:center;">
                <p style="color:#64748B;font-size:12px;margin:0 0 8px;">
                  © 2026 Matrix Energy &amp; Automation sarl · Beirut, Lebanon
                </p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-in"
                  style="color:#1B6FCC;font-size:12px;text-decoration:none;">
                  Access your account →
                </a>
              </div>
            </div>
          `,
        }),
      })
      if (res.ok) sent++
      else failed.push(recipient.email!)
    } catch {
      failed.push(recipient.email!)
    }
  }

  return NextResponse.json({
    sent,
    total: recipients.length,
    ...(failed.length > 0 && { failed }),
  })
}
