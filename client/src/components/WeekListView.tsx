import type { WeekViewDto } from "@orchestra/shared"
import EventItem from "./EventItem"

export default function WeekListView({ week }: { week: WeekViewDto }) {
  return (
    <div id="print-area" style={{ maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 6 }}>{week.title}</h2>

        <button className="btn" onClick={() => window.print()}>
          🖨 Print week
        </button>
      </div>

      {week.days.map(day => (
        <section key={day.date} className="day-section">
          <div
            style={{
              borderBottom: "1px solid var(--border-strong)",
              marginBottom: 10,
              paddingBottom: 6,
              fontWeight: 700
            }}
          >
            {day.label}
          </div>

          {day.events.length === 0 ? (
            <div className="muted">No events</div>
          ) : (
            day.events.map(event => <EventItem key={event.id} event={event} />)
          )}
        </section>
      ))}
    </div>
  )
}
