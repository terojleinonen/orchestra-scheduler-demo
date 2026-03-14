import { loadEvents } from "../repositories/scheduleRepository"
import { computeTimelineLayout } from "../layout/timelineLayout"

import { type ScheduleEvent } from "../adapter/opasAdapter"

let preparedEvents: ScheduleEvent[] = []

export function getEvents(): ScheduleEvent[] {

  if (!preparedEvents.length) {

    const events = loadEvents()

    computeTimelineLayout(events)

    preparedEvents = events

  }

  return preparedEvents

}

export function getEventsByMonth(
  year: number,
  month: number
) {

  return getEvents().filter(event => {

    const d = new Date(event.start)

    return (
      d.getFullYear() === year &&
      d.getMonth() === month
    )

  })

}

export function getEventsByRange(
  start: Date,
  end: Date
) {

  return getEvents().filter(event => {

    const d = new Date(event.start)

    return d >= start && d <= end

  })

}
