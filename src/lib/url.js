const DEFAULT_URL = '/demo.html'

export function normalizeUrl(value) {
  const trimmed = value.trim()
  if (!trimmed) return DEFAULT_URL

  if (trimmed.startsWith('/')) return trimmed

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
  const url = resolveUrl(value)
  if (!url) return value

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

  const path = url.pathname.replace(/\/+$/, '') || '/'
  return path === '/' || path === '/index.html'
}

export async function canReachUrl(value) {
  const url = resolveUrl(value)
  if (!url) return false

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

export { DEFAULT_URL }
