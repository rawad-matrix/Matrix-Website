import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userEmail, courseTitle, coursePrice, reference, accountName, bankName, notes } = body

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
          subject: `New Enrollment: ${courseTitle}`,
          html: `
            <h2>New Course Enrollment — Payment Confirmation</h2>
            <p><strong>Student:</strong> ${userEmail}</p>
            <p><strong>Course:</strong> ${courseTitle}</p>
            <p><strong>Amount:</strong> $${coursePrice} USD</p>
            <hr>
            <p><strong>Account Holder:</strong> ${accountName}</p>
            <p><strong>Bank:</strong> ${bankName}</p>
            <p><strong>Transfer Reference:</strong> ${reference}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <hr>
            <p>Please verify the transfer and activate the enrollment in the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/enrollments">admin panel</a>.</p>
          `,
        }),
      })
    } catch (emailError) {
      console.error('Enrollment email failed:', emailError)
    }
  }

  return NextResponse.json({ success: true })
}
