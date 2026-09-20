import { useEffect, useRef, useState } from 'react'
import { ChevronDown, FolderOpen } from 'lucide-react'
import { devices as defaultDevices } from '../data/devices'

export default function SimulatorHeader({
  value,
  onChange,
  onSubmit,
  devices: deviceOptions = defaultDevices,
  selectedDeviceId,
  onDeviceChange,
  browser,
  onBrowserChange,
  showBrowserToggle = false,
  onOpenLocalFolder,
  onOpenLocalFallback,
}) {
  const folderInputRef = useRef(null)
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function openLocal() {
    setMenuOpen(false)
    if (typeof window.showDirectoryPicker === 'function') {
      void onOpenLocalFolder()
      return
    }
    folderInputRef.current?.click()
  }

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

        <div ref={menuRef} className="relative min-w-0 flex-1">
          <label className="sr-only" htmlFor="simulator-url">
            Preview URL
          </label>
          <div className="flex h-9 items-center rounded-lg border border-zinc-200 bg-zinc-50 focus-within:border-zinc-400">
            <input
              id="simulator-url"
              type="text"
              inputMode="url"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="http://localhost:3001"
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              className="h-full min-w-0 flex-1 rounded-l-lg bg-transparent px-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
            />
            <button
              type="button"
              aria-label="URL options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-full w-9 shrink-0 items-center justify-center rounded-r-lg border-l border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            >
              <ChevronDown
                className={`size-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                strokeWidth={1.75}
              />
            </button>
          </div>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+6px)] z-40 min-w-[11rem] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={openLocal}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-50"
              >
                <FolderOpen className="size-4 text-zinc-500" strokeWidth={1.75} />
                Open local
              </button>
            </div>
          ) : null}
        </div>

        <input
          ref={folderInputRef}
          type="file"
          className="hidden"
          webkitdirectory=""
          directory=""
          multiple
          onChange={(event) => {
            const list = event.target.files
            if (list?.length) void onOpenLocalFallback(list)
            event.target.value = ''
          }}
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
