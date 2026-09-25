import type { MonthViewDto, NavOption } from "@orchestra/shared"
import { departmentColor } from "../utils/departmentTheme"
import { formatCount } from "../utils/format"

type Props = {
  month: MonthViewDto
  caption: string
  departments: NavOption[] // department keys and names, for the colour legend
  onSelectDate: (date: string) => void
}

export default function MonthCalendarView({ month, caption, departments, onSelectDate }: Props) {
  const present = new Set(month.weeks.flatMap(w => w.days.flatMap(d => d.departments)))
  const legend = departments.filter(d => present.has(d.value))

  return (
    <div className="card month">
      <table>
        <caption className="visually-hidden">
          {caption}. Valitse päivä nähdäksesi sen aikataulun.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="month__week">
              <abbr title="Viikkonumero">Vk</abbr>
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
                <span className="visually-hidden">Viikko </span>
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
                    aria-current={day.isToday ? "date" : undefined}
                    onClick={() => onSelectDate(day.date)}
                  >
                    <span className="day-cell__number" aria-hidden="true">
                      {day.dayOfMonth}
                    </span>
                    <span className="visually-hidden">
                      {day.label}
                      {day.isToday ? ", tänään" : ""}, {formatCount(day.eventCount)}
                    </span>
                    {day.eventCount > 0 && (
                      <span className="day-cell__count" aria-hidden="true">
                        {day.eventCount}
                        <span className="day-cell__count-word"> {day.eventCount === 1 ? "tapahtuma" : "tapahtumaa"}</span>
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

      {legend.length > 0 && (
        <ul className="legend" aria-label="Osastojen värit">
          {legend.map(d => (
            <li key={d.value}>
              <span className="dot" style={{ background: departmentColor(d.value) }} aria-hidden="true" />
              {d.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
