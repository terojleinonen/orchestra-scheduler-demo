import { useCallback, useEffect, useState } from "react"
import type { ScheduleResponse } from "@orchestra/shared"
import type { ScheduleParams } from "./useUrlState"

// Fetches a ready-to-render schedule view. Without a date the server picks one.
// The previous result stays available while the next one loads.
export function useSchedule({ view, date, department }: ScheduleParams) {
  const [data, setData] = useState<ScheduleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({ view })
        if (date) params.set("date", date)
        if (department) params.set("department", department)

        const res = await fetch(`/api/schedule?${params}`)
        if (!res.ok) {
          throw new Error(`Palvelin palautti virheen (${res.status}).`)
        }

        const json: ScheduleResponse = await res.json()
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof TypeError ? "Aikataulupalvelimeen ei saatu yhteyttä." : String((err as Error).message))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [view, date, department, attempt])

  const retry = useCallback(() => setAttempt(n => n + 1), [])

  return { data, loading, error, retry }
}
