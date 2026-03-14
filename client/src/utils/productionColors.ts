const palette = [
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#059669",
  "#db2777",
  "#0ea5e9"
]

const colorMap: Record<string,string> = {}

export function getProductionColor(name?: string) {

  if (!name) return "#475569"

  if (!colorMap[name]) {
    const index = Object.keys(colorMap).length % palette.length
    colorMap[name] = palette[index]
  }

  return colorMap[name]

}