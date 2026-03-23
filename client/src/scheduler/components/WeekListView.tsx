import React from "react"
import type { ScheduleItemDto } from "../../api/scheduleApi"
import { getISOWeek, getStartOfISOWeek } from "../utils/calendarUtils"
import "../../styles/print.css"

type Props = {
  events: ScheduleItemDto[]
  selectedDate: Date
  onSelect?: (event: ScheduleItemDto) => void
}

function groupByDay(events: ScheduleItemDto[]) {
  const map: Record<string, ScheduleItemDto[]> = {}

  for (const event of events) {
    const key = new Date(event.startAt).toDateString()

    if (!map[key]) {
      map[key] = []
    }

    map[key].push(event)
  }

  Object.values(map).forEach(dayEvents => {
    dayEvents.sort((a, b) => {
      return (
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      )
    })
  })

  return map
}

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
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  })
}

function formatWeekLabel(date: Date) {
  return `${getISOWeek(date)} / ${String(date.getFullYear()).slice(-2)}`
}

function EventDetails({
  event,
  onSelect
}: {
  event: ScheduleItemDto
  onSelect?: (event: ScheduleItemDto) => void
}) {
  return (
    <div
      onClick={() => onSelect?.(event)}
      style={{
        cursor: onSelect ? "pointer" : "default",
        lineHeight: 1.35
      }}
    >
      <div style={{ fontWeight: 700 }}>{event.title}</div>

      {event.production && (
        <div style={{ color: "#333" }}>{event.production}</div>
      )}

      {event.department && (
        <div style={{ color: "#444" }}>{event.department}</div>
      )}

      {event.workType && (
        <div style={{ color: "#555" }}>{event.workType}</div>
      )}

      {event.venue && (
        <div style={{ color: "#222", fontStyle: "italic" }}>
          {event.venue}
        </div>
      )}

      {event.equipment && event.equipment.length > 0 && (
        <div style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
          {event.equipment.join(", ")}
        </div>
      )}

      <div style={{ color: "#777", fontSize: 12, marginTop: 4 }}>
        Year {event.year} · Month {event.month} · Week {event.weekNumber} · Weekday{" "}
        {event.weekday}
      </div>
    </div>
  )
}

export default function WeekListView({
  events,
  selectedDate,
  onSelect
}: Props) {
  const weekStart = getStartOfISOWeek(selectedDate)

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    return date
  })

  const grouped = groupByDay(events)
  const weekNumber = getISOWeek(selectedDate)
  const year = selectedDate.getFullYear()

  return (
    <div
      id="print-area"
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "8px 0 24px 0",
        color: "#111"
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#444",
            marginBottom: 8
          }}
        >
          {selectedDate.toLocaleDateString("fi-FI", {
            month: "long",
            year: "numeric"
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr auto",
            alignItems: "end",
            gap: 16,
            borderBottom: "1px solid #bbb",
            paddingBottom: 10
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, textTransform: "uppercase" }}>
            Viikko
          </div>

          <div style={{ fontSize: 24, fontWeight: 500 }}>
            {weekNumber} / {formatWeekLabel(selectedDate).split(" / ")[1]}
          </div>

          <button
            onClick={() => window.print()}
            style={{
              border: "1px solid #d0d0d0",
              background: "#fff",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Print week
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 13, color: "#555" }}>
          {year} · ISO week {weekNumber}
        </div>
      </div>

      {weekDays.map(day => {
        const key = day.toDateString()
        const dayEvents = grouped[key] || []

        return (
          <section
            key={key}
            className="day-section"
            style={{
              marginBottom: 24
            }}
          >
            <div
              style={{
                borderTop: "1px solid #d6d6d6",
                paddingTop: 10,
                marginBottom: 12
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.5
                }}
              >
                {formatDayHeader(day)}
              </div>
            </div>

            {dayEvents.length === 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: 16,
                  minHeight: 32
                }}
              >
                <div />
                <div style={{ color: "#777", fontStyle: "italic" }}>No events</div>
              </div>
            ) : (
              dayEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr",
                    gap: 16,
                    marginBottom: 18,
                    alignItems: "start",
                    pageBreakInside: "avoid"
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      paddingTop: 1
                    }}
                  >
                    {formatTimeRange(event)}
                  </div>

                  <EventDetails event={event} onSelect={onSelect} />
                </div>
              ))
            )}
          </section>
        )
      })}
    </div>
  )
}