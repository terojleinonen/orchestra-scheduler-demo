import { useId, type RefObject } from "react"
import type { NavOption, ScheduleResponse, ViewMode } from "@orchestra/shared"

const VIEWS: ViewMode[] = ["month", "week", "day"]

type Props = {
  data: ScheduleResponse
  headingRef: RefObject<HTMLHeadingElement | null>
  onNavigate: (date: string) => void
  onViewChange: (view: ViewMode) => void
  onWeekChange: (date: string) => void
  onDepartmentChange: (department: string) => void
}

function Select({
  label,
  value,
  options,
  onChange,
  allLabel,
  optionLang
}: {
  label: string
  value: string
  options: NavOption[]
  onChange: (value: string) => void
  allLabel?: string
  optionLang?: string
}) {
  const id = useId()

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={e => onChange(e.target.value)}>
        {allLabel !== undefined && <option value="">{allLabel}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value} lang={optionLang}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function CalendarToolbar({
  data,
  headingRef,
  onNavigate,
  onViewChange,
  onWeekChange,
  onDepartmentChange
}: Props) {
  const { toolbar, view } = data

  return (
    <section className="card toolbar" aria-labelledby="view-title">
      <div className="toolbar__row">
        <nav className="toolbar__nav" aria-label="Date navigation">
          <button className="btn" onClick={() => onNavigate(toolbar.previous.value)} aria-label={toolbar.previous.label}>
            <span aria-hidden="true">←</span>
            <span className="toolbar__nav-label">Previous</span>
          </button>
          <button className="btn" onClick={() => onNavigate(toolbar.today)}>
            Today
          </button>
          <button className="btn" onClick={() => onNavigate(toolbar.next.value)} aria-label={toolbar.next.label}>
            <span className="toolbar__nav-label">Next</span>
            <span aria-hidden="true">→</span>
          </button>
        </nav>

        <div className="toolbar__heading">
          <h1 id="view-title" className="toolbar__title" ref={headingRef} tabIndex={-1} lang={data.dateLang}>
            {data.title}
          </h1>
          <p className="toolbar__subtitle">{data.subtitle}</p>
        </div>

        <div className="segmented" role="group" aria-label="View">
          {VIEWS.map(v => (
            <button key={v} className="btn" aria-pressed={v === view} onClick={() => onViewChange(v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar__filters" role="group" aria-label="Filters">
        <Select label="Year" value={toolbar.selectedYear} options={toolbar.years} onChange={onNavigate} />
        <Select
          label="Month"
          value={toolbar.selectedMonth}
          options={toolbar.months}
          onChange={onNavigate}
          optionLang={data.dateLang}
        />
        <Select label="Week" value={toolbar.selectedWeek} options={toolbar.weeks} onChange={onWeekChange} />
        <Select
          label="Department"
          value={data.department}
          options={toolbar.departments}
          onChange={onDepartmentChange}
          allLabel="All departments"
        />

        <button className="btn" onClick={() => window.print()}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M6 14h12v8H6z" />
          </svg>
          Print
        </button>
      </div>
    </section>
  )
}
