import express from "express"

import { PORT } from "./config"
import scheduleRoutes from "./routes/scheduleRoutes"

const app = express()

app.use("/api/schedule", scheduleRoutes)

app.listen(PORT, () => {
  console.log(`Scheduler API running on port ${PORT}`)
})
