/**
 * ClockWidget — redesigned for reference-image aesthetic.
 *
 * Floating text directly on the background — no card border.
 * The time is the largest element on the screen.
 * A daily rotating quote appears below the date.
 */

import { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { settings } from '../config/settings'

function getDailyQuote() {
  const { quotes } = settings
  if (!quotes?.length) return null
  const now       = new Date()
  const startOfYr = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - startOfYr) / (1000 * 60 * 60 * 24))
  return quotes[dayOfYear % quotes.length]
}

export function ClockWidget() {
  const [now, setNow] = useState(dayjs())
  const quote = useMemo(getDailyQuote, [])

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeFmt = settings.use12Hour
    ? (settings.showSeconds ? 'h:mm:ss' : 'h:mm')
    : (settings.showSeconds ? 'H:mm:ss' : 'H:mm')

  const timeStr = now.format(timeFmt)
  const ampm    = settings.use12Hour ? now.format('A') : null
  const dayName = now.format('dddd')
  const dateStr = now.format('MMMM D, YYYY')

  return (
    // No Card — text floats directly over the atmospheric background
    <div className="px-1 flex-shrink-0">
      {/* Time */}
      <div className="flex items-end gap-2 leading-none">
        <span
          className="font-black text-white clock-glow"
          style={{
            fontSize:      'clamp(4rem, 9vw, 8.5rem)',
            letterSpacing: '-0.04em',
            lineHeight:    '1',
            textShadow:    '0 2px 40px rgba(0,0,0,0.7)',
          }}
        >
          {timeStr}
        </span>
        {ampm && (
          <span
            className="font-bold mb-2"
            style={{
              fontSize:   'clamp(1.2rem, 2.2vw, 2rem)',
              color:      '#c8a96e',
              textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            }}
          >
            {ampm}
          </span>
        )}
      </div>

      {/* Day + date */}
      <p
        className="font-medium mt-1.5"
        style={{
          fontSize:      'clamp(0.9rem, 1.5vw, 1.4rem)',
          color:         'rgba(240,228,206,0.75)',   /* warm cream */
          letterSpacing: '0.02em',
          textShadow:    '0 1px 12px rgba(0,0,0,0.6)',
        }}
      >
        {dayName}, {dateStr}
      </p>

      {/* Daily quote — faint gold, italic, below date */}
      {quote && (
        <p
          className="mt-4 font-light italic leading-snug"
          style={{
            fontSize:   'clamp(0.58rem, 0.8vw, 0.74rem)',
            color:      'rgba(200,169,110,0.42)',
            maxWidth:   '400px',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
          }}
        >
          &ldquo;{quote.text}&rdquo;&ensp;&mdash;&ensp;{quote.author}
        </p>
      )}
    </div>
  )
}
