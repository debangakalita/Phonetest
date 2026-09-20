const BASE_URL = import.meta.env.BASE_URL || '/'
const DEFAULT_URL = `${BASE_URL}demo.html`.replace(/\/{2,}/g, '/')

export function normalizeUrl(value) {
  const trimmed = value.trim()
  if (!trimmed) return DEFAULT_URL

  if (trimmed.startsWith('/')) {
    // Keep app-relative paths under the Vite base (GitHub Pages project URL).
    if (trimmed.startsWith(BASE_URL) || BASE_URL === '/') return trimmed
    return `${BASE_URL}${trimmed.replace(/^\//, '')}`.replace(/\/{2,}/g, '/')
  }

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return trimmed

  return `http://${trimmed}`
}

export function resolveUrl(value, base = window.location.href) {
  try {
    return new URL(value, base)
  } catch {
    return null
  }
}

export function displayUrl(value) {
  if (typeof value === 'string' && value.startsWith('blob:')) {
    return 'local file'
  }

  if (typeof value === 'string' && !value.includes('://') && value.includes('/')) {
    // local folder display label, e.g. lego/index.html
    return value
  }

  const url = resolveUrl(value)
  if (!url) return value

  if (url.protocol === 'blob:') return 'local file'

  const host =
    url.port && url.port !== '80' && url.port !== '443'
      ? `${url.hostname}:${url.port}`
      : url.hostname
  const path = url.pathname === '/' ? '' : url.pathname
  return `${host}${path}${url.search}`
}

/** True when the URL would load this simulator shell inside itself. */
export function isSimulatorShellUrl(value) {
  const url = resolveUrl(value)
  if (!url) return false

  const here = new URL(window.location.href)
  if (url.origin !== here.origin) return false

  const basePath = BASE_URL.replace(/\/+$/, '') || ''
  const path = url.pathname.replace(/\/+$/, '') || '/'

  return (
    path === '/' ||
    path === '/index.html' ||
    path === basePath ||
    path === `${basePath}/index.html`
  )
}

export async function canReachUrl(value) {
  const url = resolveUrl(value)
  if (!url) return false

  if (url.protocol === 'file:' || url.protocol === 'blob:') {
    return url.protocol === 'blob:'
  }

  // Same-origin static assets (demo page) are always fine.
  if (url.origin === window.location.origin) return true

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    await fetch(url.href, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    })
    clearTimeout(timer)
    return true
  } catch {
    return false
  }
}

export { DEFAULT_URL, BASE_URL }
