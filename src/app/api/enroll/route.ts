import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

// Escape user-supplied strings before embedding them in the HTML email.
function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userEmail, courseTitle, notes } = body

  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@matrixea.co',
          to: process.env.CONTACT_EMAIL_TO ?? 'info@matrixea.co',
          subject: `New Enrollment Request: ${esc(courseTitle)}`,
          html: `
            <h2>New Course Enrollment Request</h2>
            <p><strong>Student:</strong> ${esc(userEmail)}</p>
            <p><strong>Course:</strong> ${esc(courseTitle)}</p>
            ${notes ? `<p><strong>Notes:</strong> ${esc(notes)}</p>` : ''}
            <hr>
            <p>Review and confirm this student in the
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/enrollments">admin panel</a>.</p>
          `,
        }),
      })
    } catch (emailError) {
      console.error('Enrollment email failed:', emailError)
    }
  }

  return NextResponse.json({ success: true })
}
