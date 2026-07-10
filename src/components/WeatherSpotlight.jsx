/**
 * WeatherSpotlight
 *
 * Full-panel weather view shown when the spotlight rotates to "weather".
 * Features a giant temperature display, all current stats, and the
 * 5-day forecast as individual day cards.
 */

import { Card, GoldDivider } from './Card'

function SpotStat({ label, value }) {
  return (
    <div
      className="flex flex-col px-4 py-3 rounded-xl"
      style={{ background: 'rgba(80, 45, 15, 0.22)', border: '1px solid rgba(180,108,42,0.18)' }}
    >
      <span
        className="uppercase tracking-widest font-semibold mb-1"
        style={{ fontSize: 'clamp(0.52rem, 0.72vw, 0.64rem)', color: '#7a5e42' }}
      >
        {label}
      </span>
      <span
        className="font-bold"
        style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)', color: '#f0e4ce' }}
      >
        {value}
      </span>
    </div>
  )
}

export function WeatherSpotlight({ weather, forecast = [] }) {
  if (!weather) {
    return (
      <Card className="p-6 h-full items-center justify-center">
        <p style={{ color: '#7a5e42' }}>Weather data loading…</p>
      </Card>
    )
  }

  return (
    <Card className="p-5 h-full">
      {/* Big icon + temperature */}
      <div className="flex items-center gap-5 flex-shrink-0 mb-4">
        <span
          className="flex-shrink-0 weather-icon-float"
          style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 1 }}
        >
          {weather.icon}
        </span>

        <div>
          <div className="flex items-end gap-2 leading-none">
            <span
              className="font-black text-white"
              style={{
                fontSize:      'clamp(3.5rem, 7vw, 6rem)',
                lineHeight:    '1',
                letterSpacing: '-0.04em',
                textShadow:    '0 0 40px rgba(200,169,110,0.15)',
              }}
            >
              {weather.temperature}
            </span>
            <span
              className="font-bold mb-1"
              style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: '#c8a96e' }}
            >
              {weather.unit}
            </span>
          </div>
          <p
            className="font-semibold mt-1"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.2rem)', color: '#a07850' }}
          >
            {weather.condition}
          </p>
          <p
            style={{ fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)', color: '#7a5e42', marginTop: '2px' }}
          >
            {weather.city}
          </p>
        </div>
      </div>

      <GoldDivider className="mb-4 flex-shrink-0" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5 flex-shrink-0 mb-4">
        <SpotStat label="Feels Like"  value={`${weather.feelsLike}${weather.unit}`} />
        <SpotStat label="Humidity"    value={`${weather.humidity}%`}                />
        <SpotStat label="Wind"        value={`${weather.windSpeed} mph`}             />
        <SpotStat label="High / Low"  value={`${weather.high}° / ${weather.low}°`}  />
      </div>

      {/* 5-day forecast cards */}
      {forecast.length > 0 && (
        <>
          <GoldDivider className="mb-4 flex-shrink-0" />
          <div className="grid grid-cols-5 gap-2 flex-1 min-h-0">
            {forecast.map((day, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 rounded-xl"
                style={{
                  background: 'rgba(80,45,15,0.22)',
                  border:     '1px solid rgba(180,108,42,0.18)',
                  padding:    '0.6rem 0.4rem',
                }}
              >
                <span
                  className="uppercase font-bold tracking-wide"
                  style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.76rem)', color: '#a07850' }}
                >
                  {day.dayLabel}
                </span>
                <span style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', lineHeight: 1 }}>
                  {day.icon}
                </span>
                <span
                  className="font-bold"
                  style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)', color: '#f0e4ce' }}
                >
                  {day.high}°
                </span>
                <span style={{ fontSize: 'clamp(0.62rem, 0.85vw, 0.76rem)', color: '#7a5e42' }}>
                  {day.low}°
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
