import { type ScheduleAdapter } from "./ScheduleAdapter"
import { type WorkOrder } from "../../domain/WorkOrder"

export class OpasAdapter implements ScheduleAdapter {
  canHandle(data: any): boolean {
    return !!data?.events
  }

  extract(data: any): WorkOrder[] {
    const events = data.events.event || []

    return events.map((e: any): WorkOrder => ({
      id: e.id?.[0] || crypto.randomUUID(),

      title: e.title?.[0] || "Untitled",
      startAt: e.startTime?.[0],

      year: Number(e.year?.[0]),
      month: Number(e.month?.[0]),
      weekNumber: Number(e.weekNumber?.[0]),
      weekday: Number(e.weekday?.[0]),

      durationMinutes: Number(e.duration?.[0]),

      production: e.production?.[0],
      workType: e.workType?.[0],
      department: e.department?.[0],
      venue: e.venue?.[0],

      equipment: e.equipment?.[0]?.item || [],

      source: {
        system: "opas"
      }
    }))
  }
}