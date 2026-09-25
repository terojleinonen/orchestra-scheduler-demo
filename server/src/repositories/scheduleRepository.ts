import { type WorkOrder } from "../domain/WorkOrder"
import { DATA_FILE } from "../config"
import { FileXmlSource } from "../infrastructure/sources/fileXmlSource"
import { parseXml } from "../infrastructure/xml/xmlParser"
import { OpasAdapter } from "../infrastructure/adapters/opasAdapter"

const source = new FileXmlSource(DATA_FILE)
const adapter = new OpasAdapter()

let cache: WorkOrder[] | null = null

// Returns all work orders sorted by start time.
export async function getAllWorkOrders(): Promise<WorkOrder[]> {
  if (cache) return cache

  const xml = await source.read()
  const parsed = await parseXml(xml)

  if (!adapter.canHandle(parsed)) {
    throw new Error("No adapter found for XML")
  }

  cache = adapter
    .extract(parsed)
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))

  return cache
}
