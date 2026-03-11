import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ScheduleApiResponse, ScheduleEvent, WeekApiResponse } from "@scheduler/shared";
import { convertXmlToSchedule } from "../adapter/clientXmlAdapter.js";
import { parseRawXml } from "../parser/rawXmlParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const xmlPath = path.join(__dirname, "..", "data", "schedule.xml");

let cache: ScheduleApiResponse | null = null;

function startOfTodayIsoLocal(): string {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return local.toISOString();
}

function isCurrentOrFuture(event: ScheduleEvent): boolean {
  return event.end >= startOfTodayIsoLocal();
}

export function loadSchedule(): ScheduleApiResponse {
  const xml = fs.readFileSync(xmlPath, "utf8");
  const raw = parseRawXml(xml);
  cache = convertXmlToSchedule(raw);
  return cache;
}

export function getSchedule(): ScheduleApiResponse {
  if (!cache) {
    return loadSchedule();
  }
  return cache;
}

export function getFilteredEvents(filters: {
  year?: number;
  month?: number;
  currentAndFutureOnly?: boolean;
} = {}): ScheduleApiResponse {
  const schedule = getSchedule();
  let events = [...schedule.events];

  if (filters.currentAndFutureOnly !== false) {
    events = events.filter(isCurrentOrFuture);
  }

  if (typeof filters.year === "number" && Number.isFinite(filters.year)) {
    events = events.filter((event) => event.year === filters.year);
  }

  if (typeof filters.month === "number" && Number.isFinite(filters.month)) {
    events = events.filter((event) => event.month === filters.month);
  }

  return {
    meta: schedule.meta,
    events
  };
}

export function getWeek(year: number, week: number): WeekApiResponse {
  const schedule = getSchedule();
  const events = schedule.events.filter(
    (event) => isCurrentOrFuture(event) && event.year === year && event.week === week
  );

  return {
    meta: schedule.meta,
    year,
    week,
    events
  };
}

export function watchSchedule(): void {
  fs.watchFile(xmlPath, { interval: 500 }, () => {
    loadSchedule();
    console.log("Reloaded schedule XML.");
  });
}
