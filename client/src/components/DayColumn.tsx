import { type ScheduleEvent } from "../api/scheduleApi"
import EventCard from "./EventCard"

interface Props {
  events: ScheduleEvent[]
  day: number
  conflicts: Set<string>
}

export default function DayColumn({ events, day, conflicts}: Props) {

  const dayEvents = events.filter(
    e => e.day === day
  )

  return (
    <div className="dayColumn">
      {dayEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
        conflict={conflicts.has(event.id)}
        />
      ))}
    </div>
  )
}