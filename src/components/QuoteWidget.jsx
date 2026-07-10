/**
 * QuoteWidget — Daily Quote
 *
 * Shows a rotating inspirational quote.
 * The quote changes once per day (based on the calendar day of the year).
 * Add your favourite quotes in src/config/settings.js → quotes.
 */

import { useMemo } from 'react'
import { settings } from '../config/settings'

export function QuoteWidget() {
  const quote = useMemo(() => {
    const { quotes } = settings
    if (!quotes?.length) return null

    // Pick today's quote based on day-of-year — no plugin needed
    const now       = new Date()
    const startOfYr = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now - startOfYr) / (1000 * 60 * 60 * 24))

    return quotes[dayOfYear % quotes.length]
  }, [])

  if (!quote) return null

  return (
    <div
      className="flex flex-col items-center text-center px-4 py-4 rounded-2xl flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border:     '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Opening quotation mark */}
      <span
        className="font-black leading-none mb-2 flex-shrink-0"
        style={{ fontSize: '2rem', color: 'rgba(200,169,110,0.3)', lineHeight: 1 }}
      >
        "
      </span>

      <p
        className="font-light italic leading-relaxed flex-shrink-0"
        style={{ fontSize: 'clamp(0.7rem, 1vw, 0.9rem)', color: '#a07850' }}
      >
        {quote.text}
      </p>

      {/* Thin gold line */}
      <div
        className="w-8 my-2.5 flex-shrink-0"
        style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.5), transparent)',
        }}
      />

      <p
        className="font-medium tracking-wide flex-shrink-0"
        style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)', color: '#7a5e42' }}
      >
        — {quote.author}
      </p>
    </div>
  )
}
