import express from "express"
import { getAllWorkOrders } from "../repositories/scheduleRepository"
import { filterWorkOrders } from "../services/scheduleService"

const router = express.Router()

router.get("/", async (req, res) => {
  const year = req.query.year ? Number(req.query.year) : undefined
  const month = req.query.month ? Number(req.query.month) : undefined
  const week = req.query.week ? Number(req.query.week) : undefined

  const data = await getAllWorkOrders()
  const filtered = filterWorkOrders(data, { year, month, week })

  res.json(filtered)
})

export default router