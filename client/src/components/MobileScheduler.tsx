import { type ScheduleEvent } from "../api/scheduleApi"
import { useScheduler } from "../context/SchedulerContext"

interface Props {
  events: ScheduleEvent[]
}

function formatDate(date: Date) {

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  })

}

function formatTime(date: Date) {

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })

}

export default function MobileScheduler({ events }: Props) {

  const { setSelectedEvent } = useScheduler()

  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.start).getTime() -
      new Date(b.start).getTime()
  )

  let lastDate = ""

  return (

    <div className="mobileScheduler">

      {sorted.map(event => {

        const start = new Date(event.start)

        const dateLabel = formatDate(start)

        const showHeader = dateLabel !== lastDate

        lastDate = dateLabel

        return (

          <div key={event.id}>

            {showHeader && (

              <div className="mobileDate">
                {dateLabel}
              </div>

            )}

            <div
              className="mobileEvent"
              onClick={() => setSelectedEvent(event)}
            >

              <div className="mobileTime">
                {formatTime(start)}
              </div>

              <div className="mobileContent">

                <div className="mobileTitle">
                  {event.title}
                </div>

                {event.venue && (

                  <div className="mobileMeta">
                    {event.venue}
                  </div>

                )}

                {event.conductor && (

                  <div className="mobileMeta">
                    Conductor: {event.conductor}
                  </div>

                )}

              </div>

            </div>

          </div>

        )

      })}

    </div>

  )

}