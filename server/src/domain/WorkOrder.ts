export type WorkOrder = {
  id: string

  title: string
  startAt: string
  endAt?: string
  durationMinutes?: number

  year: number
  month: number        // 1–12
  weekNumber: number   // 1–53
  weekday: number      // 1–7 (Mon–Sun)

  production?: string
  workType?: string
  department?: string
  venue?: string
  conductor?: string

  equipment: string[]

  source?: {
    system: string
    rawType?: string
  }
}