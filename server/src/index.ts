import cors from "cors";
import express from "express";
import {
  getFilteredEvents,
  getSchedule,
  getWeek,
  loadSchedule,
  watchSchedule
} from "./services/scheduleService.js";

const app = express();
const port = 4000;

app.use(cors());

loadSchedule();
watchSchedule();

app.get("/api/meta", (_req, res) => {
  res.json(getSchedule().meta);
});

app.get("/api/events", (req, res) => {
  const year = req.query.year ? Number(req.query.year) : undefined;
  const month = req.query.month ? Number(req.query.month) : undefined;

  res.json(
    getFilteredEvents({
      year,
      month,
      currentAndFutureOnly: true
    })
  );
});

app.get("/api/week", (req, res) => {
  const year = Number(req.query.year);
  const week = Number(req.query.week);

  if (!Number.isFinite(year) || !Number.isFinite(week)) {
    res.status(400).json({ error: "year and week query params are required" });
    return;
  }

  res.json(getWeek(year, week));
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
