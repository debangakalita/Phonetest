function AndroidSignalIcon({ className }) {
  return (
    <svg
      viewBox="0 0 16 14"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="0" y="10" width="3" height="4" rx="0.5" />
      <rect x="4.3" y="7" width="3" height="7" rx="0.5" />
      <rect x="8.6" y="3.5" width="3" height="10.5" rx="0.5" />
      <rect x="12.9" y="0" width="3" height="14" rx="0.5" />
    </svg>
  )
}

function AndroidBatteryIcon({ className }) {
  return (
    <svg
      viewBox="0 0 12 18"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.25"
        y="0.5"
        width="7.5"
        height="2"
        rx="0.6"
        fill="currentColor"
        fillOpacity="0.55"
      />
      <rect
        x="1"
        y="2"
        width="10"
        height="15.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <rect x="2.6" y="3.6" width="6.8" height="12.2" rx="1.1" fill="currentColor" />
    </svg>
  )
}

export default function AndroidSystemUI({ device, children }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white font-[system-ui] text-zinc-900">
      <div className="relative z-20 shrink-0">
        {device.cutout === 'punch-hole' ? (
          <div
            className="mx-auto mt-2 h-3.5 w-3.5 rounded-full bg-black"
            aria-hidden="true"
          />
        ) : null}

        <div className="flex h-7 items-center justify-between px-4 text-[12px] font-medium">
          <span className="tabular-nums tracking-tight">23:17</span>
          <div className="flex items-center gap-1.5">
            <AndroidSignalIcon className="h-[12px] w-[14px]" />
            <span className="text-[11px] font-medium tabular-nums">100%</span>
            <AndroidBatteryIcon className="h-[14px] w-[10px]" />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>

      <div className="flex shrink-0 justify-center pb-1 pt-1">
        <div className="mb-1 h-1 w-24 rounded-full bg-zinc-600" />
      </div>
    </div>
  )
}
