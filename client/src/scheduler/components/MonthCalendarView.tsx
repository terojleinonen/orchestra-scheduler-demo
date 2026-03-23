import React from "react"
import { getMonthGrid, getISOWeek } from "../utils/calendarUtils"
import type { ScheduleItemDto } from "../../api/scheduleApi"

export default function MonthCalendarView({
  events,
  selectedDate,
  onSelectDate
}: {
  events: ScheduleItemDto[]
  selectedDate: Date
  onSelectDate: (d: Date) => void
}) {
  const days = getMonthGrid(selectedDate)

  const eventsByDay: Record<string, number> = {}

  events.forEach(e => {
    const key = new Date(e.startAt).toDateString()
    eventsByDay[key] = (eventsByDay[key] || 0) + 1
  })

  return (
    <div className="calendar-cell surface">
      <h2>
        {selectedDate.toLocaleString("default", { month: "long" })}{" "}
        {selectedDate.getFullYear()}
      </h2>

      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "40px repeat(7, 1fr)" }}>
        <div />
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      {Array.from({ length: 6 }).map((_, row) => {
        const week = days.slice(row * 7, row * 7 + 7)
        const weekNumber = getISOWeek(week[0])

        return (
          <div
            key={row}
            className="calendar-grid"
          >
            {/* Week number */}
            <div style={{ fontSize: 12 }}>{weekNumber}</div>

            {week.map(day => {
              const key = day.toDateString()
              const count = eventsByDay[key] || 0

              return (
                <div
                  key={key}
                  onClick={() => onSelectDate(day)}
                  className="calendar-cell"
                >
                  <div>{day.getDate()}</div>
                  {count > 0 && (
                    <div style={{ fontSize: 12 }}>{count} events</div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}