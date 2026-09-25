export type WorkOrder = {
  id: string

  title?: string
  startAt: string // ISO timestamp
  durationMinutes: number

  production?: string
  workType?: string
  department?: string
  venue?: string
  conductor?: string

  equipment: string[]
}
