/**
 * useWeather
 *
 * Fetches current weather from Open-Meteo (https://open-meteo.com).
 * Open-Meteo is completely free and requires NO API key.
 *
 * Just set your latitude, longitude, and city name in settings.js
 * and weather will appear automatically.
 *
 * Falls back to mock data if the fetch fails or weather is disabled.
 */

import { useState, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { settings } from '../config/settings'
import { mockWeather, mockForecast } from '../data/mockData'

// WMO Weather Interpretation Codes → human label + emoji icon
// Full list: https://open-meteo.com/en/docs#weathervariables
const WMO = {
  0:  { label: 'Clear Sky',      icon: '☀️'  },
  1:  { label: 'Mostly Clear',   icon: '🌤️'  },
  2:  { label: 'Partly Cloudy',  icon: '⛅'  },
  3:  { label: 'Overcast',       icon: '☁️'  },
  45: { label: 'Foggy',          icon: '🌫️'  },
  48: { label: 'Freezing Fog',   icon: '🌫️'  },
  51: { label: 'Light Drizzle',  icon: '🌦️'  },
  53: { label: 'Drizzle',        icon: '🌦️'  },
  55: { label: 'Heavy Drizzle',  icon: '🌧️'  },
  61: { label: 'Light Rain',     icon: '🌧️'  },
  63: { label: 'Rain',           icon: '🌧️'  },
  65: { label: 'Heavy Rain',     icon: '🌧️'  },
  71: { label: 'Light Snow',     icon: '🌨️'  },
  73: { label: 'Snow',           icon: '❄️'   },
  75: { label: 'Heavy Snow',     icon: '❄️'   },
  77: { label: 'Snow Grains',    icon: '❄️'   },
  80: { label: 'Rain Showers',   icon: '🌦️'  },
  81: { label: 'Rain Showers',   icon: '🌧️'  },
  82: { label: 'Heavy Showers',  icon: '⛈️'  },
  85: { label: 'Snow Showers',   icon: '🌨️'  },
  95: { label: 'Thunderstorm',   icon: '⛈️'  },
  96: { label: 'Thunderstorm',   icon: '⛈️'  },
  99: { label: 'Hail Storm',     icon: '⛈️'  },
}

export function useWeather() {
  const [weather,  setWeather]  = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetchWeather = useCallback(async () => {
    if (!settings.weatherEnabled) {
      setWeather({ ...mockWeather, city: settings.weatherCity || mockWeather.city, weatherCode: 2 })
      setForecast(mockForecast)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { weatherLatitude: lat, weatherLongitude: lon, weatherUnit: unit, weatherCity: city } = settings
      const params = new URLSearchParams({
        latitude:         lat,
        longitude:        lon,
        current:          'temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature',
        daily:            'temperature_2m_max,temperature_2m_min,weathercode',
        temperature_unit: unit,
        windspeed_unit:   'mph',
        timezone:         'auto',
        forecast_days:    '6',  // today + 5 ahead
      })

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)

      const data    = await res.json()
      const cur     = data.current
      const wmo     = WMO[cur.weathercode] ?? { label: 'Unknown', icon: '🌡️' }
      const unitSym = unit === 'fahrenheit' ? '°F' : '°C'

      setWeather({
        city:        city,
        temperature: Math.round(cur.temperature_2m),
        feelsLike:   Math.round(cur.apparent_temperature),
        unit:        unitSym,
        condition:   wmo.label,
        icon:        wmo.icon,
        humidity:    cur.relativehumidity_2m,
        windSpeed:   Math.round(cur.windspeed_10m),
        high:        Math.round(data.daily?.temperature_2m_max?.[0] ?? cur.temperature_2m),
        low:         Math.round(data.daily?.temperature_2m_min?.[0] ?? cur.temperature_2m),
        weatherCode: cur.weathercode,
      })

      // Build 5-day forecast (skip today at index 0)
      const fc = (data.daily?.time ?? []).slice(1, 6).map((date, i) => {
        const code = data.daily.weathercode[i + 1]
        const w    = WMO[code] ?? { icon: '🌡️' }
        return {
          dayLabel: dayjs(date).format('ddd'),
          icon:     w.icon,
          high:     Math.round(data.daily.temperature_2m_max[i + 1]),
          low:      Math.round(data.daily.temperature_2m_min[i + 1]),
        }
      })
      setForecast(fc)
      setError(null)
    } catch (err) {
      console.error('[Weather] Fetch failed:', err)
      setError(err.message)
      setWeather({ ...mockWeather, weatherCode: 2 })
      setForecast(mockForecast)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWeather() }, [fetchWeather])

  useEffect(() => {
    const id = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(id)
  }, [fetchWeather])

  return { weather, forecast, loading, error }
}
