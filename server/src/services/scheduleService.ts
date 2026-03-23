import { type WorkOrder } from "../domain/WorkOrder"

type Query = {
  year?: number
  month?: number
  week?: number
}

export function filterWorkOrders(
  items: WorkOrder[],
  query: Query
) {
  let result = items

  if (query.year) {
    result = result.filter(e => e.year === query.year)
  }

  if (query.month) {
    result = result.filter(e => e.month === query.month)
  }

  if (query.week) {
    result = result.filter(e => e.weekNumber === query.week)
  }

  if (!query.year && !query.month && !query.week) {
    const now = new Date()
    result = result.filter(e => new Date(e.startAt) >= now)
  }

  return result
}