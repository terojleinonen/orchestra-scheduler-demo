import { useEffect, useRef } from "react"
import { useSchedule } from "../hooks/useSchedule"
import { useUrlState } from "../hooks/useUrlState"

import CalendarToolbar from "../components/CalendarToolbar"
import MonthCalendarView from "../components/MonthCalendarView"
import WeekListView from "../components/WeekListView"
import DayDetailView from "../components/DayDetailView"

export default function SchedulePage() {
  const [params, setParams] = useUrlState()
  const { data, loading, error, retry } = useSchedule(params)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const focusHeadingOnLoad = useRef(false)

  // Record the date the server chose so the URL is shareable.
  useEffect(() => {
    if (data && !params.date) setParams({ date: data.date }, { replace: true })
  }, [data, params.date, setParams])

  useEffect(() => {
    if (!data) return
    document.title = `${data.title} – Orchestra Scheduler`

    // When the control the user activated disappears (e.g. a month day), move focus to the new view.
    if (focusHeadingOnLoad.current) {
      focusHeadingOnLoad.current = false
      headingRef.current?.focus()
    }
  }, [data])

  if (!data) {
    return error ? (
      <div className="alert" role="alert">
        <span>{error}</span>
        <button className="btn" onClick={retry}>
          Try again
        </button>
      </div>
    ) : (
      <p className="placeholder" role="status">
        Loading schedule…
      </p>
    )
  }

  const { content } = data
  const date = data.date

  return (
    <>
      <CalendarToolbar
        data={data}
        headingRef={headingRef}
        onNavigate={d => setParams({ date: d })}
        onViewChange={view => setParams({ view, date })}
        onWeekChange={d => setParams({ date: d, view: "week" })}
        onDepartmentChange={department => setParams({ department, date })}
      />

      <div className="status-bar">
        <p className="status-bar__count" aria-hidden="true">
          {data.countLabel}
        </p>
        {/* Announces every completed update to screen reader users */}
        <p className="visually-hidden" role="status" aria-live="polite">
          {loading ? (
            "Loading…"
          ) : (
            <>
              <span lang={data.dateLang}>{data.title}</span>, {data.subtitle}: {data.countLabel}.
            </>
          )}
        </p>
        {loading && <p aria-hidden="true">Updating…</p>}
      </div>

      {error && (
        <div className="alert" role="alert" style={{ marginBottom: "1rem" }}>
          <span>{error}</span>
          <button className="btn" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      <div aria-busy={loading}>
        <div className="view">
          {content.view === "month" && (
            <MonthCalendarView
              month={content}
              caption={data.title}
              lang={data.dateLang}
              onSelectDate={d => {
                focusHeadingOnLoad.current = true
                setParams({ date: d, view: "day" })
              }}
            />
          )}

          {content.view === "week" && <WeekListView week={content} lang={data.dateLang} />}

          {content.view === "day" && <DayDetailView day={content} lang={data.dateLang} />}
        </div>
      </div>
    </>
  )
}
