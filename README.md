# Orchestra Scheduler Demo

Demo monorepo for an orchestra scheduling system.

## Apps

- `server` – reads XML, normalizes it, and builds ready-to-render month / week / day views (all filtering, grouping, date math and formatting)
- `client` – React frontend that only renders what the server returns
- `shared` – TypeScript contract (view models) between server and client

## Features

- XML source data
- Adapter layer so XML structure changes are isolated
- Month, week and day views; previous / today / next; year, month, week and department filters
- View, date and filter are kept in the URL (bookmarkable, back button works)
- Opens on today, or on the nearest day with data when today is outside the data range
- Print-friendly layout for any view
- Light and dark mode
- Accessibility: built to WCAG 2.2 AA (EN 301 549) — see below

## Fake data

`server/src/data/demo-opas.xml` holds ~2,500 events for two seasons (August 2025 – July 2027):
programme weeks with rehearsals, sectionals, dress rehearsals, concerts, choir calls,
stage / lighting / sound crew calls, music library work, front of house, education work,
tours, recordings and a lighter summer season, with Christmas and July breaks.

```bash
npm run generate:xml                                  # defaults below
npm run generate:xml -- --from 2025-08-01 --months 24 --seed 42 --out path/to/file.xml
```

The generator is seeded, so the same options always produce the same file.

## Accessibility

- Semantic landmarks, one `h1` per view and a logical heading order; skip link to the schedule
- All controls are native buttons / selects with visible labels; view switch uses `aria-pressed`
- Month grid is a real table with captions, column/row headers and full-date button labels; today is `aria-current="date"`
- Updates are announced through a polite live region; focus moves to the new heading when the activated control disappears
- Text contrast ≥ 4.5:1 and control borders / focus rings ≥ 3:1 in light and dark mode
- Department colour is never the only cue (always paired with the department name)
- Reflows without horizontal scrolling down to 320 px; targets are at least 44 px; honours `prefers-reduced-motion`

## Run

```bash
npm install
npm run dev
```

Server: `http://localhost:4000`  
Client: `http://localhost:5173` (proxies `/api` to the server)

Time zone defaults to `Europe/Helsinki`; override with `SCHEDULE_TZ`.
Dates and times are formatted in Finnish (`LOCALE = "fi-FI"` in `server/src/config.ts`); the rest of the UI is English.
Finnish date text is marked with `lang="fi"` so screen readers pronounce it correctly.

## API

- `GET /api/schedule?view=week&date=2026-03-20&department=lighting`
  - `view`: `month` | `week` | `day` (default `week`)
  - `date`: `YYYY-MM-DD` (optional; the server picks a default)
  - `department`: department key (optional; all departments when omitted)
