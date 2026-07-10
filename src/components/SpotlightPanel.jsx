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
    <div className="flex flex-col h-full">

      {/* (tab bar removed — panel auto-rotates silently on the kiosk display) */}
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
