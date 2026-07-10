/**
 * TasksWidget — Daily To-Do List
 *
 * Interactive checklist with localStorage persistence.
 * Tap/click any task to toggle it. A gold progress bar tracks completion.
 *
 * Edit default tasks in src/config/settings.js → defaultTasks.
 */

import { Card, CardHeader, GoldDivider } from './Card'
import { AutoScroll } from './AutoScroll'

function CheckIcon({ spotlight = false }) {
  const s = spotlight ? 15 : 11
  return (
    <svg width={s} height={Math.round(s * 0.82)} viewBox="0 0 11 9" fill="none" aria-hidden="true">
      <path d="M1 4.5L3.8 7.5L10 1" stroke="#c8a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TaskItem({ task, onToggle, spotlight = false }) {
  const textSize = spotlight ? 'clamp(0.9rem, 1.4vw, 1.15rem)' : '0.875rem'
  const boxSize  = spotlight ? '26px' : '20px'
  const pyClass  = spotlight ? 'py-3.5' : 'py-2.5'

  return (
    <button
      onClick={() => onToggle(task.id)}
      className={`w-full flex items-center gap-3 ${pyClass} text-left group border-b border-white/5 last:border-0 focus:outline-none`}
      aria-label={`${task.done ? 'Uncheck' : 'Check'}: ${task.text}`}
    >
      {/* Custom checkbox */}
      <div
        className="rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          width:      boxSize,
          height:     boxSize,
          border:     task.done ? '1.5px solid #c8a96e' : '1.5px solid rgba(255,255,255,0.18)',
          background: task.done ? 'rgba(200,169,110,0.15)' : 'transparent',
          borderRadius: spotlight ? '7px' : '5px',
        }}
      >
        {task.done && <CheckIcon spotlight={spotlight} />}
      </div>

      {/* Task text */}
      <span
        className="font-medium transition-all duration-200 text-left"
        style={{
          fontSize:       textSize,
          color:          task.done ? '#7a5e42' : '#f0e4ce',
          textDecoration: task.done ? 'line-through' : 'none',
        }}
      >
        {task.text}
      </span>
    </button>
  )
}

export function TasksWidget({ tasks, onToggle, completedCount, spotlight = false }) {
  const progress = tasks.length > 0
    ? Math.round((completedCount / tasks.length) * 100)
    : 0

  const pad = spotlight ? 'p-5' : 'p-4'

  return (
    <Card className={`${pad} h-full`}>
      <CardHeader
        icon="✅"
        title="Tasks"
        subtitle={`${completedCount} of ${tasks.length} complete`}
      />

      {/* Progress bar */}
      <div
        className="h-0.5 rounded-full mb-3 flex-shrink-0 overflow-hidden"
        style={{ background: 'rgba(180,100,40,0.10)', height: spotlight ? '3px' : '2px' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:      `${progress}%`,
            background: 'linear-gradient(90deg, #9a7d50, #c8a96e)',
          }}
        />
      </div>

      {/* Task list */}
      <AutoScroll className="flex-1 min-h-0">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} spotlight={spotlight} />
        ))}
      </AutoScroll>
    </Card>
  )
}
