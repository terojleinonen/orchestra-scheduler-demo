import type { ScheduleEvent, ScheduleMeta } from "@scheduler/shared";
import { getIsoWeekNumber } from "../utils/date.js";

type RawNode = Record<string, unknown>;

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parseDurationMinutes(value: unknown): number {
  const parsed = Number(value ?? 60);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
}

function parseCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("concert")) return "concert";
  if (lower.includes("recording")) return "recording";
  if (lower.includes("sectional")) return "sectional";
  if (lower.includes("rehearsal")) return "rehearsal";
  return "general";
}

export function convertXmlToSchedule(raw: unknown): { meta: ScheduleMeta; events: ScheduleEvent[] } {
  const root = raw as {
    orchestra?: {
      "@_name"?: string;
      year?: RawNode | RawNode[];
    };
  };

  const orchestraName = root.orchestra?.["@_name"] ?? "Unknown Orchestra";
  const yearNodes = asArray(root.orchestra?.year as RawNode | RawNode[] | undefined);
  const events: ScheduleEvent[] = [];
  const monthsByYear = new Map<number, Set<number>>();

  for (const yearNode of yearNodes) {
    const year = Number(yearNode["@_value"]);
    const monthNodes = asArray(yearNode.month as RawNode | RawNode[] | undefined);

    for (const monthNode of monthNodes) {
      const month = Number(monthNode["@_value"]);
      const weekNodes = asArray(monthNode.week as RawNode | RawNode[] | undefined);

      if (!monthsByYear.has(year)) {
        monthsByYear.set(year, new Set<number>());
      }
      monthsByYear.get(year)!.add(month);

      for (const weekNode of weekNodes) {
        const explicitWeek = Number(weekNode["@_number"]);
        const dayNodes = asArray(weekNode.day as RawNode | RawNode[] | undefined);

        for (const dayNode of dayNodes) {
          const date = String(dayNode["@_date"] ?? "");
          const weekday = String(dayNode["@_weekday"] ?? "");
          const eventNodes = asArray(dayNode.event as RawNode | RawNode[] | undefined);

          for (const eventNode of eventNodes) {
            const title = String(eventNode["@_name"] ?? "Untitled event");
            const conductor = String(eventNode["@_conductor"] ?? "Unknown conductor");
            const equipment = String(eventNode["@_equipment"] ?? "");
            const time = String(eventNode["@_time"] ?? "00:00");
            const duration = parseDurationMinutes(eventNode["@_duration"]);
            const category = String(eventNode["@_category"] ?? parseCategory(title));
            const start = new Date(`${date}T${time}:00`);
            const end = new Date(start.getTime() + duration * 60_000);
            const week = explicitWeek || getIsoWeekNumber(date);

            events.push({
              id: crypto.randomUUID(),
              orchestra: orchestraName,
              title,
              conductor,
              equipment,
              category,
              start: start.toISOString(),
              end: end.toISOString(),
              year,
              month,
              week,
              date,
              weekday
            });
          }
        }
      }
    }
  }

  const availableYears = Array.from(monthsByYear.keys()).sort((a, b) => a - b);
  const availableMonthsByYear = Object.fromEntries(
    Array.from(monthsByYear.entries()).map(([year, months]) => [
      String(year),
      Array.from(months).sort((a, b) => a - b)
    ])
  );

  events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return {
    meta: {
      orchestra: orchestraName,
      availableYears,
      availableMonthsByYear
    },
    events
  };
}
