import { Router } from "express"

import {
  listEvents,
  eventsByMonth
} from "../controllers/eventController"

const router = Router()

router.get("/events", listEvents)

router.get("/events/month", eventsByMonth)

export default router
