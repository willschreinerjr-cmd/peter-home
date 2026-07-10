/**
 * App.jsx — Dashboard Layout (redesigned to match reference image)
 *
 * ┌─── Header (thin) ───────────────────────────────────────────┐
 * │ LEFT 40%                │ RIGHT 60%                         │
 * │  · Floating clock       │  · Month calendar grid (large)    │
 * │  · Weather card         │  · Tasks + Reminders side by side │
 * │  · Today's events       │                                   │
 * ├─── 5-day forecast bar ──────────────────────────────────────┤
 *
 * Background: atmospheric dark landscape photo with dim overlay.
 * Configure the background URL in src/config/settings.js.
 */

import { useState, useEffect } from 'react'

import { useCalendar } from './hooks/useCalendar'
import { useWeather  } from './hooks/useWeather'
import { useTasks    } from './hooks/useTasks'

import { ClockWidget     } from './components/ClockWidget'
import { WeatherWidget   } from './components/WeatherWidget'
import { CalendarWidget  } from './components/CalendarWidget'
import { SpotlightPanel  } from './components/SpotlightPanel'
import { ForecastWidget  } from './components/ForecastWidget'
import { TasksWidget     } from './components/TasksWidget'
import { RemindersWidget } from './components/RemindersWidget'
import { AmbientLayer      } from './components/AmbientLayer'
import { DynamicBackground } from './components/DynamicBackground'
import { MobileView        } from './components/MobileView'

import { useDynamicBackground } from './hooks/useDynamicBackground'

import { settings } from './config/settings'

// ── Mobile breakpoint hook ─────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])
  return mobile
}

// ── Thin header bar ────────────────────────────────────────────────────────────
function Header({ lastUpdated }) {
  const label = lastUpdated
    ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Loading…'

  return (
    <header
      className="flex items-center justify-between px-5 flex-shrink-0 header-shimmer"
      style={{
        height:     '38px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(18,10,4,0.52)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="status-dot" />
        <span
          className="font-semibold uppercase tracking-[0.2em]"
          style={{ fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)', color: 'rgba(200,169,110,0.6)' }}
        >
          {settings.ownerName}&rsquo;s Home
        </span>
      </div>
      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>
        {label}&ensp;&middot;&ensp;Auto-refresh every {settings.refreshIntervalMinutes} min
      </span>
    </header>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { todayEvents, upcomingEvents, loading: calLoading, lastUpdated } = useCalendar()
  const { weather, forecast } = useWeather()
  const { tasks, toggleTask, completedCount } = useTasks()
  const isMobile = useIsMobile()
  const dynBg    = useDynamicBackground(weather?.weatherCode ?? null)

  // Right-click block only in kiosk (desktop) mode
  useEffect(() => {
    if (isMobile) return
    const block = e => e.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [isMobile])

  return (
    <div
      className="dashboard-bg"
      style={{ height: '100dvh', width: '100dvw', overflow: 'hidden', position: 'relative' }}
    >
      {/* ── Layer 0: Dynamic time-of-day + weather background ─── */}
      <DynamicBackground
        url={dynBg.url}
        overlay={dynBg.overlay}
        dimness={dynBg.dimness}
      />

      {/* ── Layer 1: Vignette depth pulse ─────────────────────── */}
      <div className="vignette-pulse" aria-hidden="true" />

      {/* ── Layer 2: Floating embers + ambient orbs ───────────── */}
      <AmbientLayer />

      {/* ── Layer 3: UI content — desktop kiosk or mobile editor ── */}
      {isMobile ? (
        <MobileView
          weather={weather}
          todayEvents={todayEvents}
          upcomingEvents={upcomingEvents}
          calLoading={calLoading}
        />
      ) : (
        <div
          className="flex flex-col"
          style={{ position: 'relative', zIndex: 3, height: '100%' }}
        >
          <Header lastUpdated={lastUpdated} />

          <main
            className="flex-1 min-h-0 flex gap-3 p-3"
            style={{ overflow: 'hidden' }}
          >
            {/* ── LEFT COLUMN: Clock · Weather · Today's Events ─── */}
            <div
              className="flex flex-col gap-3 flex-shrink-0"
              style={{ width: 'clamp(260px, 38%, 500px)' }}
            >
              <div className="flex-shrink-0 pt-1">
                <ClockWidget />
              </div>
              <div className="flex-shrink-0">
                <WeatherWidget weather={weather} />
              </div>
              <div className="flex-1 min-h-0">
                <CalendarWidget todayEvents={todayEvents} loading={calLoading} />
              </div>
            </div>

            {/* ── RIGHT COLUMN: Spotlight + Tasks + Chores ─────── */}
            <div className="flex flex-col gap-3 flex-1 min-w-0 min-h-0">
              <div style={{ flex: '3', minHeight: 0 }}>
                <SpotlightPanel
                  todayEvents={todayEvents}
                  upcomingEvents={upcomingEvents}
                  calLoading={calLoading}
                  tasks={tasks}
                  onToggle={toggleTask}
                  completedCount={completedCount}
                  weather={weather}
                  forecast={forecast}
                />
              </div>
              <div className="flex gap-3" style={{ flex: '2', minHeight: 0 }}>
                <div className="flex-1 min-w-0 min-h-0">
                  <TasksWidget
                    tasks={tasks}
                    onToggle={toggleTask}
                    completedCount={completedCount}
                  />
                </div>
                <div className="flex-1 min-w-0 min-h-0">
                  <RemindersWidget />
                </div>
              </div>
            </div>
          </main>

          {/* ── BOTTOM BAR: 5-day forecast ────────────────────── */}
          <ForecastWidget forecast={forecast} />
        </div>
      )}
    </div>
  )
}
