// client/src/api/scheduleApi.ts

// ==============================
// Types (should ideally come from /shared)
// ==============================

export type GetEventsQuery = {
  year?: number
  month?: number // 1–12
  week?: number  // 1–53
}

export type ScheduleItemDto = {
  id: string

  title: string
  startAt: string
  durationMinutes?: number

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

// ==============================
// Base config
// ==============================

const API_BASE = "http://localhost:4000/api"

// ==============================
// Helpers
// ==============================

function buildQuery(params: Record<string, any>) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.append(key, String(value))
    }
  })

  const queryString = search.toString()
  return queryString ? `?${queryString}` : ""
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }

  return res.json()
}

// ==============================
// API FUNCTIONS
// ==============================

/**
 * Fetch events with optional filtering
 *
 * Examples:
 * getEvents()
 * getEvents({ year: 2026 })
 * getEvents({ year: 2026, week: 11 })
 */
export async function getEvents(
  query: GetEventsQuery = {}
): Promise<ScheduleItemDto[]> {
  const url = `${API_BASE}/events${buildQuery(query)}`

  const res = await fetch(url)

  return handleResponse(res)
}

/**
 * Reload / clear cache on backend
 */
export async function reloadSchedule(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/events/reload`, {
    method: "POST"
  })

  return handleResponse(res)
}

/**
 * Dev-only: generate fake data
 */
export async function generateFakeData(options?: {
  weeks?: number
  mode?: string
}): Promise<{ message: string }> {
  const query = buildQuery(options || {})

  const res = await fetch(`${API_BASE}/dev/generate${query}`, {
    method: "POST"
  })

  return handleResponse(res)
}

/**
 * Optional: fetch metadata (if you implement it later)
 */
export async function getScheduleMeta(): Promise<{
  years: number[]
  months: number[]
  weeks: number[]
}> {
  const res = await fetch(`${API_BASE}/events/meta`)
  return handleResponse(res)
}