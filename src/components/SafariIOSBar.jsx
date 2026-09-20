import { BookOpen, ChevronLeft, ChevronRight, Share } from 'lucide-react'
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

function ReloadIcon({ className }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 8A5.5 5.5 0 1 1 11.3 3.4" />
      <path d="M13.5 2.5v3.2h-3.2" />
    </svg>
  )
}

function TabsIcon({ className }) {
  return (
    <svg
      viewBox="0 0 22 22"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6.5" y="6.5" width="12" height="12" rx="2.2" />
      <path d="M15.5 6.5V5.2A2.2 2.2 0 0 0 13.3 3H5.2A2.2 2.2 0 0 0 3 5.2v8.1A2.2 2.2 0 0 0 5.2 15.5H6.5" />
    </svg>
  )
}

export default function SafariIOSBar({ url, onReload }) {
  return (
    <div className="shrink-0 border-t border-gray-200/50 bg-white/85 font-[system-ui] backdrop-blur-md">
      <div className="px-3 pt-2">
        <div className="flex h-10 items-center rounded-[12px] bg-black/[0.06] px-3">
          <span className="w-7 shrink-0 text-[13px] font-semibold tracking-tight text-zinc-600">
            AA
          </span>

          <p className="min-w-0 flex-1 truncate text-center text-[15px] font-normal text-zinc-900">
            {domainOnly(url)}
          </p>

          <button
            type="button"
            onClick={onReload}
            aria-label="Reload"
            className="flex w-7 shrink-0 items-center justify-end text-zinc-600"
          >
            <ReloadIcon className="size-[15px]" />
          </button>
        </div>
      </div>

      <div className="flex h-11 items-center justify-between px-4 text-[#007AFF]">
        <button type="button" aria-label="Back" className="opacity-35">
          <ChevronLeft className="size-7" strokeWidth={1.6} />
        </button>
        <button type="button" aria-label="Forward" className="opacity-35">
          <ChevronRight className="size-7" strokeWidth={1.6} />
        </button>
        <button type="button" aria-label="Share">
          <Share className="size-[21px]" strokeWidth={1.6} />
        </button>
        <button type="button" aria-label="Bookmarks">
          <BookOpen className="size-[21px]" strokeWidth={1.6} />
        </button>
        <button type="button" aria-label="Tabs">
          <TabsIcon className="size-[22px]" />
        </button>
      </div>

      <div className="flex justify-center pb-3 pt-0.5">
        <div className="h-1 w-1/3 rounded-full bg-black" />
      </div>
    </div>
  )
}
