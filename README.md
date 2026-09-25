# Orchestra Scheduler Demo

Demo monorepo for an orchestra scheduling system.

## Apps

- `server` – reads XML, normalizes it, and builds ready-to-render month / week / day views (all filtering, grouping, date math and formatting)
- `client` – React frontend that only renders what the server returns
- `shared` – TypeScript contract (view models) between server and client

## Features

- XML source data
- Adapter layer so XML structure changes are isolated
- Month, week and day views with month / week navigation
- Opens on today, or on the nearest day with data when today is outside the data range
- Print current weekly schedule
- Fake orchestra data included (`npm run generate:xml` regenerates it starting from today)

## Run

```bash
npm install
npm run dev
```

Server: `http://localhost:4000`  
Client: `http://localhost:5173` (proxies `/api` to the server)

Time zone defaults to `Europe/Helsinki`; override with `SCHEDULE_TZ`.

## API

- `GET /api/schedule?view=week&date=2026-03-20`
  - `view`: `month` | `week` | `day` (default `week`)
  - `date`: `YYYY-MM-DD` (optional; the server picks a default)
