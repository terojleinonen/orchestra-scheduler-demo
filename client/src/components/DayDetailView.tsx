import type { DayViewDto } from "@orchestra/shared"
import EventItem from "./EventItem"

export default function DayDetailView({ day }: { day: DayViewDto }) {
  return (
    <div id="print-area" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>{day.title}</h2>

      {day.events.length === 0 ? (
        <div className="muted">No events for this day</div>
      ) : (
        day.events.map(event => <EventItem key={event.id} event={event} showWeekLabel />)
      )}
    </div>
  )
}
