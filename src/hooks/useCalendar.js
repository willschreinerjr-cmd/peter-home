/**
 * useCalendar
 *
 * Fetches calendar events from Apple Calendar (iCal/ICS), Google Calendar API,
 * or falls back to rich mock data when neither is configured.
 *
 * Priority: Apple Calendar → Google Calendar → Mock data
 *
 * Returns:
 *   todayEvents    — events occurring today
 *   upcomingEvents — events from tomorrow onward (up to upcomingDays)
 *   loading        — true while fetching
 *   error          — error message string, or null
 *   lastUpdated    — Date of last successful fetch
 *   refresh        — call this to force a re-fetch immediately
 */

import { useState, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { settings } from '../config/settings'
import { mockCalendarEvents } from '../data/mockData'

// ── Google Calendar normalizer ─────────────────────────────────────────────────
function normalizeGoogleEvent(event) {
  return {
    id:       event.id,
    title:    event.summary || 'Untitled Event',
    start:    event.start?.dateTime || event.start?.date,
    end:      event.end?.dateTime   || event.end?.date,
    location: event.location  || null,
    color:    'blue',
  }
}

// ── iCal / ICS parser ──────────────────────────────────────────────────────────

// ICS lines can be "folded" (long lines split with CRLF + space/tab).
// Unfold them before parsing.
function unfoldIcs(text) {
  return text.replace(/\r?\n[ \t]/g, '')
}

// Parse "DTSTART;TZID=America/New_York:20260710T090000" into an ISO string.
function parseIcsDate(value, params = '') {
  value = value.trim()

  // All-day event: VALUE=DATE or bare 8-digit string
  if (params.includes('VALUE=DATE') || /^\d{8}$/.test(value)) {
    const m = value.match(/^(\d{4})(\d{2})(\d{2})$/)
    if (m) return dayjs(`${m[1]}-${m[2]}-${m[3]}`).toISOString()
  }

  // UTC datetime: ends with Z
  if (value.endsWith('Z')) {
    const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/)
    if (m) return dayjs(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`).toISOString()
  }

  // Local datetime (with or without TZID param)
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/)
  if (m) return dayjs(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`).toISOString()

  return null
}

// Unescape ICS text values (\n \, \; \\)
function unescapeIcs(str) {
  return str
    .replace(/\\n/gi, ' ')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
}

// Parse a raw ICS string into an array of normalized events.
function parseIcs(text) {
  const lines  = unfoldIcs(text).split(/\r?\n/)
  const events = []
  let current  = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (line === 'BEGIN:VEVENT') { current = {};  continue }
    if (line === 'END:VEVENT')   {
      if (current?.title && current?.start) {
        events.push({
          id:       current.uid ?? `ics-${Math.random().toString(36).slice(2)}`,
          title:    current.title,
          start:    current.start,
          end:      current.end ?? current.start,
          location: current.location ?? null,
          color:    'blue',
        })
      }
      current = null
      continue
    }

    if (!current) continue

    // Split "PROPNAME;PARAMS:VALUE" — first colon separates name+params from value
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const namePart = line.substring(0, colonIdx)
    const value    = line.substring(colonIdx + 1)

    const semiIdx  = namePart.indexOf(';')
    const propName = (semiIdx === -1 ? namePart : namePart.substring(0, semiIdx)).toUpperCase()
    const params   = semiIdx === -1 ? '' : namePart.substring(semiIdx + 1)

    switch (propName) {
      case 'SUMMARY':  current.title    = unescapeIcs(value); break
      case 'LOCATION': current.location = unescapeIcs(value); break
      case 'UID':      current.uid      = value.trim();       break
      case 'DTSTART':  current.start    = parseIcsDate(value, params); break
      case 'DTEND':    current.end      = parseIcsDate(value, params); break
      default: break
    }
  }

  return events
}

// Filter ICS events to the configured date window (today → today + upcomingDays).
function filterIcsEvents(events) {
  const start = dayjs().startOf('day')
  const end   = dayjs().add(settings.upcomingDays ?? 7, 'day').endOf('day')
  return events.filter(e => {
    const d = dayjs(e.start)
    return d.isAfter(start.subtract(1, 'ms')) && d.isBefore(end)
  })
}

// Fetch an ICS URL, optionally through a CORS proxy.
async function fetchIcs(url) {
  const proxy = settings.corsProxy ?? ''

  if (proxy) {
    const res = await fetch(`${proxy}${encodeURIComponent(url)}`)
    if (!res.ok) throw new Error(`iCal proxy error ${res.status}`)
    const text = await res.text()
    // allorigins wraps in JSON; corsproxy.io returns plain text
    try { const j = JSON.parse(text); return j.contents ?? text } catch { return text }
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error(`iCal fetch error ${res.status}`)
  return res.text()
}

// ── Main hook ──────────────────────────────────────────────────────────────────

export function useCalendar() {
  const [events,      setEvents]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    // ── APPLE CALENDAR (iCal / ICS) ────────────────────────────
    if (settings.appleCalendarEnabled && settings.appleCalendarIcsUrl &&
        !settings.appleCalendarIcsUrl.startsWith('YOUR_')) {
      try {
        const text   = await fetchIcs(settings.appleCalendarIcsUrl)
        const parsed = filterIcsEvents(parseIcs(typeof text === 'string' ? text : String(text)))
        setEvents(parsed)
        setLastUpdated(new Date())
        setLoading(false)
        return
      } catch (err) {
        console.error('[Calendar] Apple iCal fetch failed:', err)
        setError(`Apple Calendar: ${err.message}. Check CORS — try setting corsProxy in settings.js.`)
        // Fall through to Google or mock
      }
    }

    // ── MOCK DATA (no calendar configured) ─────────────────────
    if (!settings.googleCalendarEnabled) {
      await new Promise(r => setTimeout(r, 400))
      setEvents(mockCalendarEvents)
      setLastUpdated(new Date())
      setLoading(false)
      return
    }

    // ── GOOGLE CALENDAR API ────────────────────────────────────
    try {
      const startOfDay = dayjs().startOf('day').toISOString()
      const endOfRange = dayjs().add(settings.upcomingDays, 'day').endOf('day').toISOString()

      const params = new URLSearchParams({
        key:          settings.googleApiKey,
        timeMin:      startOfDay,
        timeMax:      endOfRange,
        singleEvents: 'true',
        orderBy:      'startTime',
        maxResults:   '50',
      })

      const url =
        `https://www.googleapis.com/calendar/v3/calendars/` +
        `${encodeURIComponent(settings.googleCalendarId)}/events?${params}`

      const response = await fetch(url)

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(
          body?.error?.message ||
          `Google Calendar API error ${response.status}: ${response.statusText}`
        )
      }

      const data = await response.json()
      setEvents((data.items || []).map(normalizeGoogleEvent))
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error('[Calendar] Fetch failed:', err)
      setError(err.message)
      setEvents(mockCalendarEvents)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  useEffect(() => {
    const ms = settings.refreshIntervalMinutes * 60 * 1000
    const id = setInterval(fetchEvents, ms)
    return () => clearInterval(id)
  }, [fetchEvents])

  const todayStr = dayjs().format('YYYY-MM-DD')

  const todayEvents = events.filter(
    e => dayjs(e.start).format('YYYY-MM-DD') === todayStr
  )

  const upcomingEvents = events.filter(
    e => dayjs(e.start).format('YYYY-MM-DD') > todayStr
  )

  return { todayEvents, upcomingEvents, loading, error, lastUpdated, refresh: fetchEvents }
}
