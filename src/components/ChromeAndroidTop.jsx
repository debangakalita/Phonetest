import { ArrowLeft, MoreVertical } from 'lucide-react'
import { displayUrl } from '../lib/url'

function domainOnly(url) {
  if (typeof url === 'string' && (url.startsWith('blob:') || !url.includes('://'))) {
    return displayUrl(url)
  }
  try {
    const parsed = new URL(url, window.location.origin)
    if (!parsed.hostname) return displayUrl(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return displayUrl(url)
  }
}

export default function ChromeAndroidTop({ url }) {
  return (
    <div className="flex shrink-0 items-center gap-2 bg-white px-2 py-2 font-[system-ui]">
      <button
        type="button"
        aria-label="Back"
        className="flex shrink-0 items-center justify-center text-zinc-700"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="flex h-10 flex-1 items-center rounded-full bg-zinc-100 px-4">
        <span className="min-w-0 flex-1 truncate text-[15px] text-zinc-800">
          {domainOnly(url)}
        </span>
      </div>

      <button
        type="button"
        aria-label="More options"
        className="flex shrink-0 items-center justify-center text-zinc-700"
      >
        <MoreVertical className="h-5 w-5" strokeWidth={1.75} />
      </button>
    </div>
  )
}
