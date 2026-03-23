export type GetEventsQuery = {
  year?: number
  month?: number
  week?: number
}

export type ScheduleItemDto = {
  id: string
  title: string
  startAt: string

  year: number
  month: number
  weekNumber: number
  weekday: number

  production?: string
  workType?: string
  department?: string
  venue?: string

  equipment: string[]
}