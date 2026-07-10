/**
 * ForecastWidget — 5-Day Weather Forecast Bar
 *
 * Runs across the full width of the bottom of the screen.
 * Matches the forecast strip visible in the reference image.
 */

export function ForecastWidget({ forecast = [] }) {
  if (!forecast.length) return null

  return (
    <div
      className="flex items-center justify-around flex-shrink-0"
      style={{
        height:           'clamp(64px, 7vh, 88px)',
        borderTop:        '1px solid rgba(180,100,40,0.15)',
        background:       'rgba(18,10,4,0.55)',
        backdropFilter:   'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingLeft:      '2rem',
        paddingRight:     '2rem',
      }}
    >
      {forecast.map((day, i) => (
        <div key={i} className="flex items-center gap-0">
          {/* Divider between items */}
          {i > 0 && (
            <div
              className="flex-shrink-0 mr-4"
              style={{ width: '1px', height: '36px', background: 'rgba(180,100,40,0.2)' }}
            />
          )}

          <div className="flex items-center gap-3 mr-4"
              style={{ animation: `forecastFloat ${3.8 + i * 0.35}s ${i * 0.55}s ease-in-out infinite` }}>
            {/* Day label */}
            <span
              className="font-semibold uppercase tracking-wide flex-shrink-0"
              style={{ fontSize: 'clamp(0.62rem, 0.85vw, 0.78rem)', color: '#a07850', minWidth: '28px' }}
            >
              {day.dayLabel}
            </span>

            {/* Icon */}
            <span
              className="flex-shrink-0"
              style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', lineHeight: 1 }}
            >
              {day.icon}
            </span>

            {/* High / Low temps */}
            <div className="flex flex-col leading-tight">
              <span
                className="font-bold"
                style={{ fontSize: 'clamp(0.8rem, 1.1vw, 1rem)', color: '#f0e4ce' }}
              >
                {day.high}°
              </span>
              <span
                className="font-medium"
                style={{ fontSize: 'clamp(0.62rem, 0.85vw, 0.78rem)', color: '#7a5e42' }}
              >
                {day.low}°
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
