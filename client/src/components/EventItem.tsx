import type { EventDto } from "@orchestra/shared"
import { getDepartmentColor } from "../utils/departmentTheme"

type Props = {
  event: EventDto
  showWeekLabel?: boolean
}

export default function EventItem({ event, showWeekLabel }: Props) {
  return (
    <div
      className="event-row"
      style={{ paddingLeft: 10, borderLeft: `4px solid ${getDepartmentColor(event.department)}` }}
    >
      <div style={{ fontWeight: 500 }}>{event.timeRange}</div>

      <div style={{ lineHeight: 1.4 }}>
        <div style={{ fontWeight: 700 }}>{event.title}</div>

        {event.production && <div>{event.production}</div>}

        {event.department && <div className="subtle">{event.department}</div>}

        {event.workType && <div className="subtle">{event.workType}</div>}

        {event.venue && <div style={{ fontStyle: "italic" }}>{event.venue}</div>}

        {event.equipment.length > 0 && (
          <div className="muted" style={{ fontSize: 12 }}>
            {event.equipment.join(", ")}
          </div>
        )}

        {showWeekLabel && (
          <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
            {event.weekLabel}
          </div>
        )}
      </div>
    </div>
  )
}
