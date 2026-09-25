// Generates a realistic fake OPAS XML export for an orchestra (texts in Finnish,
// department and work type codes in English as in OPAS):
// programme weeks with rehearsals, sectionals, dress rehearsals, concerts, choir calls,
// technical crew calls (stage / lighting / sound), front of house, education work,
// tours, recordings and a lighter summer season.
//
// Usage:
//   npm run generate:xml -- [--from 2025-08-01] [--months 24] [--seed 42] [--out path]

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// ==============================
// CLI options
// ==============================

function arg(name: string, fallback: string) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const FROM = arg("from", `${new Date().getFullYear() - 1}-08-01`)
const MONTHS = Number(arg("months", "24"))
const SEED = Number(arg("seed", "42"))
const OUT = arg("out", path.join(__dirname, "../server/src/data/demo-opas.xml"))
const TIME_ZONE = "Europe/Helsinki"

// ==============================
// Seeded random
// ==============================

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(SEED)
const chance = (p: number) => random() < p
const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)]

// ==============================
// Dates (all wall-clock times are Helsinki local time)
// ==============================

type Day = { y: number; m: number; d: number } // m = 1–12

const dayToUtc = (day: Day) => new Date(Date.UTC(day.y, day.m - 1, day.d))
const utcToDay = (d: Date): Day => ({ y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() })
const addDays = (day: Day, n: number) => utcToDay(new Date(dayToUtc(day).getTime() + n * 86_400_000))
const isoWeekday = (day: Day) => dayToUtc(day).getUTCDay() || 7

function isoWeek(day: Day) {
  const thursday = dayToUtc(addDays(day, 4 - isoWeekday(day)))
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1)
  return Math.ceil(((thursday.getTime() - yearStart) / 86_400_000 + 1) / 7)
}

const offsetFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  timeZoneName: "longOffset"
})

// Offset of the time zone at the given instant in minutes, e.g. +180 for GMT+03:00
function zoneOffsetMinutes(instant: Date) {
  const name = offsetFormat.formatToParts(instant).find(p => p.type === "timeZoneName")!.value
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name)
  if (!match) return 0
  const minutes = Number(match[2]) * 60 + Number(match[3])
  return match[1] === "-" ? -minutes : minutes
}

// Helsinki local wall-clock time → UTC instant (handles daylight saving time)
function localToInstant(day: Day, hour: number, minute: number) {
  const guess = Date.UTC(day.y, day.m - 1, day.d, hour, minute)
  const offset = zoneOffsetMinutes(new Date(guess - 2 * 3_600_000))
  return new Date(guess - offset * 60_000)
}

// ==============================
// Domain data
// ==============================

type Department = "orchestra" | "choir" | "stage" | "lighting" | "sound" | "library" | "production"

type Programme = {
  name: string
  conductor: string
  choir?: boolean
  soloist?: string
  family?: boolean
}

const PROGRAMMES: Programme[] = [
  { name: "Mahler: Sinfonia nro 5", conductor: "Susanna Mälkki" },
  { name: "Sibelius: Kullervo", conductor: "Hannu Lintu", choir: true },
  { name: "Beethoven: Sinfonia nro 9", conductor: "Esa-Pekka Salonen", choir: true },
  { name: "Brahms: Saksalainen requiem", conductor: "Dalia Stasevska", choir: true },
  { name: "Sibelius: Sinfoniat 5 ja 7", conductor: "Klaus Mäkelä" },
  { name: "Tšaikovski: Viulukonsertto", conductor: "Santtu-Matias Rouvali", soloist: "Elina Vähälä" },
  { name: "Rahmaninov: Pianokonsertto nro 3", conductor: "Jukka-Pekka Saraste", soloist: "Olli Mustonen" },
  { name: "Šostakovitš: Sinfonia nro 7", conductor: "Hannu Lintu" },
  { name: "Mozart: Requiem", conductor: "Eva Ollikainen", choir: true },
  { name: "Stravinsky: Kevätuhri", conductor: "Klaus Mäkelä" },
  { name: "Dvořák: Sinfonia nro 9", conductor: "Dalia Stasevska" },
  { name: "Saariaho: Orion ja Debussy: Meri", conductor: "Susanna Mälkki" },
  { name: "Bruckner: Sinfonia nro 7", conductor: "Jukka-Pekka Saraste" },
  { name: "Verdi: Messa da Requiem", conductor: "Esa-Pekka Salonen", choir: true },
  { name: "Ravel: Daphnis ja Chloé", conductor: "Santtu-Matias Rouvali", choir: true },
  { name: "Elgar: Sellokonsertto", conductor: "Eva Ollikainen", soloist: "Senja Rummukainen" },
  { name: "Holst: Planeetat", conductor: "Dalia Stasevska", choir: true },
  { name: "Bartók: Konsertto orkesterille", conductor: "Hannu Lintu" },
  { name: "Perhekonsertti: Pekka ja susi", conductor: "Eva Ollikainen", family: true },
  { name: "Perhekonsertti: Lumiukko", conductor: "Dalia Stasevska", family: true },
  { name: "Elokuvailta: John Williamsin musiikkia", conductor: "Santtu-Matias Rouvali" },
  { name: "Rautavaara: Cantus Arcticus", conductor: "Susanna Mälkki" }
]

const GALAS: Record<string, Programme> = {
  "12": { name: "Joulukonsertti", conductor: "Dalia Stasevska", choir: true, family: true },
  "1": { name: "Uudenvuoden gaala", conductor: "Klaus Mäkelä", soloist: "Karita Mattila" }
}

const SUMMER_PROGRAMMES: Programme[] = [
  { name: "Kesäfestivaali: Klassikot ulkoilmassa", conductor: "Santtu-Matias Rouvali" },
  { name: "Kesäfestivaali: Kamariserenadeja", conductor: "Eva Ollikainen" }
]

const TOUR_VENUES = ["Tampere-talo", "Turun konserttitalo", "Sibeliustalo, Lahti", "Oulun musiikkikeskus"]
const SECTIONS = ["Jouset", "Puupuhaltimet", "Vaskipuhaltimet", "Lyömäsoittimet"]
const CHAMBER = ["Jousikvartettimatinea", "Puhallinkvintettikonsertti", "Vaskiyhtye", "Pianotrioiltapäivä"]

const EQUIPMENT: Record<string, string[]> = {
  rehearsal: ["tuolit", "nuottitelineet", "telinevalot"],
  sectional: ["tuolit", "nuottitelineet"],
  "dress rehearsal": ["tuolit", "nuottitelineet", "korokkeet", "konserttivalaistus"],
  concert: ["tuolit", "nuottitelineet", "korokkeet", "konserttivalaistus", "mikrofonit"],
  "choir rehearsal": ["kuorokorokkeet", "piano"],
  setup: ["lavaelementit", "korokkeet", "kaapelit"],
  "lighting focus": ["valorigi", "henkilönostin"],
  "sound check": ["mikrofonit", "mikseri", "monitorit"],
  "load-out": ["kuljetuslaatikot", "kuorma-auto"],
  "front of house": ["lipunlukijat", "käsiohjelmat"],
  recording: ["mikrofonit", "äänityspöytä", "kuulokkeet"],
  workshop: ["tuolit", "lyömäsoittimet"],
  travel: ["linja-auto", "soitinkuljetus"],
  maintenance: ["työkalut"],
  meeting: ["projektori"],
  "crew call": ["tuolit", "nuottitelineet", "telinevalot"],
  library: ["partituurit", "orkesteristemmat"]
}

// ==============================
// Event building
// ==============================

type EventSpec = {
  day: Day
  start: [number, number]
  minutes: number
  title: string
  workType: string
  department: Department
  venue: string
  production?: string
  conductor?: string
}

const events: EventSpec[] = []

function add(spec: EventSpec) {
  events.push(spec)
}

function planProgrammeWeek(monday: Day, programme: Programme) {
  const on = (weekday: number) => addDays(monday, weekday - 1)
  const production = programme.name
  const conductor = programme.conductor
  const touring = !programme.family && chance(0.08)
  const concertVenue = touring ? pick(TOUR_VENUES) : "Pääsali"
  const concertDays = programme.family ? [6] : chance(0.5) ? [4, 5] : [5, 6]
  const firstConcert = concertDays[0]

  add({ day: on(1), start: [9, 0], minutes: 60, title: "Viikkopalaveri", workType: "meeting", department: "production", venue: "Neuvotteluhuone", production })
  add({ day: on(1), start: [8, 0], minutes: 120, title: `Stemmojen jako — ${production}`, workType: "library", department: "library", venue: "Nuotisto", production })

  for (let weekday = 1; weekday < firstConcert; weekday++) {
    const isDress = weekday === firstConcert - 1
    const rehearsalVenue = isDress ? "Pääsali" : pick(["Harjoitussali A", "Pääsali"])
    add({ day: on(weekday), start: [9, 15], minutes: 45, title: "Näyttämötyövuoro — istumajärjestys", workType: "crew call", department: "stage", venue: rehearsalVenue, production })
    add({
      day: on(weekday),
      start: [10, 0],
      minutes: isDress ? 180 : 150,
      title: isDress ? `Kenraaliharjoitus — ${production}` : `Orkesteriharjoitus — ${production}`,
      workType: isDress ? "dress rehearsal" : "rehearsal",
      department: "orchestra",
      venue: rehearsalVenue,
      production,
      conductor
    })

    if (!isDress && chance(0.45)) {
      const section = pick(SECTIONS)
      add({ day: on(weekday), start: [14, 0], minutes: 120, title: `Stemmaharjoitus: ${section.toLowerCase()}`, workType: "sectional", department: "orchestra", venue: "Harjoitussali B", production })
    }

    if (programme.soloist && weekday === firstConcert - 2) {
      add({ day: on(weekday), start: [14, 30], minutes: 90, title: `Solistiharjoitus: ${programme.soloist}`, workType: "rehearsal", department: "orchestra", venue: "Pääsali", production, conductor })
    }

    if (programme.choir) {
      add({ day: on(weekday), start: [18, 0], minutes: 150, title: `Kuoroharjoitus — ${production}`, workType: "choir rehearsal", department: "choir", venue: "Kuorostudio", production })
    }
  }

  // Technical preparation on the day before the first concert
  const techDay = on(Math.max(1, firstConcert - 1))
  add({ day: techDay, start: [7, 30], minutes: 150, title: "Näyttämön ja korokkeiden rakennus", workType: "setup", department: "stage", venue: "Pääsali", production })
  add({ day: techDay, start: [13, 30], minutes: 180, title: "Valojen suuntaus", workType: "lighting focus", department: "lighting", venue: "Pääsali", production })
  add({ day: techDay, start: [16, 30], minutes: 90, title: "Äänitarkistus ja mikrofonien sijoittelu", workType: "sound check", department: "sound", venue: "Pääsali", production })

  if (touring) {
    add({ day: on(firstConcert), start: [8, 0], minutes: 240, title: `Matka: ${concertVenue}`, workType: "travel", department: "production", venue: concertVenue, production })
  }

  for (const weekday of concertDays) {
    const matinee = !!programme.family
    const [h, m]: [number, number] = matinee ? [14, 0] : [19, 0]
    const venue = concertVenue

    add({ day: on(weekday), start: [h - 1, 30], minutes: 30, title: "Lämmittely ja viritys", workType: "rehearsal", department: "orchestra", venue, production })
    add({ day: on(weekday), start: [h - 1, 0], minutes: 180, title: "Yleisöpalvelu", workType: "front of house", department: "production", venue, production })
    add({ day: on(weekday), start: [h - 2, 0], minutes: 60, title: "Valojen esiasetusten tarkistus", workType: "lighting focus", department: "lighting", venue, production })
    add({ day: on(weekday), start: [h - 2, 30], minutes: 60, title: "Linjatarkistus", workType: "sound check", department: "sound", venue, production })
    add({ day: on(weekday), start: [h, m], minutes: matinee ? 75 : 120, title: `Konsertti — ${production}`, workType: "concert", department: "orchestra", venue, production, conductor })
    if (programme.choir) {
      add({ day: on(weekday), start: [h, m], minutes: matinee ? 75 : 120, title: `Kuoro esiintyy — ${production}`, workType: "concert", department: "choir", venue, production, conductor })
    }
  }

  const last = concertDays[concertDays.length - 1]
  add({ day: on(last), start: [matineeEnd(programme), 30], minutes: 120, title: "Purku ja vaihto", workType: "load-out", department: "stage", venue: concertVenue, production })

  add({ day: on(last), start: [13, 0], minutes: 120, title: "Stemmojen keräys ja tarkistus", workType: "library", department: "library", venue: "Nuotisto", production })

  if (chance(0.3)) {
    add({ day: on(last + 1), start: [15, 0], minutes: 60, title: pick(CHAMBER), workType: "concert", department: "orchestra", venue: "Kamarimusiikkisali", production: "Kamarimusiikkisarja" })
  }

  if (chance(0.25)) {
    add({ day: on(firstConcert), start: [10, 0], minutes: 180, title: `Äänitys — ${production}`, workType: "recording", department: "sound", venue: "Pääsali", production })
  }

  if (chance(0.35)) {
    add({ day: on(pick([2, 3])), start: [9, 30], minutes: 90, title: "Koulutyöpaja", workType: "workshop", department: "production", venue: "Lämpiö", production: "Yleisötyö" })
  }

  // Routine technical maintenance on non-concert weekdays
  for (let weekday = 1; weekday <= 5; weekday++) {
    if (concertDays.includes(weekday)) continue
    if (chance(0.5)) {
      add({ day: on(weekday), start: [8, 0], minutes: 60, title: pick(["Pianon viritys", "Näyttämön huolto", "Valojen huolto", "Äänentoiston tarkistus"]), workType: "maintenance", department: pick(["stage", "lighting", "sound"] as const), venue: "Pääsali" })
    }
  }
}

function matineeEnd(programme: Programme) {
  return programme.family ? 15 : 21
}

function planSummerWeek(monday: Day) {
  const on = (weekday: number) => addDays(monday, weekday - 1)
  const programme = pick(SUMMER_PROGRAMMES)
  const production = programme.name

  add({ day: on(2), start: [10, 0], minutes: 150, title: `Orkesteriharjoitus — ${production}`, workType: "rehearsal", department: "orchestra", venue: "Harjoitussali A", production, conductor: programme.conductor })
  add({ day: on(3), start: [9, 0], minutes: 240, title: "Ulkolavan rakennus", workType: "setup", department: "stage", venue: "Puistolava", production })
  add({ day: on(3), start: [15, 0], minutes: 120, title: "Äänitarkistus ja mikrofonien sijoittelu", workType: "sound check", department: "sound", venue: "Puistolava", production })
  add({ day: on(4), start: [19, 0], minutes: 90, title: `Konsertti — ${production}`, workType: "concert", department: "orchestra", venue: "Puistolava", production, conductor: programme.conductor })
  add({ day: on(4), start: [21, 0], minutes: 120, title: "Purku ja vaihto", workType: "load-out", department: "stage", venue: "Puistolava", production })
}

// ==============================
// Season plan
// ==============================

function isHoliday(monday: Day) {
  // Christmas week and the Midsummer / July holiday period
  const sunday = addDays(monday, 6)
  const christmas = monday.m === 12 && monday.d <= 26 && sunday.d >= 24
  const july = monday.m === 7 && monday.d >= 7
  return christmas || july
}

function planWeek(monday: Day) {
  if (isHoliday(monday)) return
  if (monday.m === 6 || monday.m === 7) return planSummerWeek(monday)

  const gala = GALAS[String(monday.m)]
  const isGalaWeek = gala && ((monday.m === 12 && monday.d >= 10 && monday.d <= 16) || (monday.m === 1 && monday.d <= 7))
  planProgrammeWeek(monday, isGalaWeek ? gala : pick(PROGRAMMES))
}

const start: Day = (() => {
  const [y, m, d] = FROM.split("-").map(Number)
  return { y, m, d }
})()
const end = utcToDay(new Date(Date.UTC(start.y, start.m - 1 + MONTHS, start.d)))

let monday = addDays(start, 1 - isoWeekday(start))
while (dayToUtc(monday) < dayToUtc(end)) {
  planWeek(monday)
  monday = addDays(monday, 7)
}

// ==============================
// XML output
// ==============================

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const tag = (name: string, value?: string | number) =>
  value === undefined ? "" : `<${name}>${escapeXml(String(value))}</${name}>`

const inRange = (e: EventSpec) => dayToUtc(e.day) >= dayToUtc(start) && dayToUtc(e.day) < dayToUtc(end)

const rows = events
  .filter(inRange)
  .map(e => ({ ...e, instant: localToInstant(e.day, e.start[0], e.start[1]) }))
  .sort((a, b) => a.instant.getTime() - b.instant.getTime())
  .map((e, i) => {
    const id = `OPAS-${String(i + 1).padStart(6, "0")}`
    const equipment = (EQUIPMENT[e.workType] ?? []).map(item => tag("item", item)).join("")

    return [
      "  <event>",
      `    ${tag("id", id)}${tag("title", e.title)}`,
      `    ${tag("year", e.day.y)}${tag("month", e.day.m)}${tag("weekNumber", isoWeek(e.day))}${tag("weekday", isoWeekday(e.day))}`,
      `    ${tag("startTime", e.instant.toISOString())}${tag("duration", e.minutes)}`,
      `    ${tag("production", e.production)}${tag("workType", e.workType)}${tag("department", e.department)}`,
      `    ${tag("venue", e.venue)}${tag("conductor", e.conductor)}`,
      `    <equipment>${equipment}</equipment>`,
      "  </event>"
    ].join("\n")
  })

fs.writeFileSync(OUT, `<?xml version="1.0" encoding="UTF-8"?>\n<events>\n${rows.join("\n")}\n</events>\n`)

console.log(`✅ Generated ${rows.length} events (${FROM} + ${MONTHS} months, seed ${SEED}) → ${OUT}`)
