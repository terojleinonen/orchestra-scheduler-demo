// utils/calendarUtils.ts

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getStartOfISOWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay() || 7
  if (day !== 1) d.setHours(-24 * (day - 1))
  return new Date(d.setHours(0, 0, 0, 0))
}

export function getISOWeek(date: Date) {
  const tmp = new Date(date.getTime())
  tmp.setHours(0, 0, 0, 0)
  tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7))

  const yearStart = new Date(tmp.getFullYear(), 0, 1)
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

// Build full calendar grid (6 rows × 7 days)
export function getMonthGrid(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)

  const startOfGrid = getStartOfISOWeek(start)

  const days: Date[] = []

  for (let i = 0; i < 42; i++) {
    const d = new Date(startOfGrid)
    d.setDate(startOfGrid.getDate() + i)
    days.push(d)
  }

  return days
}

export function getWeeksInMonth(date: Date) {
  const days = getMonthGrid(date)
  const weeks = new Set<number>()

  days.forEach(d => {
    if (d.getMonth() === date.getMonth()) {
      weeks.add(getISOWeek(d))
    }
  })

  return Array.from(weeks)
}

export function getActiveTimeRange(events: any[]) {
  if (!events.length) {
    return { start: 8 * 60, end: 18 * 60 } // fallback
  }

  let min = Infinity
  let max = -Infinity

  events.forEach(e => {
    const start = new Date(e.startAt)
    const minutes = start.getHours() * 60 + start.getMinutes()

    const end =
      minutes + (e.durationMinutes || 120)

    min = Math.min(min, minutes)
    max = Math.max(max, end)
  })

  // Add padding
  min = Math.max(0, min - 30)
  max = Math.min(1440, max + 30)

  return { start: min, end: max }
}