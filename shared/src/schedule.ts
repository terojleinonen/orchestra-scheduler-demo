// Contract between server and client.
// The server builds these ready-to-render view models; the client only displays them.
// All dates are "YYYY-MM-DD" strings in the schedule's time zone.

export type ViewMode = "month" | "week" | "day"

export type NavOption = {
  value: string // date to navigate to
  label: string
}

export type ToolbarDto = {
  months: NavOption[]
  selectedMonth: string
  weeks: NavOption[]
  selectedWeek: string
}

export type EventDto = {
  id: string
  title: string
  timeRange: string
  weekLabel: string
  production?: string
  workType?: string
  department?: string
  venue?: string
  equipment: string[]
}

export type MonthDayDto = {
  date: string
  dayOfMonth: number
  inMonth: boolean
  eventCount: number
}

export type MonthViewDto = {
  view: "month"
  title: string
  weekdays: string[]
  weeks: { weekNumber: number; days: MonthDayDto[] }[]
}

export type WeekViewDto = {
  view: "week"
  title: string
  days: { date: string; label: string; events: EventDto[] }[]
}

export type DayViewDto = {
  view: "day"
  title: string
  events: EventDto[]
}

export type ScheduleResponse = {
  date: string
  toolbar: ToolbarDto
  content: MonthViewDto | WeekViewDto | DayViewDto
}
