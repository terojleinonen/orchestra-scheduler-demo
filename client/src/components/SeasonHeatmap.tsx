import { type ScheduleEvent } from "../api/scheduleApi"

interface Props {
  events: ScheduleEvent[]
}

function getWeekNumber(date: Date) {

  const firstDay = new Date(date.getFullYear(),0,1)

  const pastDays =
    (date.getTime() - firstDay.getTime()) / 86400000

  return Math.ceil((pastDays + firstDay.getDay()+1) / 7)

}

export default function SeasonHeatmap({ events }: Props) {

  const weeks: Record<number, number> = {}

  events.forEach(e => {

    const d = new Date(e.start)

    const week = getWeekNumber(d)

    if (!weeks[week]) weeks[week] = 0

    weeks[week]++

  })

  const weekNumbers = Object.keys(weeks)
    .map(Number)
    .sort((a,b)=>a-b)

  return (

    <div className="seasonHeatmap">

      <h2>Season Activity</h2>

      <div className="heatmapGrid">

        {weekNumbers.map(week => {

          const count = weeks[week]

          const intensity =
            Math.min(count / 10, 1)

          const color =
            `rgba(37,99,235,${intensity})`

          return (

            <div
              key={week}
              className="heatCell"
              style={{ background: color }}
              title={`Week ${week}: ${count} services`}
            />

          )

        })}

      </div>

    </div>

  )

}
