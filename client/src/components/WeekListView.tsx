import type { WeekViewDto } from "@orchestra/shared"
import EventItem from "./EventItem"
import { formatCount } from "../utils/format"

export default function WeekListView({ week }: { week: WeekViewDto }) {
  return (
    <div className="week">
      {week.days.map(day => {
        const headingId = `day-${day.date}`

        return (
          <section key={day.date} className="card day-section" aria-labelledby={headingId}>
            <div className="day-section__header">
              <h2 id={headingId} className="day-section__title">
                {day.label}
              </h2>
              {day.isToday && <span className="badge">Tänään</span>}
              <span className="day-section__count">
                {formatCount(day.events.length)}
              </span>
            </div>

            {day.events.length === 0 ? (
              <p className="empty">Ei tapahtumia.</p>
            ) : (
              <ul className="event-list" role="list">
                {day.events.map(event => (
                  <EventItem key={event.id} event={event} headingLevel={3} />
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
