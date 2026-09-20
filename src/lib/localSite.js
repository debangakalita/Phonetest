/**
 * Load a local HTML site into blob: URLs so it can run inside an http(s) iframe.
 * Browsers block file:// inside http pages; this is the supported workaround.
 */

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.next', '.cache'])

function normalizePath(path) {
  const parts = []
  for (const part of path.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue
    if (part === '..') {
      parts.pop()
      continue
    }
    parts.push(part)
  }
  return parts.join('/')
}

function resolveAgainst(baseFilePath, relativeRef) {
  const cleaned = relativeRef.split('?')[0].split('#')[0]
  if (!cleaned) return null
  const baseDir = baseFilePath.includes('/')
    ? baseFilePath.slice(0, baseFilePath.lastIndexOf('/') + 1)
    : ''
  return normalizePath(baseDir + cleaned)
}

async function walkDirectory(dirHandle, prefix, files) {
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'file') {
      files.set(normalizePath(prefix + name), await handle.getFile())
    } else if (handle.kind === 'directory' && !SKIP_DIRS.has(name)) {
      await walkDirectory(handle, `${prefix}${name}/`, files)
    }
  }
}

function pickEntryHtml(files) {
  const keys = [...files.keys()]
  const exact = keys.find((key) => key === 'index.html' || key.endsWith('/index.html'))
  if (exact) return exact
  const anyHtml = keys.find((key) => key.toLowerCase().endsWith('.html'))
  return anyHtml ?? null
}

function rewriteCssUrls(cssText, cssPath, blobByPath) {
  return cssText.replace(
    /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
    (match, _quote, raw) => {
      const ref = raw.trim()
      if (
        !ref ||
        ref.startsWith('data:') ||
        ref.startsWith('blob:') ||
        /^[a-z]+:/i.test(ref)
      ) {
        return match
      }
      const resolved = resolveAgainst(cssPath, ref)
      const blob = resolved ? blobByPath.get(resolved) : null
      return blob ? `url("${blob}")` : match
    },
  )
}

function rewriteHtmlDocument(htmlText, htmlPath, blobByPath) {
  const doc = new DOMParser().parseFromString(htmlText, 'text/html')
  const targets = [
    ['link[href]', 'href'],
    ['script[src]', 'src'],
    ['img[src]', 'src'],
    ['source[src]', 'src'],
    ['video[src]', 'src'],
    ['audio[src]', 'src'],
    ['use[href]', 'href'],
    ['image[href]', 'href'],
  ]

  for (const [selector, attr] of targets) {
    doc.querySelectorAll(selector).forEach((el) => {
      const value = el.getAttribute(attr)
      if (
        !value ||
        value.startsWith('data:') ||
        value.startsWith('blob:') ||
        value.startsWith('#') ||
        /^[a-z]+:/i.test(value)
      ) {
        return
      }
      const resolved = resolveAgainst(htmlPath, value)
      const blob = resolved ? blobByPath.get(resolved) : null
      if (blob) el.setAttribute(attr, blob)
    })
  }

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`
}

async function buildSiteFromFileMap(files, rootLabel = 'local') {
  const entryPath = pickEntryHtml(files)
  if (!entryPath) {
    throw new Error('No HTML file found in the selected folder.')
  }

  const blobByPath = new Map()
  const objectUrls = []

  // Pass 1: non-CSS / non-HTML binaries and scripts
  for (const [path, file] of files) {
    if (path === entryPath) continue
    if (path.toLowerCase().endsWith('.css')) continue
    const url = URL.createObjectURL(file)
    objectUrls.push(url)
    blobByPath.set(path, url)
  }

  // Pass 2: CSS with rewritten url(...)
  for (const [path, file] of files) {
    if (!path.toLowerCase().endsWith('.css')) continue
    let cssText = await file.text()
    cssText = rewriteCssUrls(cssText, path, blobByPath)
    const url = URL.createObjectURL(
      new Blob([cssText], { type: 'text/css' }),
    )
    objectUrls.push(url)
    blobByPath.set(path, url)
  }

  // Pass 3: entry HTML with rewritten asset refs
  const htmlText = await files.get(entryPath).text()
  const rewritten = rewriteHtmlDocument(htmlText, entryPath, blobByPath)
  const pageUrl = URL.createObjectURL(
    new Blob([rewritten], { type: 'text/html' }),
  )
  objectUrls.push(pageUrl)

  const displayName = `${rootLabel}/${entryPath}`

  return {
    blobUrl: pageUrl,
    displayName,
    revoke() {
      for (const url of objectUrls) URL.revokeObjectURL(url)
    },
  }
}

export async function openLocalSiteFromDirectory() {
  if (typeof window.showDirectoryPicker !== 'function') {
    throw new Error('UNSUPPORTED')
  }

  const dirHandle = await window.showDirectoryPicker({ mode: 'read' })
  const files = new Map()
  await walkDirectory(dirHandle, '', files)
  return buildSiteFromFileMap(files, dirHandle.name || 'local')
}

/** Fallback: <input webkitdirectory> FileList */
export async function openLocalSiteFromFileList(fileList) {
  const files = new Map()
  for (const file of fileList) {
    const relative = file.webkitRelativePath || file.name
    const parts = relative.split('/')
    // drop the root folder name so paths match href="styles.css"
    const path =
      parts.length > 1 ? parts.slice(1).join('/') : parts[0]
    files.set(normalizePath(path), file)
  }

  const rootLabel =
    fileList[0]?.webkitRelativePath?.split('/')[0] || 'local'
  return buildSiteFromFileMap(files, rootLabel)
}

export function isFileUrl(value) {
  try {
    return new URL(value).protocol === 'file:'
  } catch {
    return typeof value === 'string' && value.trim().toLowerCase().startsWith('file:')
  }
}
