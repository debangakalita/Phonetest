import { Lock, Share } from 'lucide-react'
import { displayUrl } from '../lib/url'

function domainOnly(url) {
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return displayUrl(url)
  }
}

export default function ChromeIOSTopBar({ url }) {
  return (
    <div className="shrink-0 bg-white font-[system-ui]">
      <div className="mx-3 my-1 flex h-10 items-center justify-between rounded-full bg-zinc-100 px-3">
        <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-500" strokeWidth={2} />
        <p className="min-w-0 flex-1 truncate px-2 text-center text-sm font-medium text-zinc-800">
          {domainOnly(url)}
        </p>
        <button
          type="button"
          aria-label="Share"
          className="flex shrink-0 items-center justify-center text-zinc-500"
        >
          <Share className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
