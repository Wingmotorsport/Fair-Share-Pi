# Wing Motorsport — Fair Share

A shared endurance lap-count dashboard using **GitHub Pages + Supabase** (no Raspberry Pi required for manual recording).

## Static website

The deployable website lives at `docs/index.html`. It connects directly to the Wing Motorsport Supabase project using a **publishable** key (safe to include in browser source code).

It supports:
- Creating a race with a 16-character sharing code
- Joining a race from another browser
- Adding drivers and manually recording completed laps
- Polling for teammate updates every 3 seconds
- Viewing equal-share lap targets

### Enable GitHub Pages

1. Make this repository public if you use GitHub Free (check that it contains no secrets or private information before doing so).
2. Open **Settings → Pages**.
3. Set source to **Deploy from a branch**, branch **main**, folder **/docs**.
4. Website should become available at `https://wingmotorsport.github.io/Fair-Share-Pi/`.

### Required Supabase setting

In Supabase project `gannbknqvppvkvzprxxp`, enable **Authentication → Providers → Anonymous Sign-Ins**. Browser sessions use anonymous Supabase user identities to control access to race codes and lap data.

The database has three RLS-enabled tables: `fs_races`, `fs_members`, and `fs_drivers`. Only race members can read their race and driver details. Joining a race requires its code. All joined members can record laps; do not share codes publicly.

**Known limitations:** The site records laps manually; it does not read iRacing telemetry. Anonymous users lose their identity if they clear browser storage. The site should be enhanced with named accounts, admin roles, telemetry validation, idempotent lap events, and abuse controls before public use. The privileged RPC functions have explicit membership checks; Supabase's advisor may flag their intentional SECURITY DEFINER access for further review.

## Legacy Raspberry Pi starter

`server.js`, `package.json`, and `public/index.html` are the original standalone Node.js *manual* starter. That server stores race data only in memory and is **not** connected to Supabase. To use it locally, install Node.js 20+, then run `npm install && npm start`.

The earlier complete `fair-share-pi.zip` archive was not available in this chat; do not assume these source files match its full feature set.
