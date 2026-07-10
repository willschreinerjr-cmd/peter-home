/**
 * UpcomingWidget — Upcoming Events
 *
 * Shows events from tomorrow through the next N days.
 * Each event shows a compact date badge (day + number) for quick scanning.
 *
 * Receives data as props from App.jsx.
 */

import dayjs from 'dayjs'
import { Card, CardHeader, GoldDivider, Skeleton } from './Card'
import { AutoScroll } from './AutoScroll'
import { settings } from '../config/settings'

function UpcomingItem({ event }) {
  const start   = dayjs(event.start)
  const dayAbbr = start.format('ddd').toUpperCase()
  const dateNum = start.format('D')
  const timeStr = start.format('h:mm A')

  return (
    <div className="flex gap-3 py-2.5 border-b border-white/5 last:border-0 items-start">
      {/* Date badge */}
      <div className="flex flex-col items-center w-8 flex-shrink-0">
        <span
          className="text-xs font-bold uppercase leading-none"
          style={{ color: '#c8a96e' }}
        >
          {dayAbbr}
        </span>
        <span
          className="font-bold leading-none mt-1"
          style={{ fontSize: 'clamp(1rem, 1.4vw, 1.3rem)', color: '#f0e4ce' }}
        >
          {dateNum}
        </span>
      </div>

      {/* Thin vertical rule */}
      <div className="w-px self-stretch flex-shrink-0" style={{ background: 'rgba(180,100,40,0.2)' }} />

      {/* Event details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug truncate" style={{ color: '#f0e4ce' }}>
          {event.title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#7a5e42' }}>
          {timeStr}
          {event.location && ` · ${event.location}`}
        </p>
      </div>
    </div>
  )
}

export function UpcomingWidget({ upcomingEvents, loading }) {
  const rangeLabel = `Next ${settings.upcomingDays} days`

  return (
    <Card className="p-4 h-full">
      <CardHeader icon="📆" title="Upcoming" subtitle={rangeLabel} />
      <GoldDivider className="mb-3" />

      <AutoScroll className="flex-1 min-h-0">
        {loading ? (
          <div className="flex flex-col gap-4 mt-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center w-8 gap-1 flex-shrink-0">
                  <Skeleton className="h-3 w-7" />
                  <Skeleton className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-6 text-center">
            <span className="text-3xl mb-2">📭</span>
            <p className="text-sm" style={{ color: '#a07850' }}>Nothing coming up</p>
          </div>
        ) : (
          upcomingEvents
            .slice(0, settings.maxUpcomingEvents)
            .map(event => <UpcomingItem key={event.id} event={event} />)
        )}
      </AutoScroll>
    </Card>
  )
}
