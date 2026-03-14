import { type ScheduleEvent } from "../api/scheduleApi"
import EventCard from "./EventCard"

interface Props {
  events: ScheduleEvent[]
}

export default function ResourceScheduler({ events }: Props) {

  const venues = Array.from(
    new Set(events.map(e => e.venue || "Unknown"))
  )

  return (

    <div className="resourceScheduler">

      {venues.map(venue => {

        const venueEvents = events.filter(
          e => (e.venue || "Unknown") === venue
        )

        return (

          <div key={venue} className="resourceRow">

            <div className="resourceLabel">
              {venue}
            </div>

            <div className="resourceTimeline">

              {venueEvents.map(event => (

                <EventCard
                  key={event.id}
                  event={event}
                />

              ))}

            </div>

          </div>

        )

      })}

    </div>

  )

}
