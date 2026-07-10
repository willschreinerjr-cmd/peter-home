/**
 * MobileView
 *
 * Personal "editor" companion view shown when the dashboard is
 * accessed on a phone or tablet (≤ 768 px wide).
 *
 * Layout (scrollable, single column):
 *   · Peter's Home header + live date
 *   · Large clock
 *   · Current weather strip
 *   · Full-width photo slideshow (250 px)
 *   · Today's schedule
 *   · Upcoming events
 *   · Chores status
 */

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { settings } from '../config/settings'
import { PhotosWidget } from './PhotosWidget'
import { RemindersWidget } from './RemindersWidget'

// ── Mini live clock ────────────────────────────────────────────────────────────
function MobileClock() {
  const [now, setNow] = useState(dayjs())
  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeFmt = settings.use12Hour !== false ? 'h:mm' : 'H:mm'
  const ampm    = settings.use12Hour !== false ? now.format('A') : ''

  return (
    <div style={{ padding: '0 20px 4px' }}>
      <p
        style={{
          fontSize: '3.8rem',
          fontWeight: 900,
          lineHeight: 1,
          color: '#fff',
          letterSpacing: '-0.04em',
        }}
      >
        {now.format(timeFmt)}
        {ampm && (
          <span
            style={{
              fontSize: '1.4rem',
              color: '#c8a96e',
              marginLeft: '6px',
              letterSpacing: '0.02em',
            }}
          >
            {ampm}
          </span>
        )}
      </p>
      <p style={{ fontSize: '0.85rem', color: 'rgba(240,228,206,0.65)', marginTop: '4px' }}>
        {now.format('dddd, MMMM D, YYYY')}
      </p>
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionLabel({ emoji, label }) {
  return (
    <p
      style={{
        fontSize: '0.6rem',
        fontWeight: 700,
        color: 'rgba(200,169,110,0.80)',
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        marginBottom: '10px',
      }}
    >
      {emoji && <span style={{ marginRight: '5px' }}>{emoji}</span>}
      {label}
    </p>
  )
}

// ── Event row ──────────────────────────────────────────────────────────────────
function EventRow({ title, sub, dimSub }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '4px 0',
        borderBottom: '1px solid rgba(180,108,42,0.10)',
      }}
    >
      <p
        style={{
          fontSize: '0.83rem',
          color: '#f0e4ce',
          fontWeight: 500,
          flex: 1,
          marginRight: '10px',
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: '0.72rem',
          color: dimSub ? '#7a5e42' : '#c8a96e',
          flexShrink: 0,
          fontWeight: 600,
        }}
      >
        {sub}
      </p>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function MobileView({ weather, todayEvents, upcomingEvents, calLoading }) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 3,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '32px',
        cursor: 'auto',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '18px 20px 14px',
          background: 'rgba(14,8,2,0.55)',
          borderBottom: '1px solid rgba(180,108,42,0.22)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: '1.55rem',
            fontWeight: 800,
            color: '#f0e4ce',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          🏡 {settings.ownerName}&rsquo;s Home
        </h1>
        <p style={{ fontSize: '0.72rem', color: '#7a5e42', marginTop: '2px', letterSpacing: '0.06em' }}>
          Personal Dashboard
        </p>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0 0' }}>

        {/* Clock */}
        <MobileClock />

        {/* Weather strip */}
        {weather && (
          <div
            style={{
              margin: '0 12px',
              padding: '12px 16px',
              background: 'rgba(18,10,4,0.50)',
              border: '1px solid rgba(180,108,42,0.18)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <span style={{ fontSize: '2.8rem', lineHeight: 1, flexShrink: 0 }}>
              {weather.icon}
            </span>
            <div>
              <p style={{ lineHeight: 1 }}>
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {weather.temperature}
                </span>
                <span style={{ fontSize: '1rem', color: '#c8a96e', marginLeft: '3px' }}>
                  {weather.unit}
                </span>
              </p>
              <p style={{ fontSize: '0.78rem', color: '#a07850', marginTop: '3px' }}>
                {weather.condition}
                {weather.city ? ` · ${weather.city}` : ''}
              </p>
              <p style={{ fontSize: '0.70rem', color: '#7a5e42', marginTop: '1px' }}>
                H:{weather.high}{weather.unit} · L:{weather.low}{weather.unit}
                {weather.humidity ? ` · 💧${weather.humidity}%` : ''}
              </p>
            </div>
          </div>
        )}

        {/* Photo slideshow */}
        <div
          style={{
            margin: '0 12px',
            height: '250px',
            borderRadius: '14px',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 4px 24px rgba(0,0,0,0.55)',
          }}
        >
          <PhotosWidget height={250} />
        </div>

        {/* Today's schedule */}
        <div
          style={{
            margin: '0 12px',
            padding: '14px 16px',
            background: 'rgba(18,10,4,0.50)',
            border: '1px solid rgba(180,108,42,0.18)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <SectionLabel emoji="📅" label="Today's Schedule" />
          {calLoading ? (
            <p style={{ color: '#7a5e42', fontSize: '0.80rem' }}>Loading…</p>
          ) : !todayEvents || todayEvents.length === 0 ? (
            <p style={{ color: '#7a5e42', fontSize: '0.80rem' }}>Nothing scheduled today</p>
          ) : (
            todayEvents.slice(0, 6).map(evt => (
              <EventRow
                key={evt.id}
                title={evt.title}
                sub={evt.allDay ? 'All day' : dayjs(evt.start).format('h:mm A')}
              />
            ))
          )}
        </div>

        {/* Upcoming events */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <div
            style={{
              margin: '0 12px',
              padding: '14px 16px',
              background: 'rgba(18,10,4,0.50)',
              border: '1px solid rgba(180,108,42,0.18)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <SectionLabel emoji="📆" label="Coming Up" />
            {upcomingEvents.slice(0, 5).map(evt => (
              <EventRow
                key={evt.id}
                title={evt.title}
                sub={dayjs(evt.start).format('MMM D')}
                dimSub
              />
            ))}
          </div>
        )}

        {/* Chores */}
        <div style={{ margin: '0 12px' }}>
          <RemindersWidget />
        </div>

      </div>
    </div>
  )
}
