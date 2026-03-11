import { useEffect, useMemo, useState } from "react";
import type { ScheduleEvent, ScheduleMeta } from "@scheduler/shared";
import { fetchEvents, fetchMeta } from "./api/scheduleApi";
import Toolbar from "./components/Toolbar";
import WeekView from "./components/WeekView";
import { getIsoWeek } from "./utils/date";

function getInitialWeek(events: ScheduleEvent[]): { year: number; week: number } | null {
  if (events.length === 0) return null;
  const first = events[0];
  return {
    year: first.year,
    week: first.week || getIsoWeek(first.date)
  };
}

export default function App() {
  const [meta, setMeta] = useState<ScheduleMeta | null>(null);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMeta().then(setMeta).catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setLoading(true);
        setError("");
        const response = await fetchEvents(
          selectedYear === "" ? undefined : selectedYear,
          selectedMonth === "" ? undefined : selectedMonth
        );
        setEvents(response.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schedule");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [selectedYear, selectedMonth]);

  const activeWeek = useMemo(() => getInitialWeek(events), [events]);

  function handleYearChange(value: number | ""): void {
    setSelectedYear(value);
    if (value === "") {
      setSelectedMonth("");
      return;
    }

    if (selectedMonth !== "" && meta) {
      const allowedMonths = meta.availableMonthsByYear[String(value)] ?? [];
      if (!allowedMonths.includes(selectedMonth)) {
        setSelectedMonth("");
      }
    }
  }

  const currentWeekEvents = useMemo(() => {
    if (!activeWeek) return [];
    return events.filter((event) => event.year === activeWeek.year && event.week === activeWeek.week);
  }, [events, activeWeek]);

  return (
    <main className="page-shell">
      <Toolbar
        meta={meta}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={handleYearChange}
        onMonthChange={setSelectedMonth}
        onPrint={() => window.print()}
      />

      {loading && <div className="status-panel">Loading schedule…</div>}
      {error && !loading && <div className="status-panel error">{error}</div>}

      {!loading && !error && (
        <>
          <section className="summary-grid">
            <div className="summary-card">
              <span className="summary-label">Upcoming events</span>
              <strong>{events.length}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Selected year</span>
              <strong>{selectedYear === "" ? "All" : selectedYear}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Selected month</span>
              <strong>{selectedMonth === "" ? "All" : selectedMonth}</strong>
            </div>
          </section>

          {activeWeek ? (
            <WeekView
              events={currentWeekEvents}
              year={activeWeek.year}
              week={activeWeek.week}
            />
          ) : (
            <div className="status-panel">No upcoming events found for the selected filters.</div>
          )}

          <section className="list-section">
            <h2>Upcoming events list</h2>
            <div className="list-table">
              {events.map((event) => (
                <div className="list-row" key={event.id}>
                  <div>
                    <strong>{event.title}</strong>
                    <div className="muted">{event.orchestra}</div>
                  </div>
                  <div>{event.date}</div>
                  <div>
                    {new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                  <div>{event.conductor}</div>
                  <div>{event.equipment}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
