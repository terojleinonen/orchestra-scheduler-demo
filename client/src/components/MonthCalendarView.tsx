import type { MonthViewDto } from "@orchestra/shared"

type Props = {
  month: MonthViewDto
  onSelectDate: (date: string) => void
}

export default function MonthCalendarView({ month, onSelectDate }: Props) {
  return (
    <div className="surface" style={{ padding: 8 }}>
      <h2>{month.title}</h2>

      {/* Header */}
      <div className="calendar-grid">
        <div />
        {month.weekdays.map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      {month.weeks.map(week => (
        <div key={week.days[0].date} className="calendar-grid">
          <div style={{ fontSize: 12 }}>{week.weekNumber}</div>

          {week.days.map(day => (
            <div
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={day.inMonth ? "calendar-cell" : "calendar-cell calendar-cell-muted"}
            >
              <div>{day.dayOfMonth}</div>
              {day.eventCount > 0 && (
                <div style={{ fontSize: 12 }}>
                  {day.eventCount} {day.eventCount === 1 ? "event" : "events"}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
