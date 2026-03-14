import { FixedSizeList } from "react-window"
import { type ScheduleEvent } from "../api/scheduleApi"

interface Props {
  events: ScheduleEvent[]
}

function formatTime(dateString: string) {
  const d = new Date(dateString)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function Row({ index, style, data }: any) {

  const event: ScheduleEvent = data[index]

  return (
    <div style={style} className="agendaItem">

      <div className="agendaTime">
        {formatTime(event.start)}
      </div>

      <div className="agendaContent">

        <div className="agendaTitle">
          {event.title}
        </div>

        {event.venue && (
          <div className="agendaMeta">
            {event.venue}
          </div>
        )}

      </div>

    </div>
  )

}

export default function AgendaView({ events }: Props) {

  const sorted = [...events].sort(
    (a,b)=>new Date(a.start).getTime()-new Date(b.start).getTime()
  )

  return (

    <FixedSizeList
      height={600}
      width="100%"
      itemCount={sorted.length}
      itemSize={70}
      itemData={sorted}
    >
      {Row}
    </FixedSizeList>

  )

}
