'use client'

import { useEffect, useRef } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

// True only when a site key is configured. Forms use this to decide whether
// a captcha token is required, so the site works normally until keys are set.
export const TURNSTILE_ENABLED = !!SITE_KEY

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
  reset: (id?: string) => void
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

/**
 * Cloudflare Turnstile widget. Calls onVerify(token) when solved and
 * onExpire() when the token expires. Renders nothing if no site key is set.
 */
export function Turnstile({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void
  onExpire?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  // Keep the latest callbacks without re-running the effect.
  const cb = useRef({ onVerify, onExpire })
  cb.current = { onVerify, onExpire }

  useEffect(() => {
    if (!SITE_KEY) return
    let cancelled = false

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => cb.current.onVerify(token),
        'expired-callback': () => cb.current.onExpire?.(),
        'error-callback': () => cb.current.onExpire?.(),
      })
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]')
      if (!script) {
        script = document.createElement('script')
        script.src = SCRIPT_SRC
        script.async = true
        script.defer = true
        script.setAttribute('data-turnstile', 'true')
        document.head.appendChild(script)
      }
      script.addEventListener('load', renderWidget)
    }

    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current) } catch {}
        widgetId.current = null
      }
    }
  }, [])

  if (!SITE_KEY) return null
  return <div ref={containerRef} className="my-4" />
}
