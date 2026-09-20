function CellularIcon({ className }) {
  return (
    <svg
      viewBox="0 0 19.2 12.2"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1.2 7.5h2.1c.5 0 .9.4.9.9v2.9c0 .5-.4.9-.9.9H1.2c-.5 0-.9-.4-.9-.9V8.4c0-.5.4-.9.9-.9Z" />
      <path d="M6.1 5.2h2.1c.5 0 .9.4.9.9v5.2c0 .5-.4.9-.9.9H6.1c-.5 0-.9-.4-.9-.9V6.1c0-.5.4-.9.9-.9Z" />
      <path d="M11 2.6h2.1c.5 0 .9.4.9.9v7.8c0 .5-.4.9-.9.9H11c-.5 0-.9-.4-.9-.9V3.5c0-.5.4-.9.9-.9Z" />
      <path d="M15.9 0h2.1c.5 0 .9.4.9.9v10.4c0 .5-.4.9-.9.9h-2.1c-.5 0-.9-.4-.9-.9V.9c0-.5.4-.9.9-.9Z" />
    </svg>
  )
}

function WifiIcon({ className }) {
  return (
    <svg
      viewBox="0 0 17 12.2"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8.5 10.15a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7Z" />
      <path d="M4.55 7.55a5.6 5.6 0 0 1 7.9 0 .75.75 0 0 1-1.06 1.06 4.1 4.1 0 0 0-5.78 0 .75.75 0 1 1-1.06-1.06Z" />
      <path d="M1.55 4.45a9.8 9.8 0 0 1 13.9 0 .75.75 0 0 1-1.06 1.06 8.3 8.3 0 0 0-11.78 0 .75.75 0 0 1-1.06-1.06Z" />
      <path d="M8.5.35c3.55 0 6.78 1.45 9.1 3.8a.75.75 0 1 1-1.08 1.04A11.35 11.35 0 0 0 8.5 1.85 11.35 11.35 0 0 0 .48 5.19.75.75 0 1 1-.6 4.15 12.85 12.85 0 0 1 8.5.35Z" />
    </svg>
  )
}

function BatteryIcon({ className }) {
  return (
    <svg
      viewBox="0 0 27.5 13"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* Outer shell */}
      <rect
        x="0.5"
        y="0.75"
        width="23"
        height="11.5"
        rx="3.5"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      {/* Right terminal nub */}
      <path
        d="M25 4.4c1.35.4 1.35 3.8 0 4.2V4.4Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
      {/* Inner fill with padding */}
      <rect
        x="2.1"
        y="2.35"
        width="19.8"
        height="8.3"
        rx="2.2"
        fill="currentColor"
      />
    </svg>
  )
}

export default function StatusBar({ time = '9:41' }) {
  return (
    <div className="relative z-20 flex h-[50px] shrink-0 items-end justify-between bg-white px-7 pb-[10px] font-[system-ui] text-black">
      <span className="min-w-[48px] text-[13px] font-semibold leading-none tracking-tight tabular-nums">
        {time}
      </span>
      <div className="mb-px flex items-center gap-[5px]">
        <CellularIcon className="h-[11px] w-[18px]" />
        <WifiIcon className="h-[12px] w-[16px]" />
        <BatteryIcon className="h-[12px] w-[26px]" />
      </div>
    </div>
  )
}
