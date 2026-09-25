import type { WeekViewDto } from "@orchestra/shared"
import EventItem from "./EventItem"

export default function WeekListView({ week, lang }: { week: WeekViewDto; lang: string }) {
  return (
    <div className="week">
      {week.days.map(day => {
        const headingId = `day-${day.date}`

        return (
          <section key={day.date} className="card day-section" aria-labelledby={headingId}>
            <div className="day-section__header">
              <h2 id={headingId} className="day-section__title" lang={lang}>
                {day.label}
              </h2>
              {day.isToday && <span className="badge">Today</span>}
              <span className="day-section__count">
                {day.events.length} {day.events.length === 1 ? "event" : "events"}
              </span>
            </div>

            {day.events.length === 0 ? (
              <p className="empty">No events scheduled.</p>
            ) : (
              <ul className="event-list" role="list">
                {day.events.map(event => (
                  <EventItem key={event.id} event={event} headingLevel={3} lang={lang} />
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
