import { useEffect, useState } from "react"

import {
  fetchEvents,
  type ScheduleEvent
} from "../api/scheduleApi"

export function useSchedule() {

  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadEvents() {

    try {

      setLoading(true)

      const data = await fetchEvents()

      setEvents(data)

    } catch (err) {

      console.error(err)

      setError("Failed to load schedule")

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    loadEvents()

  }, [])

  return {

    events,
    loading,
    error,
    reload: loadEvents

  }

}