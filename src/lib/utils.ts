import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Only allow same-origin, relative redirect targets (must start with a single
 * "/"). Blocks open-redirect abuse via `?redirect=https://evil.com` or
 * protocol-relative `//evil.com` / `/\evil.com`. Falls back otherwise.
 */
export function safeRedirect(path: string | null | undefined, fallback: string): string {
  if (!path || !path.startsWith('/')) return fallback
  // reject protocol-relative ("//host") and backslash tricks ("/\host")
  if (path.length > 1 && (path[1] === '/' || path[1] === '\\')) return fallback
  return path
}
