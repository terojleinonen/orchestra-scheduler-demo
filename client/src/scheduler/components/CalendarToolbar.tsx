import React from "react"
import { getWeeksInMonth } from "../utils/calendarUtils"

export default function CalendarToolbar({
  view,
  setView,
  selectedDate,
  setSelectedDate
}: any) {
  const weeks = getWeeksInMonth(selectedDate)

  const handleMonthChange = (e: any) => {
    const month = Number(e.target.value)
    const d = new Date(selectedDate)
    d.setMonth(month)
    setSelectedDate(d)
  }

  const handleWeekChange = (e: any) => {
    const week = Number(e.target.value)

    const d = new Date(selectedDate)
    d.setDate(1)

    while (true) {
      if (getWeeksInMonth(d).includes(week)) break
      d.setDate(d.getDate() + 1)
    }

    setSelectedDate(d)
    setView("week")
  }

  return (
    <div className="surface toolbar">
      {/* Month */}
      <select value={selectedDate.getMonth()} onChange={handleMonthChange}>
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i} value={i}>
            {new Date(0, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      {/* Week */}
      <select onChange={handleWeekChange}>
        {weeks.map(w => (
          <option key={w} value={w}>
            Week {w}
          </option>
        ))}
      </select>

      {/* View */}
      <div style={{ marginLeft: "auto" }}>
        {["month", "week", "day"].map(v => (
          <button key={v} onClick={() => setView(v as any)} className="btn">
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}