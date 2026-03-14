import { type ScheduleEvent } from "../api/scheduleApi"

interface Props {
  events: ScheduleEvent[]
  production: string
}

function formatDate(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  })
}

function formatTime(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function ProductionTimeline({ events, production }: Props) {

  const productionEvents = events
    .filter(e => e.production === production)
    .sort(
      (a,b)=>new Date(a.start).getTime()-new Date(b.start).getTime()
    )

  return (
    <div className="productionTimeline">
      <h2>{production}</h2>
      {productionEvents.map(event => (
        <div key={event.id} className="productionEvent">
          <div className="productionDate">
            {formatDate(event.start)}
          </div>
          <div className="productionTime">
            {formatTime(event.start)}
          </div>
          <div className="productionTitle">
            {event.title}
          </div>
          {event.venue && (
            <div className="productionVenue">
              {event.venue}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}