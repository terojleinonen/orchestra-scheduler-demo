import React, { useMemo, useState } from "react"
import { useSchedule } from "../scheduler/hooks/useSchedule"

import CalendarToolbar from "../scheduler/components/CalendarToolbar"
import MonthCalendarView from "../scheduler/components/MonthCalendarView"
import WeekListView from "../scheduler/components/WeekListView"
import DayDetailView from "../scheduler/components/DayDetalView"
import {
  isSameDay,
  getStartOfISOWeek
} from "../scheduler/utils/calendarUtils"

import type { ScheduleItemDto } from "../api/scheduleApi"

// ==============================
// Types
// ==============================

type ViewMode = "month" | "week" | "day"

// ==============================
// Component
// ==============================

export default function SchedulePage() {
  const { events, loading, error } = useSchedule({})

  const [view, setView] = useState<ViewMode>("week")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] =
    useState<ScheduleItemDto | null>(null)

  // ==============================
  // Filters
  // ==============================

  // Same year (keeps things simple)
  const yearEvents = useMemo(() => {
    return events.filter(e => {
      const d = new Date(e.startAt)
      return d.getFullYear() === selectedDate.getFullYear()
    })
  }, [events, selectedDate])

  // Week range
  const weekStart = useMemo(
    () => getStartOfISOWeek(selectedDate),
    [selectedDate]
  )

  const weekEnd = useMemo(() => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + 7)
    return d
  }, [weekStart])

  const weekEvents = useMemo(() => {
    return yearEvents.filter(e => {
      const d = new Date(e.startAt)
      return d >= weekStart && d < weekEnd
    })
  }, [yearEvents, weekStart, weekEnd])

  // Day events
  const dayEvents = useMemo(() => {
    return yearEvents.filter(e =>
      isSameDay(new Date(e.startAt), selectedDate)
    )
  }, [yearEvents, selectedDate])

  // ==============================
  // States
  // ==============================

  if (loading) {
    return <div style={{ padding: 20 }}>Loading schedule...</div>
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        {error}
      </div>
    )
  }

  // ==============================
  // Render
  // ==============================

  return (
    <div className="surface" style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>
        Orchestra Scheduler
      </h1>

      {/* ===================== */}
      {/* Toolbar */}
      {/* ===================== */}

      <CalendarToolbar
        view={view}
        setView={setView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* ===================== */}
      {/* Views */}
      {/* ===================== */}

      {view === "month" && (
        <MonthCalendarView
          events={yearEvents}
          selectedDate={selectedDate}
          onSelectDate={date => {
            setSelectedDate(date)
            setView("day") // your decision ✔
          }}
        />
      )}

      {view === "week" && (
        <WeekListView
          events={weekEvents}
          selectedDate={selectedDate}
          onSelect={setSelectedEvent}
        />
      )}

      {view === "day" && (
        <DayDetailView
          events={dayEvents}
          selectedDate={selectedDate}
          onSelect={setSelectedEvent}
        />
      )}

      {/* ===================== */}
      {/* Overlay */}
      {/* ===================== */}

      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999
          }}
        />
      )}
    </div>
  )
}