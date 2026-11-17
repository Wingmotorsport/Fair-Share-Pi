"use strict";
const express = require("express");
const crypto = require("node:crypto");
const path = require("node:path");
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));
const races = new Map();

function raceView(race) {
  const total = race.drivers.reduce((sum, d) => sum + d.laps, 0);
  const target = race.drivers.length ? Math.ceil(total / race.drivers.length) : 0;
  return {
    code: race.code,
    name: race.name,
    totalLaps: total,
    targetPerDriver: target,
    drivers: race.drivers.map(d => ({ ...d, remainingToTarget: Math.max(0, target - d.laps) }))
  };
}
function findRace(req, res, next) {
  const race = races.get(String(req.params.code).toUpperCase());
  if (!race) return res.status(404).json({ error: "Race not found" });
  req.race = race;
  next();
}
app.post("/api/races", (req, res) => {
  const name = String(req.body?.name || "Wing Motorsport Race").trim().slice(0, 80);
  let code;
  do { code = crypto.randomBytes(4).toString("hex").toUpperCase(); }
  while (races.has(code));
  const race = { code, name, drivers: [] };
  races.set(code, race);
  res.status(201).json(raceView(race));
});
app.get("/api/races/:code", findRace, (req, res) => res.json(raceView(req.race)));
app.post("/api/races/:code/drivers", findRace, (req, res) => {
  const name = String(req.body?.name || "").trim().slice(0, 60);
  if (!name) return res.status(400).json({ error: "Driver name required" });
  if (req.race.drivers.length >= 16) return res.status(400).json({ error: "Maximum 16 drivers" });
  if (req.race.drivers.some(d => d.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: "Driver already exists" });
  }
  req.race.drivers.push({ id: crypto.randomUUID(), name, laps: 0 });
  res.status(201).json(raceView(req.race));
});
app.post("/api/races/:code/laps", findRace, (req, res) => {
  const driver = req.race.drivers.find(d => d.id === req.body?.driverId);
  if (!driver) return res.status(404).json({ error: "Driver not found" });
  const count = req.body?.count === undefined ? 1 : req.body.count;
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    return res.status(400).json({ error: "count must be an integer from 1 to 100" });
  }
  driver.laps += count;
  res.json(raceView(req.race));
});
app.use("/api", (_req, res) => res.status(404).json({ error: "Unknown API route" }));
const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => console.log("Fair Share Pi listening on port " + port));
