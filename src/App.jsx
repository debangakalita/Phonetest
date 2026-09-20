import { useState } from 'react'
import {
  AndroidSystemUI,
  ChromeAndroidBottom,
  ChromeAndroidTop,
  ChromeIOSBottomBar,
  ChromeIOSTopBar,
  DeviceFrame,
  HomeIndicator,
  SafariIOSBar,
  SimulatorHeader,
  StatusBar,
  Viewport,
} from './components'
import { devices, getDeviceById } from './data/devices'
import {
  DEFAULT_URL,
  canReachUrl,
  isSimulatorShellUrl,
  normalizeUrl,
} from './lib/url'

function initialUrl() {
  const fromQuery = new URLSearchParams(window.location.search).get('url')
  return fromQuery ? normalizeUrl(fromQuery) : DEFAULT_URL
}

function defaultBrowserForOs(os) {
  return os === 'android' ? 'chrome' : 'safari'
}

export default function App() {
  const [inputUrl, setInputUrl] = useState(initialUrl)
  const [activeUrl, setActiveUrl] = useState(initialUrl)
  const [reloadKey, setReloadKey] = useState(0)
  const [blockedReason, setBlockedReason] = useState(null)
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0].id)
  const [browser, setBrowser] = useState(
    defaultBrowserForOs(devices[0].os),
  )

  const selectedDevice = getDeviceById(selectedDeviceId)
  const isAndroid = selectedDevice.os === 'android'
  const isIos = selectedDevice.os === 'ios'
  const showChromeIos = browser === 'chrome' && isIos
  const showSafariBar = browser === 'safari' && isIos

  function handleDeviceChange(deviceId) {
    const nextDevice = getDeviceById(deviceId)
    setSelectedDeviceId(deviceId)
    if (nextDevice.os === 'android') {
      setBrowser('chrome')
    }
  }

  async function navigateTo(rawUrl) {
    const nextUrl = normalizeUrl(rawUrl)

    if (isSimulatorShellUrl(nextUrl)) {
      setActiveUrl(nextUrl)
      setBlockedReason(
        'That URL is this simulator. Open /demo.html or your app URL (e.g. http://localhost:3000) instead.',
      )
      return
    }

    const reachable = await canReachUrl(nextUrl)
    if (!reachable) {
      setActiveUrl(nextUrl)
      setBlockedReason(
        `Nothing is responding at ${nextUrl}. Start your local server, then press Go again.`,
      )
      return
    }

    setBlockedReason(null)
    setActiveUrl(nextUrl)
    setReloadKey((key) => key + 1)
  }

  function handleReload() {
    if (blockedReason) {
      void navigateTo(activeUrl)
      return
    }
    setReloadKey((key) => key + 1)
  }

  function handleSubmit(event) {
    event.preventDefault()
    void navigateTo(inputUrl)
  }

  const viewport = (
    <Viewport
      src={activeUrl}
      reloadKey={reloadKey}
      blockedReason={blockedReason}
    />
  )

  let screenContent

  if (isAndroid) {
    screenContent = (
      <AndroidSystemUI device={selectedDevice}>
        <ChromeAndroidTop url={activeUrl} />
        {viewport}
        <ChromeAndroidBottom />
      </AndroidSystemUI>
    )
  } else if (showChromeIos) {
    screenContent = (
      <>
        <StatusBar />
        <ChromeIOSTopBar url={activeUrl} />
        {viewport}
        <ChromeIOSBottomBar />
        <HomeIndicator />
      </>
    )
  } else {
    screenContent = (
      <>
        <StatusBar />
        {viewport}
        {showSafariBar ? (
          <SafariIOSBar url={activeUrl} onReload={handleReload} />
        ) : (
          <HomeIndicator />
        )}
      </>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-zinc-100 text-zinc-900">
      <SimulatorHeader
        value={inputUrl}
        onChange={setInputUrl}
        onSubmit={handleSubmit}
        selectedDeviceId={selectedDeviceId}
        onDeviceChange={handleDeviceChange}
        browser={browser}
        onBrowserChange={setBrowser}
        showBrowserToggle={isIos}
      />
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-6 py-6">
        <DeviceFrame device={selectedDevice}>{screenContent}</DeviceFrame>
      </main>
    </div>
  )
}
