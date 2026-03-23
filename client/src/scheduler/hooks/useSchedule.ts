// client/src/features/scheduler/hooks/useSchedule.ts
import { useEffect, useState } from "react"
import { getEvents, type GetEventsQuery, type ScheduleItemDto } from "client/src/api/scheduleApi"

export function useSchedule(query: GetEventsQuery) {
  const [events, setEvents] = useState<ScheduleItemDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const data = await getEvents(query)

        if (!cancelled) {
          setEvents(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load schedule")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [query.year, query.month, query.week])

  return { events, loading, error }
}