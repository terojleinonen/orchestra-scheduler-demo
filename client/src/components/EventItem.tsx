import type { CSSProperties } from "react"
import type { EventDto } from "@orchestra/shared"
import { departmentColor } from "../utils/departmentTheme"

type Props = {
  event: EventDto
  headingLevel: 2 | 3
}

export default function EventItem({ event, headingLevel }: Props) {
  const Heading = `h${headingLevel}` as const
  const style = { "--dept-color": departmentColor(event.department) } as CSSProperties

  const details: [string, string | undefined][] = [
    ["Produktio", event.production],
    ["Paikka", event.venue],
    ["Tyyppi", event.workType],
    ["Kapellimestari", event.conductor],
    ["Kalusto", event.equipment.join(", ") || undefined]
  ]

  return (
    <li className="event" style={style}>
      <p className="event__time">
        <time dateTime={event.startAt}>{event.timeRange}</time>
        <span className="event__duration">
          <span className="visually-hidden">Kesto </span>
          {event.duration}
        </span>
      </p>

      <div>
        <div className="event__head">
          <Heading className="event__title">{event.title}</Heading>
          {event.departmentLabel && (
            <span className="badge badge--dept">
              <span className="dot" style={{ background: "var(--dept-color)" }} aria-hidden="true" />
              {event.departmentLabel}
            </span>
          )}
        </div>

        <dl className="event__meta">
          {details
            .filter(([, value]) => value)
            .map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
      </div>
    </li>
  )
}
