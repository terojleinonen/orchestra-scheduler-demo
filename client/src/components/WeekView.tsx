import type { ScheduleEvent } from "@scheduler/shared";
import { layoutEvents } from "../utils/layoutEvents";
import { formatShortDate, formatTime, toMinutes } from "../utils/date";

const DAYS = [1, 2, 3, 4, 5, 6, 0]; // Mon -> Sun
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const START_HOUR = 7;
const END_HOUR = 23;
const PX_PER_MINUTE = 1.1;

function dayIndex(dateIso: string): number {
  return new Date(`${dateIso}T00:00:00`).getDay();
}

interface WeekViewProps {
  events: ScheduleEvent[];
  year: number;
  week: number;
}

export default function WeekView({ events, year, week }: WeekViewProps) {
  const grouped = new Map<number, ScheduleEvent[]>();
  DAYS.forEach((day) => grouped.set(day, []));
  events.forEach((event) => {
    const key = dayIndex(event.date);
    grouped.set(key, [...(grouped.get(key) ?? []), event]);
  });

  const timelineHeight = (END_HOUR - START_HOUR) * 60 * PX_PER_MINUTE;

  return (
    <section className="week-view">
      <div className="week-heading">
        <h2>
          Week {week}, {year}
        </h2>
        <p>{events.length} events in current filtered week</p>
      </div>

      <div className="scheduler">
        <div className="time-column">
          <div className="corner-cell" />
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index).map(
            (hour) => (
              <div key={hour} className="time-cell" style={{ height: `${60 * PX_PER_MINUTE}px` }}>
                {String(hour).padStart(2, "0")}:00
              </div>
            )
          )}
        </div>

        <div className="days-grid">
          {DAYS.map((day, columnIndex) => {
            const dayEvents = grouped.get(day) ?? [];
            const laidOut = layoutEvents(dayEvents);
            const label = DAY_LABELS[columnIndex];
            const headerDate = dayEvents[0]?.date;

            return (
              <div key={day} className="day-column">
                <div className="day-header">
                  <div className="day-label">{label}</div>
                  <div className="day-date">{headerDate ? formatShortDate(headerDate) : "—"}</div>
                </div>

                <div className="day-timeline" style={{ height: `${timelineHeight}px` }}>
                  {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index).map(
                    (hour) => {
                      const top = (hour - START_HOUR) * 60 * PX_PER_MINUTE;
                      return <div key={hour} className="hour-line" style={{ top: `${top}px` }} />;
                    }
                  )}

                  {laidOut.map((event) => {
                    const top = (toMinutes(event.start) - START_HOUR * 60) * PX_PER_MINUTE;
                    const height = Math.max(
                      (toMinutes(event.end) - toMinutes(event.start)) * PX_PER_MINUTE,
                      34
                    );
                    const width = 100 / event.laneCount;
                    const left = event.lane * width;

                    return (
                      <article
                        key={event.id}
                        className={`event-card category-${event.category}`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          width: `calc(${width}% - 6px)`,
                          left: `${left}%`
                        }}
                        title={`${event.title}\n${formatTime(event.start)}–${formatTime(
                          event.end
                        )}\n${event.equipment}`}
                      >
                        <div className="event-time">
                          {formatTime(event.start)}–{formatTime(event.end)}
                        </div>
                        <div className="event-title">{event.title}</div>
                        <div className="event-meta">{event.conductor}</div>
                        <div className="event-meta equipment">{event.equipment}</div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
