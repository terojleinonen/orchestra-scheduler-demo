import { fileURLToPath } from "url"

export const PORT = Number(process.env.PORT) || 4000
export const TIME_ZONE = process.env.SCHEDULE_TZ || "Europe/Helsinki"
export const DATA_FILE = fileURLToPath(new URL("./data/demo-opas.xml", import.meta.url))
