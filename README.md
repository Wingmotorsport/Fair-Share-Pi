# Wing Motorsport — Fair Share Pi

Raspberry Pi-hosted team fair-share dashboard for iRacing endurance events.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm start
```

Open `http://raspberrypi.local:3000` on your local network (or your Pi's IP address).

## Features in this starter
- Create a race code and join it from another device
- Add drivers and record completed laps
- Calculate equal-lap fair-share targets
- Share race data between browsers through the Pi server

## Important integration notes
This is a **starter scaffold**, not a copy of the earlier `fair-share-pi.zip` archive. The archive could not be retrieved in this session. Race state is held in memory and is lost on server restart. The lap recording form is manual; it is **not** connected to live iRacing telemetry.

iRacing runs on Windows, so a separate Windows telemetry relay will be required to read iRacing data and forward lap events to the Pi. This server provides a basic POST `/api/races/:code/laps` endpoint for a future authorized relay. The race code is only a sharing identifier, not a security credential. Do not expose the server directly to the public internet without authentication and HTTPS.

## Project files
- `server.js` — Node.js API and static-file server
- `public/index.html` — responsive web dashboard
- `package.json` — Node.js dependencies

## Next steps
Import the original Fair Share Pi project, add a secure iRacing relay, persistence, driver identity mapping, and deployment configuration.
