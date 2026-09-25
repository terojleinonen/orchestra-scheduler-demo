// Calendar math on "YYYY-MM-DD" date keys.
// Keys are handled as UTC midnights so results never depend on the server's local time zone.

import { TIME_ZONE } from "../config"

const DAY_MS = 86_400_000

const toDate = (key: string) => new Date(`${key}T00:00:00Z`)
const toKey = (d: Date) => d.toISOString().slice(0, 10)

export function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && toKey(toDate(value)) === value
}

export function addDays(key: string, days: number): string {
  return toKey(new Date(toDate(key).getTime() + days * DAY_MS))
}

// 1 = Monday … 7 = Sunday
export function isoWeekday(key: string): number {
  return toDate(key).getUTCDay() || 7
}

export function startOfISOWeek(key: string): string {
  return addDays(key, 1 - isoWeekday(key))
}

export function isoWeek(key: string): number {
  const thursday = toDate(addDays(key, 4 - isoWeekday(key)))
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1)
  return Math.ceil(((thursday.getTime() - yearStart) / DAY_MS + 1) / 7)
}

export function isoWeekYear(key: string): number {
  return toDate(addDays(key, 4 - isoWeekday(key))).getUTCFullYear()
}

export function startOfMonth(key: string): string {
  return `${key.slice(0, 7)}-01`
}

export function sameMonth(a: string, b: string): boolean {
  return a.slice(0, 7) === b.slice(0, 7)
}

// 6 × 7 grid of dates starting on the Monday on or before the 1st of the month.
export function monthGrid(key: string): string[] {
  const first = startOfISOWeek(startOfMonth(key))
  return Array.from({ length: 42 }, (_, i) => addDays(first, i))
}

// Calendar date of a timestamp in the schedule's time zone.
const localDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
})

export function localDateKey(instant: Date | string): string {
  return localDateFormat.format(new Date(instant))
}

export function formatDateKey(key: string, locale: string, options: Intl.DateTimeFormatOptions): string {
  return toDate(key).toLocaleDateString(locale, { ...options, timeZone: "UTC" })
}

const timeFormat = new Intl.DateTimeFormat("fi-FI", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit"
})

export function formatTime(instant: Date): string {
  return timeFormat.format(instant)
}
