import type { DayViewDto } from "@orchestra/shared"
import EventItem from "./EventItem"

export default function DayDetailView({ day }: { day: DayViewDto }) {
  return (
    <div className="card day-view">
      {day.events.length === 0 ? (
        <p className="empty">Tälle päivälle ei ole tapahtumia.</p>
      ) : (
        <ul className="event-list" role="list">
          {day.events.map(event => (
            <EventItem key={event.id} event={event} headingLevel={2} />
          ))}
        </ul>
      )}
    </div>
  )
}
