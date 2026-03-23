import express from "express"
import cors from "cors"

import eventRoutes from "./routes/eventRoutes"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/events", eventRoutes)

app.listen(4000, () => {

  console.log("Scheduler API running on port 4000")

})