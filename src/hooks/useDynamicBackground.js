/**
 * useDynamicBackground
 *
 * Computes the ideal background photo URL, color overlay, and dimness
 * based on the current time-of-day and live weather conditions.
 *
 * Updates automatically every 60 seconds (catches period transitions)
 * and whenever the weatherCode prop changes.
 *
 * Time periods (24-hour):
 *   night       00:00 – 05:00
 *   dawn        05:00 – 06:30
 *   sunrise     06:30 – 08:00
 *   morning     08:00 – 11:00
 *   midday      11:00 – 14:00
 *   afternoon   14:00 – 17:00
 *   golden_hour 17:00 – 19:00
 *   sunset      19:00 – 20:00
 *   dusk        20:00 – 21:30
 *   evening     21:30 – 00:00
 *
 * WMO weather codes → https://open-meteo.com/en/docs#weathervariables
 */

import { useState, useEffect } from 'react'

// ── Photo URLs (cabin / forest / nature aesthetic) ─────────────────────────────
const PHOTOS = {
  // Time-of-day photos
  night:       'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop&q=80',
  dawn:        'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&h=1080&fit=crop&q=80',
  sunrise:     'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&h=1080&fit=crop&q=80',
  morning:     'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1080&fit=crop&q=80',
  midday:      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&h=1080&fit=crop&q=80',
  afternoon:   'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop&q=80',
  golden_hour: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop&q=80',
  sunset:      'https://images.unsplash.com/photo-1474524955719-b9f87c50ce47?w=1920&h=1080&fit=crop&q=80',
  dusk:        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop&q=80',
  evening:     'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop&q=80',
  // Weather override photos (used regardless of time when weather is dramatic)
  rainy:       'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&h=1080&fit=crop&q=80',
  foggy:       'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&h=1080&fit=crop&q=80',
  snowy:       'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&h=1080&fit=crop&q=80',
  stormy:      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1920&h=1080&fit=crop&q=80',
  cloudy:      'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=1920&h=1080&fit=crop&q=80',
}

// ── Color overlay per state (warm tones for cabin feel, shifts with daylight) ──
const OVERLAYS = {
  night:       'rgba(4,  4,  20, 0.50)',
  dawn:        'rgba(25, 10, 38, 0.44)',
  sunrise:     'rgba(95, 38,  5, 0.34)',
  morning:     'rgba(10, 18, 36, 0.28)',
  midday:      'rgba( 6, 14, 30, 0.20)',
  afternoon:   'rgba(44, 24,  6, 0.26)',
  golden_hour: 'rgba(100,42,  4, 0.32)',
  sunset:      'rgba(85, 20,  4, 0.38)',
  dusk:        'rgba(30,  8, 48, 0.44)',
  evening:     'rgba( 5,  5, 24, 0.50)',
  rainy:       'rgba( 4, 12, 30, 0.44)',
  foggy:       'rgba(55, 50, 46, 0.38)',
  snowy:       'rgba(18, 28, 48, 0.36)',
  stormy:      'rgba( 2,  2,  8, 0.54)',
  cloudy:      'rgba(16, 16, 26, 0.36)',
}

// ── Base dimming per state ─────────────────────────────────────────────────────
const DIMNESS = {
  night: 0.44, dawn: 0.36, sunrise: 0.28, morning: 0.30,
  midday: 0.22, afternoon: 0.28, golden_hour: 0.30, sunset: 0.34,
  dusk: 0.40, evening: 0.46, rainy: 0.46, foggy: 0.40,
  snowy: 0.36, stormy: 0.54, cloudy: 0.42,
}

// ── Human-readable label ───────────────────────────────────────────────────────
const LABELS = {
  night: 'Night', dawn: 'Dawn', sunrise: 'Sunrise', morning: 'Morning',
  midday: 'Midday', afternoon: 'Afternoon', golden_hour: 'Golden Hour',
  sunset: 'Sunset', dusk: 'Dusk', evening: 'Evening',
  rainy: 'Rainy', foggy: 'Foggy', snowy: 'Snowy', stormy: 'Stormy', cloudy: 'Cloudy',
}

function getPeriod(h) {
  if (h >= 21.5 || h <  5)   return 'night'
  if (h >=  5   && h <  6.5) return 'dawn'
  if (h >=  6.5 && h <  8)   return 'sunrise'
  if (h >=  8   && h < 11)   return 'morning'
  if (h >= 11   && h < 14)   return 'midday'
  if (h >= 14   && h < 17)   return 'afternoon'
  if (h >= 17   && h < 19)   return 'golden_hour'
  if (h >= 19   && h < 20)   return 'sunset'
  if (h >= 20   && h < 21.5) return 'dusk'
  return 'evening'
}

function getWeatherKey(code) {
  if (code == null)             return null
  if (code <= 2)                return null          // clear/mostly clear → use time photo
  if (code === 3)               return 'cloudy'
  if (code >= 45 && code <= 48) return 'foggy'
  if (code >= 51 && code <= 67) return 'rainy'
  if (code >= 71 && code <= 77) return 'snowy'
  if (code >= 80 && code <= 82) return 'rainy'
  if (code >= 85 && code <= 86) return 'snowy'
  if (code >= 95)               return 'stormy'
  return null
}

function compute(weatherCode) {
  const now     = new Date()
  const h       = now.getHours() + now.getMinutes() / 60
  const period  = getPeriod(h)
  const wKey    = getWeatherKey(weatherCode)
  const active  = wKey ?? period

  return {
    period,
    weatherKey: wKey,
    active,
    label:    LABELS[active]  ?? 'Day',
    url:      PHOTOS[active]  ?? PHOTOS.morning,
    overlay:  OVERLAYS[active] ?? OVERLAYS.morning,
    dimness:  DIMNESS[active]  ?? 0.35,
  }
}

export function useDynamicBackground(weatherCode) {
  const [state, setState] = useState(() => compute(weatherCode))

  useEffect(() => {
    setState(compute(weatherCode))

    // Recalculate at the top of every minute to catch period transitions
    function scheduleNext() {
      const now = new Date()
      const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 100
      return setTimeout(() => {
        setState(compute(weatherCode))
        intervalRef.current = setInterval(() => setState(compute(weatherCode)), 60_000)
      }, msToNextMinute)
    }

    let intervalRef = { current: null }
    const timeout = scheduleNext()
    return () => {
      clearTimeout(timeout)
      clearInterval(intervalRef.current)
    }
  }, [weatherCode])

  return state
}
