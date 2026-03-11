import { XMLParser } from "fast-xml-parser";

export function parseRawXml(xml: string): unknown {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true
  });

  return parser.parse(xml);
}
