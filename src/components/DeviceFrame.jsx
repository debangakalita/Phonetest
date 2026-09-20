import { useEffect, useRef, useState } from 'react'

function DynamicIsland() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[11px] z-30 flex h-[35px] w-[126px] -translate-x-1/2 items-center justify-between rounded-full bg-black px-3"
      aria-hidden="true"
    >
      <span className="size-2 rounded-full bg-zinc-900 ring-1 ring-zinc-800" />
      <span
        className="size-[9px] rounded-full ring-1"
        style={{ backgroundColor: '#0a1628', borderColor: '#1a3050' }}
      />
    </div>
  )
}

function Notch() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 z-30 h-[32px] w-[160px] -translate-x-1/2 rounded-b-[18px] bg-black"
      aria-hidden="true"
    />
  )
}

function Cutout({ style }) {
  if (style === 'notch') return <Notch />
  if (style === 'dynamic-island') return <DynamicIsland />
  return null
}

const SIDE_BUTTON_PAD = 6

export default function DeviceFrame({ device, children }) {
  const { width, height } = device.viewport
  const bezel = 11
  const outerRadius = device.borderRadius
  const innerRadius = device.screenRadius ?? Math.max(outerRadius - bezel, 0)

  const shellRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const parent = shell.parentElement
    if (!parent) return

    function updateScale() {
      const styles = getComputedStyle(parent)
      const padX =
        parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
      const padY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)

      const availW = Math.max(parent.clientWidth - padX, 0)
      const availH = Math.max(parent.clientHeight - padY, 0)
      const frameW = width + SIDE_BUTTON_PAD
      const frameH = height

      if (availW <= 0 || availH <= 0) return

      const next = Math.min(1, availW / frameW, availH / frameH)
      setScale(Number.isFinite(next) ? next : 1)
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(parent)
    window.addEventListener('resize', updateScale)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [width, height])

  return (
    <div
      ref={shellRef}
      className="relative shrink-0"
      style={{
        width: (width + SIDE_BUTTON_PAD) * scale,
        height: height * scale,
      }}
    >
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: width + SIDE_BUTTON_PAD,
          height,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="relative mx-auto" style={{ width, height }}>
          <div
            className="absolute -left-[3px] top-[120px] h-8 w-[3px] rounded-l-sm bg-zinc-800"
            aria-hidden="true"
          />
          <div
            className="absolute -left-[3px] top-[168px] h-14 w-[3px] rounded-l-sm bg-zinc-800"
            aria-hidden="true"
          />
          <div
            className="absolute -left-[3px] top-[232px] h-14 w-[3px] rounded-l-sm bg-zinc-800"
            aria-hidden="true"
          />
          <div
            className="absolute -right-[3px] top-[200px] h-20 w-[3px] rounded-r-sm bg-zinc-800"
            aria-hidden="true"
          />

          <div
            className="relative overflow-hidden bg-zinc-950 ring-1 ring-black/40"
            style={{
              width,
              height,
              borderRadius: outerRadius,
              padding: bezel,
              boxShadow: '0 25px 80px -20px rgba(0,0,0,0.45)',
            }}
          >
            <div
              className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white"
              style={{
                borderRadius: innerRadius,
                isolation: 'isolate',
                // Force Chromium/WebKit to clip iframes to rounded corners
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                maskImage: 'radial-gradient(white, black)',
              }}
            >
              <Cutout style={device.cutout} />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
