const API_BASE = "http://localhost:4000/api"

export interface ScheduleEvent {
  id: string
  title: string
  conductor?: string
  venue?: string
  production?: string
  description?: string
  start: string
  end: string
  day?: number
  top?: number
  height?: number
  lane?: number
  laneCount?: number
}

export async function fetchEvents(): Promise<ScheduleEvent[]> {
  const res = await fetch(`${API_BASE}/events`)

  if (!res.ok) {
    throw new Error("Failed to load events")
  }
  return res.json()
}

export async function fetchEventsByMonth(
  year: number,
  month: number
): Promise<ScheduleEvent[]> {

  const res = await fetch(
    `${API_BASE}/events/month?year=${year}&month=${month}`
  )
  if (!res.ok) {
    throw new Error("Failed to load monthly events")
  }
  return res.json()
}

export async function reloadSchedule() {
  const res = await fetch(`${API_BASE}/reload`, {
    method: "POST"
  })

  if (!res.ok) {
    throw new Error("Reload failed")
  }
  return res.json()
}