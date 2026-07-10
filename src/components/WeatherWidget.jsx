/**
 * WeatherWidget — compact horizontal card
 *
 * Shows big temperature + icon on the left, stats on the right.
 * Sits directly below the floating clock in the left column.
 */

import { Card, Skeleton } from './Card'
import { useWeather } from '../hooks/useWeather'

export function WeatherWidget({ weather: weatherProp }) {
  // Use the shared weather from App.jsx when provided; fall back to own hook.
  const { weather: hookWeather, loading } = useWeather()
  const weather = weatherProp ?? hookWeather

  if (loading) {
    return (
      <Card className="p-3 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </Card>
    )
  }

  if (!weather) return null

  return (
    <Card className="p-3 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Big icon */}
        <span
          className="flex-shrink-0 weather-icon-float"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', lineHeight: 1 }}
        >
          {weather.icon}
        </span>

        {/* Temperature + condition */}
        <div className="flex-shrink-0">
          <div className="flex items-end gap-1 leading-none">
            <span
              className="font-black text-white"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1 }}
            >
              {weather.temperature}
            </span>
            <span
              className="font-semibold mb-0.5"
              style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.2rem)', color: '#c8a96e' }}
            >
              {weather.unit}
            </span>
          </div>
          <p
            className="font-medium mt-1"
            style={{ fontSize: 'clamp(0.65rem, 0.9vw, 0.82rem)', color: '#a07850' }}
          >
            {weather.condition}
          </p>
          <p
            className="mt-0.5"
            style={{ fontSize: 'clamp(0.58rem, 0.78vw, 0.7rem)', color: '#7a5e42' }}
          >
            {weather.city}
          </p>
        </div>

        {/* Stats — pushed to right */}
        <div className="ml-auto flex flex-col gap-1.5 items-end flex-shrink-0">
          <Stat label="Feels like" value={`${weather.feelsLike}${weather.unit}`} />
          <Stat label="Humidity"   value={`${weather.humidity}%`}                />
          <Stat label="Wind"       value={`${weather.windSpeed} mph`}             />
          <Stat label="H / L"      value={`${weather.high}° / ${weather.low}°`}  />
        </div>
      </div>
    </Card>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: 'clamp(0.55rem, 0.75vw, 0.67rem)', color: '#7a5e42' }}>
        {label}
      </span>
      <span
        className="font-semibold"
        style={{ fontSize: 'clamp(0.6rem, 0.8vw, 0.72rem)', color: '#a07850' }}
      >
        {value}
      </span>
    </div>
  )
}
