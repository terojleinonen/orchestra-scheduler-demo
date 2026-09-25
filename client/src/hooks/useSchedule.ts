import { useEffect, useState } from "react"
import type { ScheduleResponse, ViewMode } from "@orchestra/shared"

// Fetches a ready-to-render schedule view. Without a date the server picks one.
export function useSchedule(view: ViewMode, date?: string) {
  const [data, setData] = useState<ScheduleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({ view })
        if (date) params.set("date", date)

        const res = await fetch(`/api/schedule?${params}`)
        if (!res.ok) {
          throw new Error(`API error ${res.status}: ${await res.text()}`)
        }

        const json: ScheduleResponse = await res.json()
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load schedule")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [view, date])

  return { data, loading, error }
}
