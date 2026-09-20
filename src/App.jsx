import { useEffect, useRef, useState } from 'react'
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
  isFileUrl,
  openLocalSiteFromDirectory,
  openLocalSiteFromFileList,
} from './lib/localSite'
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
  const localSiteRef = useRef(null)

  const selectedDevice = getDeviceById(selectedDeviceId)
  const isAndroid = selectedDevice.os === 'android'
  const isIos = selectedDevice.os === 'ios'
  const showChromeIos = browser === 'chrome' && isIos
  const showSafariBar = browser === 'safari' && isIos

  useEffect(() => {
    return () => {
      localSiteRef.current?.revoke()
    }
  }, [])

  function clearLocalSite() {
    localSiteRef.current?.revoke()
    localSiteRef.current = null
  }

  function handleDeviceChange(deviceId) {
    const nextDevice = getDeviceById(deviceId)
    setSelectedDeviceId(deviceId)
    if (nextDevice.os === 'android') {
      setBrowser('chrome')
    }
  }

  async function loadLocalSite(loader) {
    try {
      const site = await loader()
      clearLocalSite()
      localSiteRef.current = site
      setInputUrl(site.displayName)
      setActiveUrl(site.blobUrl)
      setBlockedReason(null)
      setReloadKey((key) => key + 1)
    } catch (error) {
      if (error?.name === 'AbortError') return
      if (error?.message === 'UNSUPPORTED') {
        setBlockedReason(
          'This browser cannot open folders directly. Use Chrome/Edge, or serve the site with a local HTTP server.',
        )
        return
      }
      setBlockedReason(
        error?.message || 'Could not open the local HTML folder.',
      )
    }
  }

  async function navigateTo(rawUrl) {
    const nextUrl = normalizeUrl(rawUrl)

    if (isFileUrl(nextUrl) || isFileUrl(rawUrl)) {
      setActiveUrl(nextUrl)
      setBlockedReason(
        'Browsers block file:// pages inside this simulator. Click “Open local” and choose the HTML folder instead.',
      )
      return
    }

    if (isSimulatorShellUrl(nextUrl)) {
      clearLocalSite()
      setActiveUrl(nextUrl)
      setBlockedReason(
        'That URL is this simulator. Open a local folder or your app URL (e.g. http://localhost:3001) instead.',
      )
      return
    }

    const reachable = await canReachUrl(nextUrl)
    if (!reachable) {
      clearLocalSite()
      setActiveUrl(nextUrl)
      setBlockedReason(
        `Nothing is responding at ${nextUrl}. Start your local server, or use “Open local” for HTML folders.`,
      )
      return
    }

    clearLocalSite()
    setBlockedReason(null)
    setActiveUrl(nextUrl)
    setReloadKey((key) => key + 1)
  }

  function handleReload() {
    if (localSiteRef.current) {
      setReloadKey((key) => key + 1)
      return
    }
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

  const addressUrl = activeUrl.startsWith('blob:') ? inputUrl : activeUrl

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
        <ChromeAndroidTop url={addressUrl} />
        {viewport}
        <ChromeAndroidBottom />
      </AndroidSystemUI>
    )
  } else if (showChromeIos) {
    screenContent = (
      <>
        <StatusBar />
        <ChromeIOSTopBar url={addressUrl} />
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
          <SafariIOSBar url={addressUrl} onReload={handleReload} />
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
        onOpenLocalFolder={() => loadLocalSite(openLocalSiteFromDirectory)}
        onOpenLocalFallback={(fileList) =>
          loadLocalSite(() => openLocalSiteFromFileList(fileList))
        }
      />
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-6 py-6">
        <DeviceFrame device={selectedDevice}>{screenContent}</DeviceFrame>
      </main>
    </div>
  )
}
