/**
 * MonthCalendarWidget
 *
 * Shows the current month as a visual grid — the centrepiece of the
 * right column. Today is highlighted with a gold circle.
 * Days with events get a small gold dot beneath the number.
 *
 * Also shows a compact list of upcoming events below the grid.
 */

import { useMemo } from 'react'
import dayjs from 'dayjs'
import { Card, GoldDivider, Skeleton } from './Card'
import { AutoScroll } from './AutoScroll'

const WEEK_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function buildGrid(year, month) {
  const first      = dayjs().year(year).month(month).date(1)
  const daysInMonth = first.daysInMonth()
  const startDow   = first.day() // 0 = Sunday

  const cells = []
  for (let i = 0; i < startDow; i++)     cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

// Compact row for one upcoming event
function UpcomingRow({ event }) {
  const start = dayjs(event.start)
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
      {/* Small date badge */}
      <span
        className="font-bold flex-shrink-0 w-12 text-right"
        style={{ fontSize: 'clamp(0.6rem, 0.8vw, 0.72rem)', color: '#c8a96e' }}
      >
        {start.format('ddd D')}
      </span>
      <div className="w-px h-3 flex-shrink-0" style={{ background: 'rgba(180,100,40,0.2)' }} />
      <span
        className="font-medium truncate"
        style={{ fontSize: 'clamp(0.62rem, 0.82vw, 0.74rem)', color: '#a07850' }}
      >
        {event.title}
      </span>
      <span
        className="ml-auto flex-shrink-0 font-medium"
        style={{ fontSize: 'clamp(0.58rem, 0.78vw, 0.68rem)', color: '#7a5e42' }}
      >
        {start.format('h:mm A')}
      </span>
    </div>
  )
}

export function MonthCalendarWidget({ todayEvents = [], upcomingEvents = [], loading }) {
  const now   = dayjs()
  const year  = now.year()
  const month = now.month()
  const today = now.date()

  // Set of days in this month that have events
  const eventDays = useMemo(() => {
    const all = [...todayEvents, ...upcomingEvents]
    return new Set(
      all
        .filter(e => {
          const d = dayjs(e.start)
          return d.year() === year && d.month() === month
        })
        .map(e => dayjs(e.start).date())
    )
  }, [todayEvents, upcomingEvents, year, month])

  const cells = buildGrid(year, month)

  return (
    <Card className="p-5 h-full">
      {/* Month / Year header */}
      <div className="flex items-baseline justify-between mb-4 flex-shrink-0">
        <h2
          className="font-black uppercase tracking-widest"
          style={{ fontSize: 'clamp(1rem, 1.5vw, 1.4rem)', color: '#f0e4ce' }}
        >
          {now.format('MMMM')}
        </h2>
        <span
          className="font-light"
          style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)', color: '#7a5e42' }}
        >
          {year}
        </span>
      </div>

      {/* Day-of-week column headers */}
      <div className="grid grid-cols-7 mb-2 flex-shrink-0">
        {WEEK_HEADERS.map(d => (
          <div
            key={d}
            className="text-center font-semibold uppercase"
            style={{
              fontSize:      'clamp(0.58rem, 0.8vw, 0.72rem)',
              color:         '#7a5e42',
              letterSpacing: '0.06em',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <GoldDivider className="mb-3 flex-shrink-0" />

      {/* Calendar grid */}
      {loading ? (
        <div className="grid grid-cols-7 gap-1 flex-shrink-0">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-7 mx-auto rounded-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 flex-shrink-0">
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />

            const isToday  = day === today
            const isPast   = day < today
            const hasEvent = eventDays.has(day)

            return (
              <div key={day} className="flex flex-col items-center py-0.5">
                {/* Day number circle */}
                <div
                  className="flex items-center justify-center rounded-full font-semibold"
                  style={{
                    width:      'clamp(24px, 2.6vw, 38px)',
                    height:     'clamp(24px, 2.6vw, 38px)',
                    fontSize:   'clamp(0.65rem, 0.95vw, 0.88rem)',
                    background: isToday ? '#c8a96e' : 'transparent',
                    color:      isToday
                                  ? '#100804'
                                  : isPast
                                  ? 'rgba(255,255,255,0.2)'
                                  : '#f0e4ce',
                    fontWeight: isToday ? '900' : isPast ? '400' : '500',
                    boxShadow:  isToday ? '0 0 14px rgba(200,169,110,0.5)' : 'none',
                  }}
                >
                  {day}
                </div>
                {/* Event dot */}
                {hasEvent && (
                  <div
                    className="rounded-full"
                    style={{
                      width:      '4px',
                      height:     '4px',
                      marginTop:  '2px',
                      background: isToday ? 'rgba(8,10,18,0.5)' : 'rgba(200,169,110,0.65)',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming events mini-list */}
      {upcomingEvents.length > 0 && (
        <>
          <GoldDivider className="my-3 flex-shrink-0" />
          <p
            className="uppercase tracking-widest font-semibold mb-2 flex-shrink-0"
            style={{ fontSize: 'clamp(0.55rem, 0.75vw, 0.65rem)', color: 'rgba(200,169,110,0.6)' }}
          >
            Upcoming
          </p>
          <AutoScroll className="flex-1 min-h-0">
            {upcomingEvents.slice(0, 6).map(ev => (
              <UpcomingRow key={ev.id} event={ev} />
            ))}
          </AutoScroll>
        </>
      )}
    </Card>
  )
}
