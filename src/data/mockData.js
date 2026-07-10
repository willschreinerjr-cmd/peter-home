/**
 * MOCK DATA
 *
 * This file provides realistic sample data so the dashboard looks
 * complete immediately — no API keys required to get started.
 *
 * When you enable Google Calendar in settings.js, live data will
 * replace these mock events automatically.
 */

import dayjs from 'dayjs'

// Helper: build an ISO datetime string for today offset by `offsetDays`,
// at the specified hour:minute.
const dt = (offsetDays, hour, minute = 0) =>
  dayjs()
    .add(offsetDays, 'day')
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0)
    .toISOString()

// ── CALENDAR EVENTS ──────────────────────────────────────────────────────────
// color: 'gold' | 'blue' | 'green'
export const mockCalendarEvents = [
  // ── Today ────────────────────────────────────────────────────
  {
    id: 'e1',
    title: 'Morning Standup',
    start: dt(0, 9, 0),
    end:   dt(0, 9, 30),
    location: 'Google Meet',
    color: 'blue',
  },
  {
    id: 'e2',
    title: 'Lunch with Joe',
    start: dt(0, 12, 0),
    end:   dt(0, 13, 0),
    location: 'The Smith Kitchen',
    color: 'green',
  },
  {
    id: 'e3',
    title: 'Homeowner Insurance Review',
    start: dt(0, 14, 30),
    end:   dt(0, 15, 0),
    location: 'Phone Call',
    color: 'gold',
  },
  {
    id: 'e4',
    title: 'Gym — Leg Day',
    start: dt(0, 17, 30),
    end:   dt(0, 18, 30),
    location: 'Equinox',
    color: 'gold',
  },

  // ── Tomorrow ─────────────────────────────────────────────────
  {
    id: 'e5',
    title: 'Dentist Appointment',
    start: dt(1, 10, 0),
    end:   dt(1, 11, 0),
    location: 'Downtown Dental',
    color: 'blue',
  },
  {
    id: 'e6',
    title: 'Team Planning Session',
    start: dt(1, 14, 0),
    end:   dt(1, 15, 30),
    location: 'Zoom',
    color: 'blue',
  },

  // ── Day +2 ────────────────────────────────────────────────────
  {
    id: 'e7',
    title: 'Dinner with Sarah',
    start: dt(2, 19, 0),
    end:   dt(2, 21, 0),
    location: 'Carbone',
    color: 'green',
  },

  // ── Day +3 ────────────────────────────────────────────────────
  {
    id: 'e8',
    title: 'Plumber — Kitchen Sink',
    start: dt(3, 8, 0),
    end:   dt(3, 10, 0),
    location: 'Home',
    color: 'gold',
  },

  // ── Day +4 ────────────────────────────────────────────────────
  {
    id: 'e9',
    title: "Farmers Market",
    start: dt(4, 9, 0),
    end:   dt(4, 11, 0),
    location: 'Union Square',
    color: 'green',
  },

  // ── Day +5 ────────────────────────────────────────────────────
  {
    id: 'e10',
    title: "BBQ at Dad's",
    start: dt(5, 14, 0),
    end:   dt(5, 19, 0),
    location: "Dad's House",
    color: 'green',
  },

  // ── Day +6 ────────────────────────────────────────────────────
  {
    id: 'e11',
    title: 'Neighborhood HOA Meeting',
    start: dt(6, 18, 30),
    end:   dt(6, 20, 0),
    location: 'Community Center',
    color: 'gold',
  },
]

// ── WEATHER (fallback when API is unavailable) ────────────────────────────────
export const mockWeather = {
  city: 'New York',
  temperature: 72,
  feelsLike: 74,
  unit: '°F',
  condition: 'Partly Cloudy',
  icon: '⛅',
  humidity: 58,
  windSpeed: 12,
  high: 76,
  low: 64,
}

// ── 5-DAY FORECAST (fallback) ─────────────────────────────────────────────────
export const mockForecast = [
  { dayLabel: 'Thu', icon: '⛅', high: 74, low: 62 },
  { dayLabel: 'Fri', icon: '🌧️', high: 68, low: 58 },
  { dayLabel: 'Sat', icon: '🌤️', high: 79, low: 65 },
  { dayLabel: 'Sun', icon: '☀️',  high: 83, low: 67 },
  { dayLabel: 'Mon', icon: '☁️',  high: 71, low: 60 },
]
