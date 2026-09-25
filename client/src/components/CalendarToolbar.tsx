import type { ToolbarDto, ViewMode } from "@orchestra/shared"

const VIEWS: ViewMode[] = ["month", "week", "day"]

type Props = {
  toolbar: ToolbarDto
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  onMonthChange: (date: string) => void
  onWeekChange: (date: string) => void
}

export default function CalendarToolbar({
  toolbar,
  view,
  onViewChange,
  onMonthChange,
  onWeekChange
}: Props) {
  return (
    <div className="surface toolbar">
      <select value={toolbar.selectedMonth} onChange={e => onMonthChange(e.target.value)}>
        {toolbar.months.map(m => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <select value={toolbar.selectedWeek} onChange={e => onWeekChange(e.target.value)}>
        {toolbar.weeks.map(w => (
          <option key={w.value} value={w.value}>
            {w.label}
          </option>
        ))}
      </select>

      <div style={{ marginLeft: "auto" }}>
        {VIEWS.map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={v === view ? "btn btn-active" : "btn"}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
