import type { ScheduleEvent } from "../adapter/opasAdapter"

const START_HOUR = 8

function minutesSinceStartOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

function overlaps(a: ScheduleEvent, b: ScheduleEvent): boolean {

  const aStart = new Date(a.start).getTime()
  const aEnd = new Date(a.end).getTime()

  const bStart = new Date(b.start).getTime()
  const bEnd = new Date(b.end).getTime()

  return aStart < bEnd && aEnd > bStart
}

function assignLanes(events: ScheduleEvent[]) {

  const lanes: ScheduleEvent[][] = []

  events.forEach(event => {

    let placed = false

    for (let i = 0; i < lanes.length; i++) {

      const lane = lanes[i]

      const conflict = lane.some(e => overlaps(e, event))

      if (!conflict) {
        lane.push(event)
        ;(event as any).lane = i
        placed = true
        break
      }

    }

    if (!placed) {

      lanes.push([event])
      ;(event as any).lane = lanes.length - 1

    }

  })

  const laneCount = lanes.length

  events.forEach(event => {
    ;(event as any).laneCount = laneCount
  })

}

export function computeTimelineLayout(events: ScheduleEvent[]) {

  if (!events || events.length === 0) return

  const grouped: Record<number, ScheduleEvent[]> = {}

  events.forEach(event => {

    const start = new Date(event.start)

    const day = start.getDay()

    if (!grouped[day]) {
      grouped[day] = []
    }

    grouped[day].push(event)

  })

  Object.values(grouped).forEach(dayEvents => {

    dayEvents.sort(
      (a, b) =>
        new Date(a.start).getTime() -
        new Date(b.start).getTime()
    )

    dayEvents.forEach(event => {

      const start = new Date(event.start)
      const end = new Date(event.end)

      const startMinutes =
        minutesSinceStartOfDay(start)

      const endMinutes =
        minutesSinceStartOfDay(end)

      const startOffset = START_HOUR * 60

      ;(event as any).top = startMinutes - startOffset

      ;(event as any).height = endMinutes - startMinutes

      ;(event as any).day = start.getDay()

    })

    assignLanes(dayEvents)

  })

}