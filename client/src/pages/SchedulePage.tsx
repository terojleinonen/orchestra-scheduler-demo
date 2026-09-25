import { useState } from "react"
import type { ViewMode } from "@orchestra/shared"
import { useSchedule } from "../hooks/useSchedule"

import CalendarToolbar from "../components/CalendarToolbar"
import MonthCalendarView from "../components/MonthCalendarView"
import WeekListView from "../components/WeekListView"
import DayDetailView from "../components/DayDetailView"

export default function SchedulePage() {
  const [view, setView] = useState<ViewMode>("week")
  const [date, setDate] = useState<string>()

  const { data, loading, error } = useSchedule(view, date)

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>
  }

  if (!data) {
    return <div style={{ padding: 20 }}>{loading ? "Loading schedule..." : null}</div>
  }

  const { content } = data

  return (
    <div className="surface" style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Orchestra Scheduler</h1>

      <CalendarToolbar
        toolbar={data.toolbar}
        view={view}
        onViewChange={v => {
          setDate(data.date)
          setView(v)
        }}
        onMonthChange={setDate}
        onWeekChange={d => {
          setDate(d)
          setView("week")
        }}
      />

      {content.view === "month" && (
        <MonthCalendarView
          month={content}
          onSelectDate={d => {
            setDate(d)
            setView("day")
          }}
        />
      )}

      {content.view === "week" && <WeekListView week={content} />}

      {content.view === "day" && <DayDetailView day={content} />}
    </div>
  )
}
