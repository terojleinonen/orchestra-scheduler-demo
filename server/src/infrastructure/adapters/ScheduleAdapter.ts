import { type WorkOrder } from "../../domain/WorkOrder"

export interface ScheduleAdapter<T = any> {
  canHandle(data: T): boolean
  extract(data: T): WorkOrder[]
}