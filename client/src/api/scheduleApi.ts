import type { ScheduleApiResponse, ScheduleMeta, WeekApiResponse } from "@scheduler/shared";

const API_BASE = "http://localhost:4000/api";

export async function fetchMeta(): Promise<ScheduleMeta> {
  const response = await fetch(`${API_BASE}/meta`);
  if (!response.ok) {
    throw new Error("Failed to fetch schedule metadata");
  }
  return response.json();
}

export async function fetchEvents(year?: number, month?: number): Promise<ScheduleApiResponse> {
  const params = new URLSearchParams();
  if (typeof year === "number") params.set("year", String(year));
  if (typeof month === "number") params.set("month", String(month));

  const response = await fetch(`${API_BASE}/events?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch schedule events");
  }
  return response.json();
}

export async function fetchWeek(year: number, week: number): Promise<WeekApiResponse> {
  const params = new URLSearchParams({
    year: String(year),
    week: String(week)
  });

  const response = await fetch(`${API_BASE}/week?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weekly schedule");
  }
  return response.json();
}
