// Finnish display texts. OPAS codes (departments, work types) stay English in the data.

import type { ViewMode } from "@orchestra/shared"

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

const DEPARTMENTS: Record<string, string> = {
  orchestra: "Orkesteri",
  choir: "Kuoro",
  stage: "Näyttämö",
  lighting: "Valaistus",
  sound: "Ääni",
  library: "Nuotisto",
  production: "Tuotanto"
}

const WORK_TYPES: Record<string, string> = {
  rehearsal: "Harjoitus",
  sectional: "Stemmaharjoitus",
  "dress rehearsal": "Kenraaliharjoitus",
  concert: "Konsertti",
  "choir rehearsal": "Kuoroharjoitus",
  setup: "Rakennus",
  "lighting focus": "Valojen suuntaus",
  "sound check": "Äänitarkistus",
  "load-out": "Purku",
  "front of house": "Yleisöpalvelu",
  recording: "Äänitys",
  workshop: "Työpaja",
  travel: "Matka",
  maintenance: "Huolto",
  meeting: "Palaveri",
  "crew call": "Näyttämötyövuoro",
  library: "Nuotistotyö"
}

export const departmentLabel = (key: string) => DEPARTMENTS[key] ?? capitalize(key)
export const workTypeLabel = (key: string) => WORK_TYPES[key] ?? capitalize(key)

export const UNTITLED = "Nimetön"

// "1 tapahtuma", "5 tapahtumaa"
export const formatCount = (n: number) => `${n} ${n === 1 ? "tapahtuma" : "tapahtumaa"}`

// Finnish abbreviations: "2 t 30 min"
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h && `${h} t`, m && `${m} min`].filter(Boolean).join(" ") || "0 min"
}

export const weekLabel = (week: number) => `Viikko ${week}`
export const weeksLabel = (from: number, to: number) => `Viikot ${from}–${to}`

const UNITS: Record<ViewMode, string> = { month: "kuukausi", week: "viikko", day: "päivä" }

export const previousLabel = (view: ViewMode) => `Edellinen ${UNITS[view]}`
export const nextLabel = (view: ViewMode) => `Seuraava ${UNITS[view]}`
