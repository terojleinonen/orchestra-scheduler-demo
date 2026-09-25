// Contract between server and client.
// The server builds these ready-to-render view models; the client only displays them.
// All dates are "YYYY-MM-DD" strings in the schedule's time zone.
// Fields marked [dateLang] contain formatted dates/times in ScheduleResponse.dateLang;
// all other text is English.

export type ViewMode = "month" | "week" | "day"

export type NavOption = {
  value: string
  label: string
}

export type ToolbarDto = {
  years: NavOption[] // value = date to navigate to
  selectedYear: string
  months: NavOption[] // value = date to navigate to, label [dateLang]
  selectedMonth: string
  weeks: NavOption[] // value = date to navigate to
  selectedWeek: string
  departments: NavOption[] // value = department key
  previous: NavOption // value = date, label = e.g. "Previous week"
  next: NavOption
  today: string
}

export type EventDto = {
  id: string
  title: string
  startAt: string // ISO timestamp, for <time dateTime>
  timeRange: string // [dateLang]
  duration: string // [dateLang]
  production?: string
  workType?: string
  department?: string // key, e.g. "lighting"
  departmentLabel?: string // display name, e.g. "Lighting"
  venue?: string
  conductor?: string
  equipment: string[]
}

export type MonthDayDto = {
  date: string
  dayOfMonth: number
  label: string // [dateLang] full date
  inMonth: boolean
  isToday: boolean
  eventCount: number
  departments: string[] // department keys present on the day
}

export type MonthViewDto = {
  view: "month"
  weekdays: { short: string; long: string }[] // [dateLang]
  weeks: { weekNumber: number; days: MonthDayDto[] }[]
}

export type WeekViewDto = {
  view: "week"
  days: { date: string; label: string; isToday: boolean; events: EventDto[] }[] // label [dateLang]
}

export type DayViewDto = {
  view: "day"
  events: EventDto[]
}

export type ScheduleResponse = {
  view: ViewMode
  date: string
  department: string // "" = all departments
  dateLang: string // BCP 47 language of the [dateLang] fields, e.g. "fi"
  title: string // [dateLang] the date or date range shown
  subtitle: string // e.g. "Week 12"
  countLabel: string // e.g. "27 events for Lighting"
  toolbar: ToolbarDto
  content: MonthViewDto | WeekViewDto | DayViewDto
}
