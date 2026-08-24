# Portfolio Analytics + Feedback Backend

This directory contains the Cloudflare Worker backend for the GitHub Pages portfolio.

The site remains hosted on GitHub Pages. Cloudflare is used as the dynamic API and database layer.

## What it does

### POST /visit
Records normal browser page views in Cloudflare D1.

Stored fields include:
- timestamp
- random browser-session ID
- page path/query
- referrer
- IP address
- Cloudflare IP-derived country, region, city, timezone, colo, and ASN when available
- browser/device user-agent
- browser language
- screen and viewport dimensions
- client timezone

Each successful `/visit` is also mirrored into the `events` table as a `page_view` event so a complete session timeline can be queried from one table.

### POST /event
Records semantic portfolio interactions in the `events` table. The browser sends only meaningful actions rather than raw mouse coordinates or session replay data.

Tracked events currently include:
- `mode_switch`
- `project_open`
- `resume_open`
- `media_open`
- `email_click`
- `phone_click`
- `linkedin_click`
- `link_click`
- `button_click`
- `feedback_start`
- `feedback_submit`
- `scroll_50`
- `scroll_100`
- `video_play`
- `video_25`
- `video_50`
- `video_75`
- `video_complete`
- `page_exit`

Event rows also include session ID, page, referrer, UTM attribution fields, IP-derived location/network metadata, browser/device user-agent, screen/viewport, and client timezone.

The analytics client keeps attribution only for the current browser session. It does not create a persistent cross-session visitor ID and does not record raw mouse movement or keystrokes.

### POST /feedback
Accepts:
- name
- optional email
- comment

The feedback is stored privately in D1 together with the technical metadata above. If `GITHUB_TOKEN` and `GITHUB_REPO` are configured, the Worker also creates a private GitHub Issue containing the feedback and metadata.

A successful feedback insert also creates a `feedback_submit` event for the same session.

No feedback is dynamically displayed on the public website.

A visitor's MAC address is not available to normal websites and is not collected.

## Upgrade an existing deployment

For the existing `portfolio-analytics` database and `portfolio-api` Worker:

1. Open the Cloudflare D1 console for `portfolio-analytics`.
2. Execute `migrations/002_events.sql` once. The migration is idempotent because it uses `CREATE ... IF NOT EXISTS`.
3. Replace the deployed Worker code with the updated `worker.js` and deploy it.
4. Confirm `GET /health` still returns `{ "ok": true, "service": "portfolio-api" }`.
5. Before publishing the frontend changes, test `POST /event` or browse the staged site and confirm rows are appearing in the `events` table.
6. Publish the frontend analytics update.

The database migration must happen before the new Worker is deployed so `/event` has a destination table immediately.

## New Cloudflare dashboard setup

1. Create a D1 database named `portfolio-analytics`.
2. Open the D1 console and execute `schema.sql`.
3. Create a Worker named `portfolio-api` and replace its code with `worker.js`.
4. Add a D1 binding:
   - Variable name: `DB`
   - Database: `portfolio-analytics`
5. Add a plain-text Worker variable:
   - `ALLOWED_ORIGIN=https://shaojiechen82.github.io`
6. Deploy the Worker.
7. Copy the resulting `https://portfolio-api.<subdomain>.workers.dev` origin into `assets/config/portfolio-api.json`.

At that point page views, interaction analytics, and the feedback form work even without GitHub mirroring because feedback is already safely stored in D1.

## Optional GitHub private-Issue mirror

Create a private GitHub repository named `portfolio-feedback`.

Create a fine-grained GitHub Personal Access Token with access only to that repository and only the minimum Issues read/write permission required to create issues.

In the Worker settings add:
- Secret: `GITHUB_TOKEN=<token>`
- Variable: `GITHUB_REPO=ShaojieChen82/portfolio-feedback`

`GITHUB_TOKEN` must be a Cloudflare secret and must never be committed to this public repository.

`GITHUB_LABEL` is optional. If configured, the label must already exist in the private repository or GitHub may reject issue creation.

## Wrangler alternative

If deploying from a local checkout instead of the dashboard:

1. Copy `wrangler.jsonc.example` to `wrangler.jsonc`.
2. Replace `REPLACE_WITH_D1_DATABASE_ID` with the real D1 database ID.
3. Set the GitHub token with `wrangler secret put GITHUB_TOKEN`.
4. Apply the schema with `wrangler d1 execute portfolio-analytics --remote --file ./schema.sql` for a fresh database, or apply `migrations/002_events.sql` for the analytics upgrade.
5. Deploy with `wrangler deploy`.

## Useful D1 queries

Recent visits:

```sql
SELECT created_at, ip, city, region, country, page, referrer, user_agent
FROM visits
ORDER BY created_at DESC
LIMIT 100;
```

Complete recent event stream:

```sql
SELECT created_at, session_id, event_name, event_target, page, event_data,
       utm_source, utm_campaign, city, region, country
FROM events
ORDER BY created_at DESC
LIMIT 200;
```

One session journey:

```sql
SELECT created_at, event_name, event_target, page, event_data
FROM events
WHERE session_id = 'PASTE_SESSION_ID_HERE'
ORDER BY created_at ASC;
```

Most common actions:

```sql
SELECT event_name, COUNT(*) AS events
FROM events
GROUP BY event_name
ORDER BY events DESC;
```

Most opened projects:

```sql
SELECT event_target, COUNT(*) AS opens
FROM events
WHERE event_name = 'project_open'
GROUP BY event_target
ORDER BY opens DESC;
```

Resume opens:

```sql
SELECT event_target, COUNT(*) AS opens
FROM events
WHERE event_name = 'resume_open'
GROUP BY event_target
ORDER BY opens DESC;
```

UTM traffic sources:

```sql
SELECT COALESCE(NULLIF(utm_source, ''), '(none)') AS source,
       COUNT(DISTINCT session_id) AS sessions
FROM events
WHERE event_name = 'page_view'
GROUP BY source
ORDER BY sessions DESC;
```

Top pages:

```sql
SELECT page, COUNT(*) AS views
FROM visits
GROUP BY page
ORDER BY views DESC;
```

Top locations:

```sql
SELECT country, region, city, COUNT(*) AS views
FROM visits
GROUP BY country, region, city
ORDER BY views DESC
LIMIT 50;
```

Recent feedback:

```sql
SELECT created_at, name, email, comment, ip, city, region, country, github_mirrored, github_issue_url
FROM feedback
ORDER BY created_at DESC;
```
