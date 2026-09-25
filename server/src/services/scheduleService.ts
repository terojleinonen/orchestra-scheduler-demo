import type {
  DayViewDto,
  EventDto,
  MonthViewDto,
  NavOption,
  ScheduleResponse,
  ToolbarDto,
  ViewMode,
  WeekViewDto
} from "@orchestra/shared"
import { type WorkOrder } from "../domain/WorkOrder"
import { DATE_LANG } from "../config"
import {
  addDays,
  addMonths,
  formatDateKey,
  formatDateRange,
  formatTime,
  isoWeek,
  isoWeekday,
  isoWeekYear,
  localDateKey,
  monthGrid,
  sameMonth,
  startOfISOWeek,
  startOfMonth
} from "./calendar"

// ==============================
// Index (built once per data set)
// ==============================

type ScheduleIndex = {
  byDay: Map<string, WorkOrder[]>
  departments: string[]
  firstDay: string
  lastDay: string
}

const indexCache = new WeakMap<WorkOrder[], ScheduleIndex>()

// Expects items sorted by start time.
function getIndex(items: WorkOrder[]): ScheduleIndex {
  const cached = indexCache.get(items)
  if (cached) return cached

  const byDay = new Map<string, WorkOrder[]>()
  const departments = new Set<string>()

  for (const item of items) {
    const key = localDateKey(item.startAt)
    byDay.set(key, [...(byDay.get(key) ?? []), item])
    if (item.department) departments.add(item.department)
  }

  const today = localDateKey(new Date())
  const days = [...byDay.keys()]

  const index: ScheduleIndex = {
    byDay,
    departments: [...departments].sort(),
    firstDay: days[0] ?? today,
    lastDay: days[days.length - 1] ?? today
  }

  indexCache.set(items, index)
  return index
}

// ==============================
// Helpers
// ==============================

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

// Finnish abbreviations: "2 t 30 min"
function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h && `${h} t`, m && `${m} min`].filter(Boolean).join(" ") || "0 min"
}

// Weekday and date formatted separately to get "Perjantai 20. maaliskuuta 2026"
// (with a year ICU would use the essive "perjantaina").
function weekdayAndDate(d: string, options: Intl.DateTimeFormatOptions) {
  return capitalize(`${formatDateKey(d, { weekday: "long" })} ${formatDateKey(d, options)}`)
}

const fullDate = (d: string) => weekdayAndDate(d, { day: "numeric", month: "long", year: "numeric" })

function toEventDto(item: WorkOrder): EventDto {
  const start = new Date(item.startAt)
  const end = new Date(start.getTime() + item.durationMinutes * 60_000)

  return {
    id: item.id,
    title: item.title,
    startAt: item.startAt,
    timeRange: `${formatTime(start)}–${formatTime(end)}`,
    duration: formatDuration(item.durationMinutes),
    production: item.production,
    workType: item.workType && capitalize(item.workType),
    department: item.department,
    departmentLabel: item.department && capitalize(item.department),
    venue: item.venue,
    conductor: item.conductor,
    equipment: item.equipment
  }
}

// Today if it falls within the data, otherwise the closest day that has events.
export function defaultDate(items: WorkOrder[]): string {
  const { firstDay, lastDay } = getIndex(items)
  const today = localDateKey(new Date())

  if (today < firstDay) return firstDay
  if (today > lastDay) return lastDay
  return today
}

// ==============================
// Views
// ==============================

type Context = {
  index: ScheduleIndex
  date: string
  today: string
  eventsOn: (day: string) => WorkOrder[]
}

type ViewResult<T> = { title: string; subtitle: string; eventCount: number; content: T }

function buildMonthView({ date, today, eventsOn }: Context): ViewResult<MonthViewDto> {
  const grid = monthGrid(date)
  let eventCount = 0

  const weeks = Array.from({ length: 6 }, (_, row) => {
    const days = grid.slice(row * 7, row * 7 + 7)

    return {
      weekNumber: isoWeek(days[0]),
      days: days.map(day => {
        const events = eventsOn(day)
        const inMonth = sameMonth(day, date)
        if (inMonth) eventCount += events.length

        return {
          date: day,
          dayOfMonth: Number(day.slice(8)),
          label: fullDate(day),
          inMonth,
          isToday: day === today,
          eventCount: events.length,
          departments: [...new Set(events.flatMap(e => (e.department ? [e.department] : [])))].sort()
        }
      })
    }
  })

  return {
    title: capitalize(formatDateKey(date, { month: "long", year: "numeric" })),
    subtitle: `Weeks ${weeks[0].weekNumber}–${weeks[5].weekNumber}`,
    eventCount,
    content: {
      view: "month",
      weekdays: weeks[0].days.map(d => ({
        short: capitalize(formatDateKey(d.date, { weekday: "short" })),
        long: capitalize(formatDateKey(d.date, { weekday: "long" }))
      })),
      weeks
    }
  }
}

function buildWeekView({ date, today, eventsOn }: Context): ViewResult<WeekViewDto> {
  const monday = startOfISOWeek(date)

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i)

    return {
      date: day,
      label: weekdayAndDate(day, { day: "numeric", month: "long" }),
      isToday: day === today,
      events: eventsOn(day).map(toEventDto)
    }
  })

  return {
    title: formatDateRange(monday, addDays(monday, 6), { day: "numeric", month: "long", year: "numeric" }),
    subtitle: `Week ${isoWeek(date)}, ${isoWeekYear(date)}`,
    eventCount: days.reduce((sum, d) => sum + d.events.length, 0),
    content: { view: "week", days }
  }
}

function buildDayView({ date, eventsOn }: Context): ViewResult<DayViewDto> {
  const events = eventsOn(date).map(toEventDto)

  return {
    title: fullDate(date),
    subtitle: `Week ${isoWeek(date)}`,
    eventCount: events.length,
    content: { view: "day", events }
  }
}

const viewBuilders = {
  month: buildMonthView,
  week: buildWeekView,
  day: buildDayView
}

// ==============================
// Toolbar
// ==============================

const STEP: Record<ViewMode, (date: string, n: number) => string> = {
  month: (date, n) => addMonths(startOfMonth(date), n),
  week: (date, n) => addDays(date, 7 * n),
  day: (date, n) => addDays(date, n)
}

function buildToolbar(index: ScheduleIndex, view: ViewMode, date: string, today: string): ToolbarDto {
  const year = Number(date.slice(0, 4))
  const firstYear = Math.min(Number(index.firstDay.slice(0, 4)), year)
  const lastYear = Math.max(Number(index.lastDay.slice(0, 4)), year)

  const years: NavOption[] = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => ({
    value: addMonths(date, (firstYear + i - year) * 12),
    label: String(firstYear + i)
  }))

  const months: NavOption[] = Array.from({ length: 12 }, (_, i) => {
    const value = `${year}-${String(i + 1).padStart(2, "0")}-01`
    return { value, label: capitalize(formatDateKey(value, { month: "long" })) }
  })

  // One option per ISO week touching the month; navigates to the week's first day in the month.
  const weeks: NavOption[] = []
  for (const day of monthGrid(date)) {
    if (!sameMonth(day, date)) continue
    const label = `Week ${isoWeek(day)}`
    if (!weeks.some(w => w.label === label)) weeks.push({ value: day, label })
  }
  const currentWeek = `Week ${isoWeek(date)}`

  return {
    years,
    selectedYear: years.find(y => y.label === String(year))!.value,
    months,
    selectedMonth: startOfMonth(date),
    weeks,
    selectedWeek: weeks.find(w => w.label === currentWeek)?.value ?? "",
    departments: index.departments.map(d => ({ value: d, label: capitalize(d) })),
    previous: { value: STEP[view](date, -1), label: `Previous ${view}` },
    next: { value: STEP[view](date, 1), label: `Next ${view}` },
    today
  }
}

// ==============================
// Entry point
// ==============================

export function buildSchedule(
  items: WorkOrder[],
  view: ViewMode,
  date: string,
  department: string
): ScheduleResponse {
  const index = getIndex(items)
  const today = localDateKey(new Date())

  const eventsOn = (day: string) => {
    const events = index.byDay.get(day) ?? []
    return department ? events.filter(e => e.department === department) : events
  }

  const { title, subtitle, eventCount, content } = viewBuilders[view]({ index, date, today, eventsOn })
  const filter = department ? ` for ${capitalize(department)}` : ""

  return {
    view,
    date,
    department,
    dateLang: DATE_LANG,
    title,
    subtitle,
    countLabel: `${plural(eventCount, "event")}${filter}`,
    toolbar: buildToolbar(index, view, date, today),
    content
  }
}
