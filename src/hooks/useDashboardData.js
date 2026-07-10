/**
 * useDashboardData / saveToDashboard
 *
 * The mobile editor writes changes back to `public/data.json`
 * in the GitHub repo via the REST API.  A GitHub Actions workflow
 * then rebuilds and redeploys the site so the kiosk display picks
 * up the new content in ~2 minutes.
 *
 * The kiosk also fetches data.json at runtime and uses it to
 * override the static defaults in settings.js.
 */

import { useState, useEffect } from 'react'
import { settings } from '../config/settings'

// Where the built data file is served from (relative to app base)
const DATA_PATH = `${import.meta.env.BASE_URL}data.json`.replace('//', '/')
const GITHUB_REPO = 'willschreinerjr-cmd/peter-home'
const DATA_FILE_PATH = 'public/data.json'

// ── Runtime fetch (used by kiosk widgets) ─────────────────────────────────────
export function useDashboardData() {
  const [data,    setData]    = useState({ photos: null, workouts: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(`${DATA_PATH}?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (!cancelled && d) setData(d) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { data, loading }
}

// Convenience: resolve effective photos list (data.json overrides settings.js)
export function useEffectivePhotos() {
  const { data, loading } = useDashboardData()
  if (loading) return settings.photos ?? []
  if (Array.isArray(data.photos) && data.photos.length > 0) return data.photos
  return settings.photos ?? []
}

// Convenience: resolve effective tasks list (data.json overrides settings.js)
export function useEffectiveTasks() {
  const { data, loading } = useDashboardData()
  if (loading) return settings.defaultTasks ?? []
  if (Array.isArray(data.tasks) && data.tasks.length > 0) return data.tasks
  return settings.defaultTasks ?? []
}

// Convenience: resolve effective chores list (data.json overrides settings.js)
export function useEffectiveChores() {
  const { data, loading } = useDashboardData()
  if (loading) return settings.chores ?? []
  if (Array.isArray(data.chores) && data.chores.length > 0) return data.chores
  return settings.chores ?? []
}

// ── GitHub API write (used by mobile editor) ──────────────────────────────────

/**
 * saveToDashboard
 *
 * Commits an updated data.json to the GitHub repo via the REST API.
 * Requires a Personal Access Token with `repo` (or `contents: write`) scope.
 *
 * @param {object} data   - { photos: [...] | null, workouts: [...] }
 * @param {string} token  - GitHub PAT
 */
export async function saveToDashboard(data, token) {
  if (!token) throw new Error('No GitHub token provided.')

  // 1. Fetch current file metadata to get the SHA (required for updates)
  const metaRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
    { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' } }
  )
  if (!metaRes.ok) {
    const err = await metaRes.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API ${metaRes.status}: could not fetch current file`)
  }
  const meta = await metaRes.json()

  // 2. Base64-encode the new content (GitHub requires this)
  const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + '\n')))

  // 3. PUT updated file
  const putRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '📱 Dashboard update from mobile editor',
        content: newContent,
        sha: meta.sha,
      }),
    }
  )
  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API ${putRes.status}: could not save file`)
  }
  return putRes.json()
}

// ── Photo upload (used by mobile editor) ─────────────────────────────────────

/**
 * Resize an image File to at most maxW pixels wide, export as JPEG.
 * Returns a data-URL string.
 */
function resizeToDataUrl(file, maxW = 1400) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(blobUrl)
      const scale = Math.min(1, maxW / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('Could not load image')) }
    img.src = blobUrl
  })
}

/**
 * uploadPhoto
 *
 * Resizes and uploads a photo File to the GitHub repo under
 * `public/photos/`.  Returns the GitHub Pages URL for that image.
 *
 * @param {File}   file   - image File from <input type="file">
 * @param {string} token  - GitHub PAT
 * @returns {Promise<string>} permanent GitHub Pages URL
 */
export async function uploadPhoto(file, token) {
  if (!token) throw new Error('No GitHub token provided.')

  // Resize + compress
  const dataUrl = await resizeToDataUrl(file)
  const base64  = dataUrl.split(',')[1]       // strip "data:image/jpeg;base64,"

  // Unique filename under public/photos/
  const filename = `photos/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`
  const apiPath  = `public/${filename}`

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${apiPath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '📱 Photo uploaded from mobile',
        content: base64,
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Upload failed (${res.status})`)
  }

  // Return the GitHub Pages URL for the uploaded file
  return `https://willschreinerjr-cmd.github.io/peter-home/${filename}`
}
