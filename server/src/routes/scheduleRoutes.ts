import express from "express"
import type { ViewMode } from "@orchestra/shared"
import { getAllWorkOrders } from "../repositories/scheduleRepository"
import { buildSchedule, defaultDate } from "../services/scheduleService"
import { isDateKey } from "../services/calendar"

const VIEWS: ViewMode[] = ["month", "week", "day"]

const router = express.Router()

// GET /api/schedule?view=week&date=2026-03-20
router.get("/", async (req, res) => {
  const view = String(req.query.view ?? "week") as ViewMode
  const date = req.query.date === undefined ? undefined : String(req.query.date)

  if (!VIEWS.includes(view)) {
    res.status(400).json({ error: `view must be one of: ${VIEWS.join(", ")}` })
    return
  }

  if (date !== undefined && !isDateKey(date)) {
    res.status(400).json({ error: "date must be YYYY-MM-DD" })
    return
  }

  const items = await getAllWorkOrders()

  res.json(buildSchedule(items, view, date ?? defaultDate(items)))
})

export default router
