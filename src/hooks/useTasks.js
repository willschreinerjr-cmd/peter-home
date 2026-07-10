/**
 * useTasks
 *
 * Manages the task list with localStorage persistence.
 * Checked/unchecked state survives page refreshes and browser restarts.
 *
 * On first load, uses defaultTasks from settings.js.
 * Any new tasks added to settings.defaultTasks will be merged in
 * without overwriting the stored checked-state of existing tasks.
 */

import { useState, useEffect, useRef } from 'react'
import { settings } from '../config/settings'
import { useEffectiveTasks } from './useDashboardData'

const STORAGE_KEY = 'phcc_tasks_v1'

function mergeWithStored(defaults) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      const storedMap = Object.fromEntries(parsed.map(t => [t.id, t]))
      return defaults.map(def => ({ ...def, done: storedMap[def.id]?.done ?? def.done ?? false }))
    }
  } catch {}
  return defaults.map(t => ({ ...t, done: false }))
}

export function useTasks() {
  const effectiveTasks = useEffectiveTasks()
  const [tasks, setTasks] = useState(() => mergeWithStored(settings.defaultTasks))
  const prevKeyRef = useRef(null)

  // Re-merge when data.json tasks load in
  useEffect(() => {
    const key = effectiveTasks.map(t => t.id + t.text).join('|')
    if (key !== prevKeyRef.current) {
      prevKeyRef.current = key
      setTasks(mergeWithStored(effectiveTasks))
    }
  }, [effectiveTasks])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) } catch {}
  }, [tasks])

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

  const resetAllTasks = () =>
    setTasks(effectiveTasks.map(t => ({ ...t, done: false })))

  const completedCount = tasks.filter(t => t.done).length

  return { tasks, toggleTask, resetAllTasks, completedCount }
}
