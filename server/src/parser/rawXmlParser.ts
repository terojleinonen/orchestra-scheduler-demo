import fs from "fs"
import sax from "sax"
import { type ScheduleEvent } from "../adapter/opasAdapter"

export async function parseXmlStream(
  filePath: string,
  onService: (service: any) => void
) {

  return new Promise<void>((resolve, reject) => {

    const stream = fs.createReadStream(filePath)

    const parser = sax.createStream(true)

    let currentTag = ""
    let currentService: any = {}

    parser.on("opentag", (node) => {

      currentTag = node.name

      if (node.name === "service") {
        currentService = {}
      }

    })

    parser.on("text", (text) => {

      if (!currentTag) return

      const value = text.trim()

      if (!value) return

      currentService[currentTag] = value

    })

    parser.on("closetag", (tag) => {

      if (tag === "service") {

        onService(currentService)

        currentService = {}

      }

      currentTag = ""

    })

    parser.on("end", () => resolve())

    parser.on("error", err => reject(err))

    stream.pipe(parser)

  })

}
