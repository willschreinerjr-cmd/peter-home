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

import { useState, useEffect } from 'react'
import { settings } from '../config/settings'

const STORAGE_KEY = 'phcc_tasks_v1'

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge: keep stored state for existing tasks, add any new defaults
      const storedMap = Object.fromEntries(parsed.map(t => [t.id, t]))
      return settings.defaultTasks.map(def => ({
        ...def,
        done: storedMap[def.id]?.done ?? def.done,
      }))
    }
  } catch {
    // ignore corrupt localStorage
  }
  return settings.defaultTasks.map(t => ({ ...t }))
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks)

  // Persist whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // ignore quota errors
    }
  }, [tasks])

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

  // Hard reset: marks all tasks as not done
  const resetAllTasks = () =>
    setTasks(settings.defaultTasks.map(t => ({ ...t, done: false })))

  const completedCount = tasks.filter(t => t.done).length

  return { tasks, toggleTask, resetAllTasks, completedCount }
}
