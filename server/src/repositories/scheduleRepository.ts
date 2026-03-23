import { type WorkOrder } from "../domain/WorkOrder"
import { FileXmlSource } from "../infrastructure/sources/fileXmlSource"
import { parseXml } from "../infrastructure/xml/xmlParser"
import { OpasAdapter } from "../infrastructure/adapters/opasAdapter"

const source = new FileXmlSource("src/data/demo-opas.xml")
const adapter = new OpasAdapter()

let cache: WorkOrder[] | null = null

export async function getAllWorkOrders(): Promise<WorkOrder[]> {
  if (cache) return cache

  const xml = await source.read()
  const parsed = await parseXml(xml)

  if (!adapter.canHandle(parsed)) {
    throw new Error("No adapter found for XML")
  }

  const result = adapter.extract(parsed)

  cache = result
  return result
}

export function clearCache() {
  cache = null
}