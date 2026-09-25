import type { MonthViewDto } from "@orchestra/shared"
import { departmentColor } from "../utils/departmentTheme"

type Props = {
  month: MonthViewDto
  caption: string
  onSelectDate: (date: string) => void
}

const plural = (n: number) => `${n} ${n === 1 ? "event" : "events"}`

export default function MonthCalendarView({ month, caption, onSelectDate }: Props) {
  const departments = [...new Set(month.weeks.flatMap(w => w.days.flatMap(d => d.departments)))].sort()

  return (
    <div className="card month">
      <table>
        <caption className="visually-hidden">
          {caption}. Select a day to open its schedule.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="month__week">
              <abbr title="Week number">Wk</abbr>
            </th>
            {month.weekdays.map(d => (
              <th key={d.long} scope="col">
                <abbr title={d.long}>{d.short}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {month.weeks.map(week => (
            <tr key={week.days[0].date}>
              <th scope="row" className="month__week">
                <span className="visually-hidden">Week </span>
                {week.weekNumber}
              </th>

              {week.days.map(day => (
                <td key={day.date}>
                  <button
                    className={[
                      "day-cell",
                      !day.inMonth && "day-cell--outside",
                      day.isToday && "day-cell--today"
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={`${day.label}${day.isToday ? ", today" : ""}, ${plural(day.eventCount)}`}
                    aria-current={day.isToday ? "date" : undefined}
                    onClick={() => onSelectDate(day.date)}
                  >
                    <span className="day-cell__number">{day.dayOfMonth}</span>
                    {day.eventCount > 0 && (
                      <span className="day-cell__count">
                        {day.eventCount}
                        <span className="day-cell__count-word"> {day.eventCount === 1 ? "event" : "events"}</span>
                      </span>
                    )}
                    <span className="day-cell__dots">
                      {day.departments.map(d => (
                        <span key={d} className="dot" style={{ background: departmentColor(d) }} />
                      ))}
                    </span>
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {departments.length > 0 && (
        <ul className="legend" aria-label="Department colours">
          {departments.map(d => (
            <li key={d}>
              <span className="dot" style={{ background: departmentColor(d) }} aria-hidden="true" />
              <span style={{ textTransform: "capitalize" }}>{d}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
