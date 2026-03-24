import React from "react"
import type { ScheduleItemDto } from "../../api/scheduleApi"
import {
  getISOWeek,
  getStartOfISOWeek
} from "../utils/calendarUtils"
import { getDepartmentTheme } from "../utils/departmentTheme"

type Props = {
  events: ScheduleItemDto[]
  selectedDate: Date
  onSelect?: (event: ScheduleItemDto) => void
}

// ==============================
// Helpers
// ==============================

function groupByDay(events: ScheduleItemDto[]) {
  const map: Record<string, ScheduleItemDto[]> = {}

  for (const event of events) {
    const key = new Date(event.startAt).toDateString()
    if (!map[key]) map[key] = []
    map[key].push(event)
  }

  Object.values(map).forEach(dayEvents => {
    dayEvents.sort(
      (a, b) =>
        new Date(a.startAt).getTime() -
        new Date(b.startAt).getTime()
    )
  })

  return map
}

function formatTimeRange(event: ScheduleItemDto) {
  const start = new Date(event.startAt)
  const end = new Date(
    start.getTime() + (event.durationMinutes || 0) * 60000
  )

  const fmt = (d: Date) =>
    d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

  return `${fmt(start)} – ${fmt(end)}`
}

function formatDayHeader(date: Date) {
  return date.toLocaleDateString("fi-FI", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  })
}

// ==============================
// Component
// ==============================

export default function WeekListView({
  events,
  selectedDate,
  onSelect
}: Props) {
  const weekStart = getStartOfISOWeek(selectedDate)
  const weekNumber = getISOWeek(selectedDate)

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const grouped = groupByDay(events)

  return (
    <div id="print-area" style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 6 }}>
          {selectedDate.getFullYear()} — Week {weekNumber}
        </h2>

        <button onClick={() => window.print()}>
          🖨 Print week
        </button>
      </div>

      {/* DAYS */}
      {days.map(day => {
        const key = day.toDateString()
        const dayEvents = grouped[key] || []

        return (
          <section
            key={key}
            className="day-section"
            style={{ marginBottom: 24 }}
          >
            {/* DAY HEADER */}
            <div
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: 10,
                paddingBottom: 6,
                fontWeight: 700
              }}
            >
              {formatDayHeader(day)}
            </div>

            {/* EVENTS */}
            {dayEvents.length === 0 ? (
              <div style={{ color: "#777" }}>No events</div>
            ) : (
              dayEvents.map(event => {
                const theme = getDepartmentTheme(
                  event.department
                )

                return (
                  <div
                    key={event.id}
                    onClick={() => onSelect?.(event)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr",
                      gap: 16,
                      marginBottom: 14,
                      paddingLeft: 10,
                      borderLeft: `4px solid ${theme.border}`,
                      cursor: "pointer"
                    }}
                  >
                    {/* TIME */}
                    <div style={{ fontWeight: 500 }}>
                      {formatTimeRange(event)}
                    </div>

                    {/* CONTENT */}
                    <div style={{ lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 700 }}>
                        {event.title}
                      </div>

                      {event.production && (
                        <div>{event.production}</div>
                      )}

                      {event.department && (
                        <div style={{ color: "#444" }}>
                          {event.department}
                        </div>
                      )}

                      {event.workType && (
                        <div style={{ color: "#555" }}>
                          {event.workType}
                        </div>
                      )}

                      {event.venue && (
                        <div style={{ fontStyle: "italic" }}>
                          {event.venue}
                        </div>
                      )}

                      {event.equipment?.length > 0 && (
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {event.equipment.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </section>
        )
      })}
    </div>
  )
}