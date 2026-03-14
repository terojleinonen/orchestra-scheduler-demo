import { type ScheduleEvent } from "../api/scheduleApi"

export function detectConflicts(events: ScheduleEvent[]) {

  const conflicts = new Set<string>()

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {

      const a = events[i]
      const b = events[j]

      if (a.venue !== b.venue) continue

      const aStart = new Date(a.start).getTime()
      const aEnd = new Date(a.end).getTime()

      const bStart = new Date(b.start).getTime()
      const bEnd = new Date(b.end).getTime()

      const overlap = aStart < bEnd && aEnd > bStart

      if (overlap) {

        conflicts.add(a.id)
        conflicts.add(b.id)

      }
    }
  }
  return conflicts
}