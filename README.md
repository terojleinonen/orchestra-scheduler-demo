# Orchestra Scheduler Demo

Demo monorepo for an orchestra scheduling system.

## Apps

- `server` – reads XML, converts it to normalized JSON, exposes API
- `client` – React frontend with week view, filters, and print button
- `shared` – shared TypeScript types

## Features

- XML source data
- Adapter layer so XML structure changes are isolated
- Only current and future events are shown
- Filter by year and month
- Print current weekly schedule
- Fake orchestra data included

## Run

```bash
npm install
npm run dev
```

Server: `http://localhost:4000`  
Client: `http://localhost:5173`

## API

- `GET /api/meta`
- `GET /api/events`
- `GET /api/events?year=2026&month=3`
- `GET /api/week?year=2026&week=10`
