import { AlertCircle } from 'lucide-react'

export default function Viewport({ src, reloadKey, blockedReason }) {
  if (blockedReason) {
    return (
      <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-zinc-50">
        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
          <AlertCircle className="size-8 text-zinc-400" strokeWidth={1.75} />
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-800">Preview unavailable</p>
            <p className="text-[13px] leading-relaxed text-zinc-500">
              {blockedReason}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-white">
      <iframe
        key={reloadKey}
        src={src}
        title="Mobile viewport"
        className="absolute inset-0 h-full w-full border-0 bg-white"
      />
    </div>
  )
}
