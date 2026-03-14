import { useNavigate } from "react-router-dom"
import { type ScheduleEvent } from "../api/scheduleApi"

interface Props {
  events: ScheduleEvent[]
  year: number
  month: number   // 0–11 (JavaScript month index)
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function MonthView({ events, year, month }: Props) {
  const navigate = useNavigate()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = new Date(year, month, 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  function eventsForDay(day: number) {

    return events.filter(e => {
      const d = new Date(e.start)

      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      )
    })
  }

  function openWeek(day: number) {
    const date = new Date(year, month, day)
    navigate(`/schedule/week?date=${date.toISOString()}`)
  }

  return (
    <div className="monthView">
      <div className="monthGrid">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="monthHeader">
            {d}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_,i)=>(
          <div key={`empty-${i}`} />
        ))}

        {days.map(day => {
          const dayEvents = eventsForDay(day)

          return (
            <div
              key={day}
              className="monthCell"
              onClick={() => openWeek(day)}
            >
              <div className="monthDate">
                {day}
              </div>
              {dayEvents.length > 0 && (
                <div className="monthEventCount">
                  {dayEvents.length} service
                  {dayEvents.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}