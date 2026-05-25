// Stripe webhook — scaffolded for future activation
// To activate: set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env.local

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 501 })
  }

  try {
    const stripe = await import('stripe').then(m => new m.default(process.env.STRIPE_SECRET_KEY!))
    const event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === 'payment_intent.succeeded') {
      // TODO: Update enrollment status to 'active' based on metadata.enrollment_id
      console.log('Payment succeeded:', event.data.object)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
