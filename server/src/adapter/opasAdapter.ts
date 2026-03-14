import { readField } from "../utils/readField"
import { opasMapping } from "../mappings/opasMappings"
import { validateService } from "../validators/opasValidator"

export interface ScheduleEvent {

  id: string
  title: string
  conductor?: string
  venue?: string

  start: string
  end: string

  production?: string
  type?: string

}

function ensureArray<T>(value: T | T[] | undefined): T[] {

  if (!value) return []

  return Array.isArray(value) ? value : [value]

}

function createDateTime(date: string, time: string): Date {

  return new Date(`${date}T${time}`)

}

function addMinutes(date: Date, minutes: number): Date {

  return new Date(date.getTime() + minutes * 60000)

}

export function convertOpasXmlToEvents(parsedXml: any): ScheduleEvent[] {

  const events: ScheduleEvent[] = []

  const productions = ensureArray(
    parsedXml?.opasExport?.season?.productions?.production
  )

  productions.forEach((production: any) => {

    const productionTitle = readField(
      production,
      opasMapping.production.title
    ) || "Production"

    const conductor = readField(
      production,
      opasMapping.production.conductor
    )

    const services = ensureArray(production?.services?.service)

    services.forEach((service: any) => {

      try {

        validateService(service)

        const serviceType = readField(
          service,
          opasMapping.service.type
        ) || "service"

        const date = readField(
          service,
          opasMapping.service.date
        )

        const startTime = readField(
          service,
          opasMapping.service.start
        )

        const durationStr = readField(
          service,
          opasMapping.service.duration
        )

        const venue = readField(
          service,
          opasMapping.service.venue
        )

        const duration = Number(durationStr || 60)

        const startDate = createDateTime(date, startTime)
        const endDate = addMinutes(startDate, duration)

        const event: ScheduleEvent = {

          id: service?.id || `${productionTitle}-${date}-${startTime}`,

          title: `${productionTitle} ${serviceType}`,

          conductor,
          venue,

          production: productionTitle,
          type: serviceType,

          start: startDate.toISOString(),
          end: endDate.toISOString()

        }

        events.push(event)

      } catch (err) {

        console.warn(
          "Skipping invalid service:",
          service
        )

      }

    })

  })

  return events

}