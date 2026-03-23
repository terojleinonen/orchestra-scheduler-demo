import xml2js from "xml2js"

export async function parseXml(xml: string): Promise<any> {
  return xml2js.parseStringPromise(xml)
}