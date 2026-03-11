import type { ScheduleMeta } from "@scheduler/shared";

interface ToolbarProps {
  meta: ScheduleMeta | null;
  selectedYear: number | "";
  selectedMonth: number | "";
  onYearChange: (value: number | "") => void;
  onMonthChange: (value: number | "") => void;
  onPrint: () => void;
}

const monthNames = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

export default function Toolbar({
  meta,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onPrint
}: ToolbarProps) {
  const availableMonths =
    selectedYear && meta ? meta.availableMonthsByYear[String(selectedYear)] ?? [] : [];

  return (
    <div className="toolbar">
      <div>
        <div className="app-title">{meta?.orchestra ?? "Orchestra Scheduler"}</div>
        <div className="app-subtitle">Upcoming schedule demo from XML source</div>
      </div>

      <div className="toolbar-controls">
        <label>
          <span>Year</span>
          <select
            value={selectedYear}
            onChange={(event) =>
              onYearChange(event.target.value ? Number(event.target.value) : "")
            }
          >
            <option value="">All</option>
            {meta?.availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Month</span>
          <select
            value={selectedMonth}
            onChange={(event) =>
              onMonthChange(event.target.value ? Number(event.target.value) : "")
            }
          >
            <option value="">All</option>
            {monthNames
              .filter((month) => !selectedYear || availableMonths.includes(month.value))
              .map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
          </select>
        </label>

        <button type="button" onClick={onPrint} className="print-button">
          Print Weekly Schedule
        </button>
      </div>
    </div>
  );
}
