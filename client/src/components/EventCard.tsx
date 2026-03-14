import { type ScheduleEvent } from "../api/scheduleApi"
import { useScheduler } from "../context/SchedulerContext"
import { getProductionColor } from "../utils/productionColors"

interface Props {
  event: ScheduleEvent
  conflict?: boolean
}


function formatTime(dateString: string) {

  const date = new Date(dateString)

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })

}

export default function EventCard({ event, conflict }: Props) {
  const { setSelectedEvent } = useScheduler()
  const laneCount = event.laneCount ?? 1
  const lane = event.lane ?? 0
  const width = 100 / laneCount
  const left = lane * width
  const top = event.top ?? 0
  const height = event.height ?? 40
  const startTime = formatTime(event.start)
  const endTime = formatTime(event.end)
  const background = getProductionColor(event.production)

  return (
    <div
      className={`eventCard ${conflict ? "eventConflict" : ""}`}
      style={{
        position: "absolute",
        top,
        height,
        width: `${width}%`,
        left: `${left}%`,
        background
      }}
      onClick={() => setSelectedEvent(event)}
    >
      {event.production && (
        <div className="eventProduction">
          {event.production}
        </div>
      )}
      <div className="eventTime">
        {startTime} – {endTime}
      </div>
      <div className="eventTitle">
        {event.title}
      </div>
      {event.venue && (
        <div className="eventMeta">
          {event.venue}
        </div>
      )}
      {event.conductor && (
        <div className="eventMeta">
          Conductor: {event.conductor}
        </div>
      )}
    </div>
  )
}