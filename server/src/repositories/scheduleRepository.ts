import fs from "fs"
import path from "path"
import { XMLParser } from "fast-xml-parser"

import { convertOpasXmlToEvents, type ScheduleEvent } from "../adapter/opasAdapter"

const XML_PATH = path.join(
    process.cwd(),
    "src",
    "data",
    "demo-opas.xml"
)

let cachedEvents: ScheduleEvent[] = []

export function loadEvents(): ScheduleEvent[] {

  if (cachedEvents.length) {
    return cachedEvents
  }

  const xml = fs.readFileSync(XML_PATH, "utf8")

  const parser = new XMLParser({
    ignoreAttributes: false
  })

  const parsed = parser.parse(xml)

  cachedEvents = convertOpasXmlToEvents(parsed)

  return cachedEvents

}
