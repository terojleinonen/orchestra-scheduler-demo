import { type ScheduleAdapter } from "./ScheduleAdapter"
import { type WorkOrder } from "../../domain/WorkOrder"

function capitalize(s?: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : undefined
}

export class OpasAdapter implements ScheduleAdapter {
  canHandle(data: any): boolean {
    return !!data?.events
  }

  extract(data: any): WorkOrder[] {
    const events = data.events.event || []

    return events.map((e: any): WorkOrder => ({
      id: e.id?.[0] || crypto.randomUUID(),

      title: e.title?.[0] || capitalize(e.workType?.[0]) || "Untitled",
      startAt: e.startTime?.[0],
      durationMinutes: Number(e.duration?.[0]) || 0,

      production: e.production?.[0],
      workType: e.workType?.[0],
      department: e.department?.[0],
      venue: e.venue?.[0],
      conductor: e.conductor?.[0],

      equipment: e.equipment?.[0]?.item || []
    }))
  }
}
