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
