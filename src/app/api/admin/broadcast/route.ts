export const runtime = 'edge'

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function buildEmailHtml(subject: string, message: string, appUrl: string, imageUrl: string | null = null) {
  const logoUrl = `${appUrl}/images/logo.jpg`
  const safeMessage = message.replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F6FA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FA;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- ── HEADER ── -->
        <tr>
          <td style="background:#2A2F3A;padding:28px 36px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align:middle;">
                  <!-- Logo mark -->
                  <img src="${logoUrl}" alt="Matrix EA" width="48" height="48"
                    style="border-radius:3px;display:block;background:#fff;" />
                </td>
                <td style="vertical-align:middle;padding-left:16px;">
                  <p style="margin:0;color:#ffffff;font-size:19px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;line-height:1.1;">
                    Matrix Energy &amp; Automation
                  </p>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,0.50);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">
                    matrixea.co
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── SUBJECT BANNER ── -->
        <tr>
          <td style="background:#1B6FCC;padding:18px 36px;">
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.02em;line-height:1.3;">
              ${subject}
            </p>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="background:#ffffff;padding:36px 36px 28px;">
            <p style="margin:0 0 20px;color:#1F2330;font-size:15px;line-height:1.75;">
              ${safeMessage}
            </p>

            ${imageUrl ? `
            <!-- Announcement image -->
            <div style="margin:0 0 24px;border-radius:3px;overflow:hidden;border:1px solid #E2E8F0;">
              <img src="${imageUrl}" alt="Announcement" style="display:block;width:100%;max-width:568px;height:auto;" />
            </div>` : ''}

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td style="background:#1B6FCC;border-radius:2px;">
                  <a href="${appUrl}/courses"
                    style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:0.04em;text-transform:uppercase;">
                    Browse Our Courses →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── DIVIDER ── -->
        <tr><td style="background:#ffffff;padding:0 36px;"><div style="height:1px;background:#E2E8F0;"></div></td></tr>

        <!-- ── CONTACT INFO ── -->
        <tr>
          <td style="background:#ffffff;padding:24px 36px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="width:50%;vertical-align:top;padding-right:12px;">
                  <p style="margin:0 0 4px;color:#64748B;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Phone</p>
                  <a href="tel:+96178800274" style="color:#1B6FCC;font-size:13px;text-decoration:none;">+961 78 800 274</a>
                </td>
                <td style="width:50%;vertical-align:top;padding-left:12px;">
                  <p style="margin:0 0 4px;color:#64748B;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Email</p>
                  <a href="mailto:info@matrixea.co" style="color:#1B6FCC;font-size:13px;text-decoration:none;">info@matrixea.co</a>
                </td>
              </tr>
              <tr><td colspan="2" style="padding-top:16px;">
                <p style="margin:0 0 4px;color:#64748B;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Address</p>
                <p style="margin:0;color:#1F2330;font-size:13px;line-height:1.5;">3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon</p>
              </td></tr>
              <tr><td colspan="2" style="padding-top:10px;">
                <p style="margin:0 0 4px;color:#64748B;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Office Hours</p>
                <p style="margin:0;color:#1F2330;font-size:13px;">Mon–Sat · 09:00–20:00</p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="background:#F4F6FA;border-top:1px solid #E2E8F0;padding:20px 36px;text-align:center;">
            <p style="margin:0 0 8px;color:#64748B;font-size:11px;">
              © 2026 Matrix Energy &amp; Automation sarl · Beirut, Lebanon
            </p>
            <a href="${appUrl}/auth/sign-in"
              style="color:#1B6FCC;font-size:12px;text-decoration:none;">
              Access your account →
            </a>
            <p style="margin:12px 0 0;color:#94A3B8;font-size:10px;">
              You received this email because you have an account on matrixea.co.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

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

  const { subject, message, imageUrl } = await request.json()
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
          html: buildEmailHtml(subject, message, process.env.NEXT_PUBLIC_APP_URL ?? 'https://matrixea.co', imageUrl ?? null),
        }),
      })
      if (res.ok) sent++
      else failed.push(recipient.email!)
    } catch {
      failed.push(recipient.email!)
    }
  }

  // Save to announcements log
  await adminClient.from('announcements').insert({
    subject: subject.trim(),
    message: message.trim(),
    image_url: imageUrl ?? null,
    recipients_count: sent,
  })

  return NextResponse.json({
    sent,
    total: recipients.length,
    ...(failed.length > 0 && { failed }),
  })
}
