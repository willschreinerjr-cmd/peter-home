/**
 * RemindersWidget — Smart Chore Scheduler
 *
 * Shows house chores with live due-date status calculated from today's date.
 * Edit the schedule in src/config/settings.js → chores.
 *
 * scheduleType support:
 *   weekly               — every specific weekday
 *   monthly-nth-weekday  — e.g. 1st Saturday of each month
 *   bimonthly            — specific months of the year
 *   biweekly             — every other week
 */

import dayjs from 'dayjs'
import { Card, CardHeader, GoldDivider } from './Card'
import { AutoScroll } from './AutoScroll'
import { settings } from '../config/settings'

// ── Schedule logic ─────────────────────────────────────────────────────────────

function getNthWeekdayOfMonth(anyDateInMonth, n, weekday) {
  const first = dayjs(anyDateInMonth).startOf('month')
  let diff = weekday - first.day()
  if (diff < 0) diff += 7
  return first.add(diff + (n - 1) * 7, 'day')
}

function formatDays(daysUntil) {
  if (daysUntil === 0) return { label: 'Due Today!', daysUntil: 0, urgent: true  }
  if (daysUntil === 1) return { label: 'Tomorrow',   daysUntil: 1, urgent: false }
  return { label: `In ${daysUntil} days`, daysUntil, urgent: false }
}

function getChoreStatus(chore) {
  const today = dayjs().startOf('day')

  switch (chore.scheduleType) {

    case 'weekly': {
      let d = chore.weekday - today.day()
      if (d < 0) d += 7
      return formatDays(d)
    }

    case 'monthly-nth-weekday': {
      let due = getNthWeekdayOfMonth(today, chore.nth, chore.weekday)
      let d   = due.diff(today, 'day')
      if (d < 0) {
        // Already passed this month — find next month's date
        due = getNthWeekdayOfMonth(today.add(1, 'month'), chore.nth, chore.weekday)
        d   = due.diff(today, 'day')
      }
      return formatDays(d)
    }

    case 'bimonthly': {
      const month  = today.month()            // 0-indexed
      const months = chore.months ?? [0, 2, 4, 6, 8, 10]

      if (months.includes(month)) {
        return { label: 'Due this month', daysUntil: 0, urgent: false, periodic: true }
      }
      const next = months.find(m => m > month)
      if (next != null) {
        const d = dayjs().month(next).startOf('month').diff(today, 'day')
        return { label: `Next: ${dayjs().month(next).format('MMMM')}`, daysUntil: d }
      }
      // Wrap to January next year
      const jan = dayjs().add(1, 'year').month(months[0]).startOf('month')
      return { label: `Next: ${jan.format('MMM YYYY')}`, daysUntil: jan.diff(today, 'day') }
    }

    case 'biweekly': {
      // Every other week. Reference: Sunday 5 Jan 2025.
      const ref  = dayjs('2025-01-05').startOf('day')
      const cur  = today.startOf('week')       // Sunday of this week
      const diff = cur.diff(ref, 'week')

      if (diff % 2 === 0) {
        return { label: 'Due this week', daysUntil: 0, urgent: false, periodic: true }
      }
      const d = cur.add(1, 'week').diff(today, 'day')
      return { label: `In ${d} day${d !== 1 ? 's' : ''}`, daysUntil: d }
    }

    default:
      return { label: chore.detail ?? '', daysUntil: null }
  }
}

// ── ChoreRow sub-component ─────────────────────────────────────────────────────

function ChoreRow({ chore }) {
  const status     = getChoreStatus(chore)
  const isUrgent   = !!status.urgent
  const isSoon     = !isUrgent && status.daysUntil != null && status.daysUntil <= 2
  const isPeriodic = !!status.periodic

  const border = isUrgent   ? 'rgba(248,113,113,0.45)'
               : isSoon     ? 'rgba(251,191,36,0.35)'
               : isPeriodic ? 'rgba(200,169,110,0.28)'
               :               'rgba(255,255,255,0.08)'

  const bg = isUrgent ? 'rgba(248,113,113,0.07)'
           : isSoon   ? 'rgba(251,191,36,0.05)'
           :             'rgba(255,255,255,0.025)'

  const badgeColor = isUrgent   ? '#f87171'
                   : isSoon     ? '#fbbf24'
                   : isPeriodic ? '#c8a96e'
                   :               '#7a5e42'

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <span className="text-base leading-none flex-shrink-0">{chore.icon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-tight" style={{ color: '#f0e4ce' }}>
          {chore.text}
        </p>
        <p className="text-[0.62rem] mt-0.5" style={{ color: '#5a6380' }}>
          {chore.detail}
        </p>
      </div>

      {status.label && (
        <span
          className={`text-[0.58rem] font-semibold uppercase tracking-wider flex-shrink-0 px-1.5 py-0.5 rounded${isUrgent ? ' badge-urgent' : (isPeriodic || (status.daysUntil != null && status.daysUntil <= 2)) ? ' badge-warm' : ''}`}
          style={{
            color:      badgeColor,
            background: `${badgeColor}18`,
            border:     `1px solid ${badgeColor}33`,
          }}
        >
          {status.label}
        </span>
      )}
    </div>
  )
}

// ── Main widget ────────────────────────────────────────────────────────────────

export function RemindersWidget() {
  const chores = settings.chores ?? []

  return (
    <Card className="p-4 h-full">
      <CardHeader icon="🧹" title="Chores" />
      <GoldDivider className="mb-3" />

      <AutoScroll className="flex-1 min-h-0">
        <div className="flex flex-col gap-1.5">
          {chores.map(chore => (
            <ChoreRow key={chore.id} chore={chore} />
          ))}
        </div>
      </AutoScroll>
    </Card>
  )
}
