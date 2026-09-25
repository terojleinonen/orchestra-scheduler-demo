import { type WorkOrder } from "../../domain/WorkOrder"

export interface ScheduleAdapter {
  canHandle(data: unknown): boolean
  extract(data: unknown): WorkOrder[]
}
