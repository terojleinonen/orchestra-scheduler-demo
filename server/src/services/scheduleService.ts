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
import {
  addDays,
  formatDateKey,
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
// Helpers
// ==============================

function groupByDay(items: WorkOrder[]) {
  const map = new Map<string, WorkOrder[]>()

  for (const item of items) {
    const key = localDateKey(item.startAt)
    map.set(key, [...(map.get(key) ?? []), item])
  }

  return map
}

function toEventDto(item: WorkOrder): EventDto {
  const start = new Date(item.startAt)
  const end = new Date(start.getTime() + item.durationMinutes * 60_000)
  const day = localDateKey(start)

  return {
    id: item.id,
    title: item.title,
    timeRange: `${formatTime(start)} – ${formatTime(end)}`,
    weekLabel: `Week ${isoWeek(day)} · Day ${isoWeekday(day)}`,
    production: item.production,
    workType: item.workType,
    department: item.department,
    venue: item.venue,
    equipment: item.equipment
  }
}

// Today if it falls within the data, otherwise the closest day that has events.
export function defaultDate(items: WorkOrder[]): string {
  const today = localDateKey(new Date())
  if (!items.length) return today

  const first = localDateKey(items[0].startAt)
  const last = localDateKey(items[items.length - 1].startAt)

  if (today < first) return first
  if (today > last) return last
  return today
}

// ==============================
// Views
// ==============================

function buildToolbar(date: string): ToolbarDto {
  const year = date.slice(0, 4)

  const months: NavOption[] = Array.from({ length: 12 }, (_, i) => {
    const value = `${year}-${String(i + 1).padStart(2, "0")}-01`
    return { value, label: formatDateKey(value, "en-US", { month: "long" }) }
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
    months,
    selectedMonth: startOfMonth(date),
    weeks,
    selectedWeek: weeks.find(w => w.label === currentWeek)?.value ?? ""
  }
}

function buildMonthView(items: WorkOrder[], date: string): MonthViewDto {
  const byDay = groupByDay(items)
  const grid = monthGrid(date)

  return {
    view: "month",
    title: formatDateKey(date, "en-US", { month: "long", year: "numeric" }),
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weeks: Array.from({ length: 6 }, (_, row) => {
      const days = grid.slice(row * 7, row * 7 + 7)

      return {
        weekNumber: isoWeek(days[0]),
        days: days.map(day => ({
          date: day,
          dayOfMonth: Number(day.slice(8)),
          inMonth: sameMonth(day, date),
          eventCount: byDay.get(day)?.length ?? 0
        }))
      }
    })
  }
}

function buildWeekView(items: WorkOrder[], date: string): WeekViewDto {
  const byDay = groupByDay(items)
  const monday = startOfISOWeek(date)

  return {
    view: "week",
    title: `${isoWeekYear(date)} — Week ${isoWeek(date)}`,
    days: Array.from({ length: 7 }, (_, i) => {
      const day = addDays(monday, i)

      return {
        date: day,
        label: formatDateKey(day, "fi-FI", { weekday: "short", day: "2-digit", month: "2-digit" }),
        events: (byDay.get(day) ?? []).map(toEventDto)
      }
    })
  }
}

function buildDayView(items: WorkOrder[], date: string): DayViewDto {
  return {
    view: "day",
    title: formatDateKey(date, "fi-FI", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }),
    events: (groupByDay(items).get(date) ?? []).map(toEventDto)
  }
}

const viewBuilders = {
  month: buildMonthView,
  week: buildWeekView,
  day: buildDayView
}

export function buildSchedule(items: WorkOrder[], view: ViewMode, date: string): ScheduleResponse {
  return {
    date,
    toolbar: buildToolbar(date),
    content: viewBuilders[view](items, date)
  }
}
