import { devices } from '../data/devices'

export default function SimulatorHeader({
  value,
  onChange,
  onSubmit,
  devices: deviceOptions = devices,
  selectedDeviceId,
  onDeviceChange,
  browser,
  onBrowserChange,
  showBrowserToggle = false,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-center border-b border-zinc-200/80 bg-white px-4">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-3xl items-center gap-2"
      >
        <label className="sr-only" htmlFor="simulator-device">
          Device
        </label>
        <select
          id="simulator-device"
          value={selectedDeviceId}
          onChange={(event) => onDeviceChange(event.target.value)}
          className="h-9 max-w-[11.5rem] shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
        >
          {deviceOptions.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>

        {showBrowserToggle ? (
          <>
            <label className="sr-only" htmlFor="simulator-browser">
              Browser
            </label>
            <select
              id="simulator-browser"
              value={browser}
              onChange={(event) => onBrowserChange(event.target.value)}
              className="h-9 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
            >
              <option value="safari">Safari</option>
              <option value="chrome">Chrome</option>
            </select>
          </>
        ) : null}

        <label className="sr-only" htmlFor="simulator-url">
          Preview URL
        </label>
        <input
          id="simulator-url"
          type="text"
          inputMode="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="http://localhost:3000 or /demo.html"
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
          className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
        />
        <button
          type="submit"
          className="h-9 shrink-0 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Go
        </button>
      </form>
    </header>
  )
}
