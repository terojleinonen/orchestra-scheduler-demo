import { type Request, type Response } from "express"

import {
  getEvents,
  getEventsByMonth
} from "../services/scheduleService"

export function listEvents(
  req: Request,
  res: Response
) {

  const events = getEvents()

  res.json(events)

}

export function eventsByMonth(
  req: Request,
  res: Response
) {

  const year = Number(req.query.year)
  const month = Number(req.query.month)

  const events = getEventsByMonth(year, month)

  res.json(events)

}
