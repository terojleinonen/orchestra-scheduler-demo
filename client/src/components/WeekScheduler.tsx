import { type ScheduleEvent } from "../api/scheduleApi"
import TimeColumn from "./TimeColumn"
import DayColumn from "./DayColumn"
import NowLine from "./NowLine"
import { detectConflicts } from "../utils/conflictDetection"

interface Props {
  events: ScheduleEvent[]
}

const days = [0, 1, 2, 3, 4, 5, 6]

export default function WeekScheduler({ events }: Props) {
  const conflicts = detectConflicts(events)


  return (
    <div className="weekScheduler">
      <TimeColumn />
      <NowLine />
      {days.map(day => (
        <DayColumn
          key={day}
          day={day}
          events={events}
          conflicts={conflicts}
        />
      ))}
    </div>
  )
}