import { ArrowLeft, ArrowRight, MoreHorizontal, Plus } from 'lucide-react'

export default function ChromeIOSBottomBar() {
  return (
    <div className="shrink-0 border-t border-zinc-200 bg-white/90 px-4 py-2 font-[system-ui] text-zinc-600 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <button type="button" aria-label="Back" className="opacity-40">
          <ArrowLeft size={18} strokeWidth={1.75} />
        </button>
        <button type="button" aria-label="Forward" className="opacity-40">
          <ArrowRight size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="New tab"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200/70 text-zinc-700"
        >
          <Plus size={18} strokeWidth={2.25} className="font-bold" />
        </button>
        <button
          type="button"
          aria-label="Tabs"
          className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-zinc-600 text-[10px] font-bold text-zinc-700"
        >
          1
        </button>
        <button type="button" aria-label="More options">
          <MoreHorizontal size={20} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
