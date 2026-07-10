/**
 * SpotlightPanel
 *
 * The rotating right-column panel. Cycles through:
 *   month   → Full month calendar grid + upcoming events
 *   today   → Today's schedule (enlarged)
 *   tasks   → Daily task list (enlarged)
 *   weather → Detailed weather + 5-day forecast
 *
 * Panel order and interval are configured in src/config/settings.js.
 * Clicking any tab pill jumps directly to that panel and resets the timer.
 */

import { useState, useEffect } from 'react'
import { settings } from '../config/settings'

import { MonthCalendarWidget } from './MonthCalendarWidget'
import { CalendarWidget      } from './CalendarWidget'
import { TasksWidget         } from './TasksWidget'
import { WeatherSpotlight    } from './WeatherSpotlight'
import { PhotosWidget        } from './PhotosWidget'

const PANEL_META = {
  month:   { label: 'Calendar', icon: '📅' },
  today:   { label: 'Today',    icon: '🗓️' },
  tasks:   { label: 'Tasks',    icon: '✅' },
  weather: { label: 'Weather',  icon: '🌤️' },
  photos:  { label: 'Photos',   icon: '🖼️' },
}

export function SpotlightPanel({
  todayEvents, upcomingEvents, calLoading,
  tasks, onToggle, completedCount,
  weather, forecast,
}) {
  const panels   = (settings.spotlightPanels ?? ['month', 'today', 'tasks', 'weather'])
                     .filter(id => PANEL_META[id])
  const interval = settings.spotlightIntervalSeconds ?? 30

  const [activeIdx, setActiveIdx] = useState(0)
  const [timeLeft,  setTimeLeft]  = useState(interval)

  // Count down; advance panel when timer hits zero
  useEffect(() => {
    if (!settings.spotlightEnabled || panels.length < 2) return

    const tick = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setActiveIdx(i => (i + 1) % panels.length)
          return interval
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [interval, panels.length])

  function jumpTo(i) {
    setActiveIdx(i)
    setTimeLeft(interval)
  }

  const activePanelId = panels[activeIdx] ?? 'month'
  const progress      = (timeLeft / interval) * 100

  return (
    <div className="flex flex-col h-full gap-2">

      {/* ── Tab pills + countdown bar ───────────────────────────── */}
      <div className="flex items-center justify-between flex-shrink-0 px-0.5">

        {/* Panel tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {panels.map((panelId, i) => {
            const meta   = PANEL_META[panelId]
            const active = i === activeIdx
            return (
              <button
                key={panelId}
                onClick={() => jumpTo(i)}
                className="flex items-center gap-1.5 rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  padding:    '4px 11px 4px 8px',
                  background: active ? 'rgba(200,169,110,0.13)' : 'rgba(255,255,255,0.04)',
                  border:     `1px solid ${active ? 'rgba(200,169,110,0.38)' : 'rgba(255,255,255,0.07)'}`,
                  cursor:     'pointer',
                }}
              >
                <span style={{ fontSize: '0.75rem', lineHeight: 1 }}>{meta.icon}</span>
                <span
                  style={{
                    fontSize:      'clamp(0.52rem, 0.72vw, 0.64rem)',
                    fontWeight:    active ? '600' : '400',
                    color:         active ? '#c8a96e' : '#7a5e42',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {meta.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Countdown indicator (hidden when rotation is disabled) */}
        {settings.spotlightEnabled && panels.length > 1 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              style={{
                width:        '52px',
                height:       '2px',
                background:   'rgba(255,255,255,0.07)',
                borderRadius: '999px',
                overflow:     'hidden',
              }}
            >
              <div
                style={{
                  height:       '100%',
                  width:        `${progress}%`,
                  background:   'linear-gradient(90deg, #9a7d50, #c8a96e)',
                  transition:   'width 1s linear',
                  borderRadius: '999px',
                }}
              />
            </div>
            <span style={{ fontSize: '0.58rem', color: '#5a3e28', minWidth: '20px', textAlign: 'right' }}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/*
       * Active panel content.
       * The `key` on this wrapper causes React to fully unmount + remount
       * whenever the active panel changes, triggering the CSS fade-in.
       */}
      <div key={activePanelId} className="flex-1 min-h-0 panel-fade-in">

        {activePanelId === 'month' && (
          <MonthCalendarWidget
            todayEvents={todayEvents}
            upcomingEvents={upcomingEvents}
            loading={calLoading}
          />
        )}

        {activePanelId === 'today' && (
          <CalendarWidget
            todayEvents={todayEvents}
            loading={calLoading}
            spotlight
          />
        )}

        {activePanelId === 'tasks' && (
          <TasksWidget
            tasks={tasks}
            onToggle={onToggle}
            completedCount={completedCount}
            spotlight
          />
        )}

        {activePanelId === 'weather' && (
          <WeatherSpotlight weather={weather} forecast={forecast} />
        )}

        {activePanelId === 'photos' && (
          <PhotosWidget />
        )}

      </div>
    </div>
  )
}
