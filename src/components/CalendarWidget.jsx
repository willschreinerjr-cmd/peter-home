/**
 * CalendarWidget — Today's Schedule
 *
 * Shows all events happening today, with an indicator for
 * the currently-active event and faded past events.
 *
 * Receives data as props from App.jsx (single fetch shared with UpcomingWidget).
 */

import dayjs from 'dayjs'
import { Card, CardHeader, GoldDivider, Skeleton } from './Card'
import { AutoScroll } from './AutoScroll'
import { settings } from '../config/settings'

// Dot colours per event.color value — intentionally inline to avoid Tailwind purge issues
const DOT_COLORS = {
  blue:  '#60a5fa',
  green: '#4ade80',
  gold:  '#c8a96e',
}

function EventItem({ event, spotlight = false }) {
  const start  = dayjs(event.start)
  const end    = dayjs(event.end)
  const now    = dayjs()
  const isNow  = now.isAfter(start) && now.isBefore(end)
  const isPast = now.isAfter(end)
  const dotColor = DOT_COLORS[event.color] ?? DOT_COLORS.gold

  const py      = spotlight ? 'py-4'   : 'py-3'
  const dotSize = spotlight ? 'w-3 h-3 mt-2' : 'w-2 h-2 mt-1.5'

  return (
    <div
      className={`flex gap-3 ${py} border-b border-white/5 last:border-0 transition-opacity duration-500`}
      style={{
        opacity:         isPast ? 0.38 : 1,
        backgroundColor: isNow  ? 'rgba(200,169,110,0.06)' : 'transparent',
        borderRadius:    isNow  ? '10px' : undefined,
        margin:          isNow  ? '0 -6px' : undefined,
        padding:         isNow  ? (spotlight ? '16px 6px' : '12px 6px') : undefined,
      }}
    >
      {/* Colour dot */}
      <div
        className={`rounded-full flex-shrink-0 ${dotSize}`}
        style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}88` }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className="font-semibold leading-snug"
            style={{
              fontSize: spotlight ? 'clamp(0.9rem, 1.4vw, 1.2rem)' : '0.875rem',
              color:    isPast ? '#a07850' : '#f0e4ce',
            }}
          >
            {isNow && (
              <span
                className="font-bold uppercase tracking-wider mr-1.5"
                style={{ fontSize: spotlight ? '0.8rem' : '0.7rem', color: '#c8a96e' }}
              >
                Now ·{' '}
              </span>
            )}
            {event.title}
          </p>
          <span
            className="flex-shrink-0 mt-0.5 font-semibold"
            style={{
              fontSize: spotlight ? 'clamp(0.78rem, 1.1vw, 1rem)' : '0.75rem',
              color:    isNow ? '#c8a96e' : '#7a5e42',
            }}
          >
            {start.format('h:mm A')}
          </span>
        </div>
        {event.location && (
          <p
            className="mt-0.5 truncate"
            style={{
              fontSize: spotlight ? 'clamp(0.7rem, 0.95vw, 0.85rem)' : '0.75rem',
              color:    '#7a5e42',
            }}
          >
            {event.location}
          </p>
        )}
      </div>
    </div>
  )
}

export function CalendarWidget({ todayEvents, loading, spotlight = false }) {
  const dateLabel = dayjs().format('dddd, MMMM D')
  const pad = spotlight ? 'p-5' : 'p-4'

  return (
    <Card className={`${pad} h-full`}>
      <CardHeader icon="📅" title="Today's Schedule" subtitle={spotlight ? dateLabel : dateLabel} />
      <GoldDivider className="mb-3" />

      {/* Auto-scrolling event list fills remaining card height */}
      <AutoScroll className="flex-1 min-h-0">
        {loading ? (
          <div className="flex flex-col gap-4 mt-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-3 items-start">
                <Skeleton className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : todayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <span className={spotlight ? 'text-6xl mb-4' : 'text-4xl mb-3'}>✨</span>
            <p
              className="font-medium"
              style={{ fontSize: spotlight ? 'clamp(1rem, 1.5vw, 1.2rem)' : '0.875rem', color: '#a07850' }}
            >
              Nothing scheduled today
            </p>
            <p
              className="mt-1"
              style={{ fontSize: spotlight ? 'clamp(0.75rem, 1.1vw, 0.95rem)' : '0.75rem', color: '#7a5e42' }}
            >
              Enjoy your free day, {settings.ownerName}!
            </p>
          </div>
        ) : (
          todayEvents.map(event => (
            <EventItem key={event.id} event={event} spotlight={spotlight} />
          ))
        )}
      </AutoScroll>
    </Card>
  )
}
