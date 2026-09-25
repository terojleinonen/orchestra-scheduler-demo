import { fileURLToPath } from "url"

export const PORT = Number(process.env.PORT) || 4000
// Dates and times are formatted in this locale; the rest of the UI is English.
export const LOCALE = "fi-FI"
export const DATE_LANG = LOCALE.split("-")[0]
export const TIME_ZONE = process.env.SCHEDULE_TZ || "Europe/Helsinki"
export const DATA_FILE = fileURLToPath(new URL("./data/demo-opas.xml", import.meta.url))
