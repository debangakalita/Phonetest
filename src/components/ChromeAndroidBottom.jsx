import { Home, Plus, Sparkles } from 'lucide-react'

export default function ChromeAndroidBottom() {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-t border-zinc-200/60 bg-zinc-50 px-6 font-[system-ui] text-zinc-700">
      <button type="button" aria-label="Home">
        <Home className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <button type="button" aria-label="AI">
        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <button type="button" aria-label="New tab">
        <Plus className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Tabs"
        className="flex h-5 w-5 items-center justify-center rounded-md border-[1.5px] border-zinc-700 text-[11px] font-bold text-zinc-700"
      >
        1
      </button>
    </div>
  )
}
