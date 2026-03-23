import React from "react"
import type { ScheduleItemDto } from "../../api/scheduleApi"

// ==============================
// Helpers
// ==============================

function formatTimeRange(event: ScheduleItemDto) {
  const start = new Date(event.startAt)
  const end = new Date(
    start.getTime() + (event.durationMinutes || 0) * 60000
  )

  const fmt = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

  return `${fmt(start)} - ${fmt(end)}`
}

function formatDayHeader(date: Date) {
  return date.toLocaleDateString("fi-FI", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

// ==============================
// Event block
// ==============================

function EventDetails({
  event,
  onSelect
}: {
  event: ScheduleItemDto
  onSelect?: (e: ScheduleItemDto) => void
}) {
  return (
    <div
      onClick={() => onSelect?.(event)}
      style={{
        cursor: onSelect ? "pointer" : "default",
        lineHeight: 1.4
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16 }}>
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
        <div style={{ color: "#666", marginTop: 4 }}>
          {event.equipment.join(", ")}
        </div>
      )}

      {/* Debug / metadata */}
      <div style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
        Year {event.year} · Month {event.month} · Week {event.weekNumber} · Day {event.weekday}
      </div>
    </div>
  )
}

// ==============================
// Component
// ==============================

export default function DayDetailView({
  events,
  selectedDate,
  onSelect
}: {
  events: ScheduleItemDto[]
  selectedDate: Date
  onSelect?: (e: ScheduleItemDto) => void
}) {
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.startAt).getTime() -
      new Date(b.startAt).getTime()
  )

  return (
    <div
      id="print-area"
      style={{
        maxWidth: 900,
        margin: "0 auto",
        paddingTop: 10
      }}
    >
      {/* ===================== */}
      {/* HEADER */}
      {/* ===================== */}
      <h2 style={{ marginBottom: 20 }}>
        {formatDayHeader(selectedDate)}
      </h2>

      {/* ===================== */}
      {/* EVENTS */}
      {/* ===================== */}
      {sorted.length === 0 ? (
        <div style={{ color: "#777", fontStyle: "italic" }}>
          No events for this day
        </div>
      ) : (
        sorted.map(event => (
          <div
            key={event.id}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: 16,
              marginBottom: 18,
              alignItems: "start"
            }}
          >
            {/* TIME */}
            <div
              style={{
                fontWeight: 500,
                whiteSpace: "nowrap"
              }}
            >
              {formatTimeRange(event)}
            </div>

            {/* DETAILS */}
            <EventDetails event={event} onSelect={onSelect} />
          </div>
        ))
      )}
    </div>
  )
}