import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

type EventType = "rehearsal" | "concert" | "setup"

function getISOWeek(date: Date): number {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  return Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getWeekdayISO(date: Date): number {
  const d = date.getDay()
  return d === 0 ? 7 : d // convert Sun=0 → 7
}

function createEventXML(date: Date, type: EventType): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const weekNumber = getISOWeek(date)
  const weekday = getWeekdayISO(date)

  const start = new Date(date)

  if (type === "rehearsal") start.setHours(10, 0, 0)
  if (type === "concert") start.setHours(19, 0, 0)
  if (type === "setup") start.setHours(8, 0, 0)

  const duration =
    type === "rehearsal" ? 180 :
    type === "concert" ? 120 :
    120

  const equipmentMap: Record<EventType, string[]> = {
    rehearsal: ["chairs", "music stands"],
    concert: ["lighting rig", "microphones", "chairs"],
    setup: ["stage platforms", "cables", "lights"]
  }

  return `
  <event>
    <id>${Math.random().toString(36).slice(2)}</id>

    <year>${year}</year>
    <month>${month}</month>
    <weekNumber>${weekNumber}</weekNumber>
    <weekday>${weekday}</weekday>

    <startTime>${start.toISOString()}</startTime>
    <duration>${duration}</duration>

    <production>Mahler Symphony No.5</production>
    <workType>${type}</workType>
    <department>${type === "concert" ? "orchestra" : "technical"}</department>

    <venue>Main Hall</venue>

    <equipment>
      ${equipmentMap[type].map(e => `<item>${e}</item>`).join("")}
    </equipment>
  </event>`
}

function generateWeek(startDate: Date): string[] {
  const events: string[] = []

  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate)
    day.setDate(day.getDate() + i)

    const weekday = getWeekdayISO(day)

    // 🎻 rehearsal block
    if (weekday >= 1 && weekday <= 3) {
      events.push(createEventXML(day, "rehearsal"))
    }

    // 🔧 setup before concerts
    if (weekday === 4) {
      events.push(createEventXML(day, "setup"))
      events.push(createEventXML(day, "rehearsal"))
    }

    // 🎶 concerts
    if (weekday >= 5 && weekday <= 6) {
      events.push(createEventXML(day, "concert"))
    }
  }

  return events
}

export function generateFakeOpasXml(
  startDate: Date,
  weeks: number
): string {
  let xml = `<events>`

  for (let w = 0; w < weeks; w++) {
    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + w * 7)

    const weekEvents = generateWeek(weekStart)
    xml += weekEvents.join("\n")
  }

  xml += `</events>`

  return xml
}

// 👉 Run script
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const xml = generateFakeOpasXml(new Date(), 12)

  const filePath = path.join(__dirname, "../server/src/data/demo-opas.xml")

  fs.writeFileSync(filePath, xml)

  console.log("✅ Fake OPAS XML generated:", filePath)
}

if (process.argv[1] === __filename) {
  main()
}