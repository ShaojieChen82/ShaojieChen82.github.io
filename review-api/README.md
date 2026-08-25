# Portfolio Analytics + Feedback Backend

This directory contains the Cloudflare Worker backend for the GitHub Pages portfolio.

The site remains hosted on GitHub Pages. Cloudflare is used as the dynamic API, analytics, and database layer.

## What it does

### Persistent anonymous browser ID

The browser creates a random `visitor_id` and stores it in first-party `localStorage`. This allows repeat visits from the same browser profile to be grouped across separate sessions.

This ID is not a confirmed person or physical-device identity. Clearing site data, private browsing, another browser, or another device creates a different ID. The implementation intentionally does not use canvas, WebGL, audio, or other heavy fingerprinting techniques.

### POST /visit
Records normal browser page views in Cloudflare D1.

Stored fields include:
- timestamp
- random browser-session ID
- persistent anonymous browser ID
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
Records semantic portfolio interactions in the `events` table. The browser sends meaningful actions rather than raw mouse coordinates or session replay data.

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

Event rows include visitor ID, session ID, page, referrer, UTM attribution fields, IP-derived location/network metadata, browser/device user-agent, screen/viewport, and client timezone.

### POST /feedback
Accepts:
- name
- optional email
- comment

Feedback is stored privately in D1. If `GITHUB_TOKEN` and `GITHUB_REPO` are configured, the Worker also creates a private GitHub Issue containing the feedback and private technical metadata, including the anonymous browser ID and session ID.

A successful feedback insert also creates a `feedback_submit` event for the same visitor/session.

No feedback is dynamically displayed on the public website.

A visitor's MAC address is not available to normal websites and is not collected.

## Weekly analytics report

The Worker includes a `scheduled` handler. Configure the cron trigger:

```text
0 15 * * 1
```

This runs every Monday at 15:00 UTC, which is Monday morning in Mountain Time (09:00 during daylight saving time and 08:00 during standard time).

Each run summarizes the trailing seven days and creates a private GitHub Issue in `GITHUB_REPO`. The report includes:
- unique anonymous browsers
- new vs returning browsers
- sessions and page views
- project/resume/contact/feedback conversion
- top pages
- top projects
- resume opens
- traffic sources
- top locations
- repeat browsers within the report period

Successful weekly reports are recorded in the `analytics_reports` D1 table so the same scheduled report is not intentionally created twice.

## On-demand report

The Worker also exposes a protected admin endpoint:

```text
POST /admin/report
```

Create a separate Cloudflare secret named `REPORT_TOKEN`. Never put this secret in the public website or repository.

Authorization header:

```text
Authorization: Bearer <REPORT_TOKEN>
```

Supported periods:
- `week_to_date`
- `last_7_days`
- `last_30_days`

Example body:

```json
{
  "period": "week_to_date",
  "createIssue": true
}
```

If `createIssue` is true, the report is also saved as a private GitHub Issue. The endpoint always returns the report data as private JSON to the authorized caller.

## Upgrade an existing deployment

For the existing `portfolio-analytics` database and `portfolio-api` Worker:

1. Open the Cloudflare D1 console for `portfolio-analytics`.
2. Execute `migrations/003_persistent_visitors_reports.sql` exactly once. It adds `visitor_id` columns to existing tables and creates `analytics_reports`.
3. Replace the deployed Worker code with the updated `worker.js` and deploy it.
4. Add a Cloudflare secret named `REPORT_TOKEN` if on-demand reports are desired.
5. Add a Cron Trigger with `0 15 * * 1` for the Monday weekly report.
6. Confirm `GET /health` still returns `{ "ok": true, "service": "portfolio-api" }`.
7. Publish the frontend changes so the browser begins sending `visitorId`.

The D1 migration must happen before the new Worker is deployed because the updated inserts expect the new `visitor_id` columns.

## New Cloudflare dashboard setup

1. Create a D1 database named `portfolio-analytics`.
2. Open the D1 console and execute `schema.sql`.
3. Create a Worker named `portfolio-api` and replace its code with `worker.js`.
4. Add a D1 binding:
   - Variable name: `DB`
   - Database: `portfolio-analytics`
5. Add a plain-text Worker variable:
   - `ALLOWED_ORIGIN=https://shaojiechen82.github.io`
6. Add GitHub mirroring configuration if desired.
7. Add `REPORT_TOKEN` as a Cloudflare secret for on-demand reports.
8. Add the weekly Cron Trigger `0 15 * * 1`.
9. Deploy the Worker.
10. Copy the resulting `https://portfolio-api.<subdomain>.workers.dev` origin into `assets/config/portfolio-api.json`.

## Optional GitHub private-Issue mirror

Create a private GitHub repository named `portfolio-feedback`.

Create a fine-grained GitHub Personal Access Token with access only to that repository and only the minimum Issues read/write permission required to create issues.

In the Worker settings add:
- Secret: `GITHUB_TOKEN=<token>`
- Variable: `GITHUB_REPO=ShaojieChen82/portfolio-feedback`

`GITHUB_TOKEN` must be a Cloudflare secret and must never be committed to this public repository.

`GITHUB_LABEL` is optional for feedback Issues. `GITHUB_REPORT_LABEL` is optional for report Issues. If configured, the labels must already exist in the private repository.

## Wrangler alternative

If deploying from a local checkout instead of the dashboard:

1. Copy `wrangler.jsonc.example` to `wrangler.jsonc`.
2. Replace `REPLACE_WITH_D1_DATABASE_ID` with the real D1 database ID.
3. Set the GitHub token with `wrangler secret put GITHUB_TOKEN`.
4. Set the report token with `wrangler secret put REPORT_TOKEN`.
5. Apply `migrations/003_persistent_visitors_reports.sql` for this upgrade, or `schema.sql` for a fresh database.
6. Deploy with `wrangler deploy`.

## Useful D1 queries

Recent event stream:

```sql
SELECT created_at, visitor_id, session_id, event_name, event_target, page,
       utm_source, city, region, country
FROM events
ORDER BY created_at DESC
LIMIT 200;
```

One visitor across multiple sessions:

```sql
SELECT created_at, visitor_id, session_id, event_name, event_target, page, event_data
FROM events
WHERE visitor_id = 'PASTE_VISITOR_ID_HERE'
ORDER BY created_at ASC;
```

Repeat browsers:

```sql
SELECT visitor_id,
       COUNT(DISTINCT session_id) AS sessions,
       COUNT(*) AS events,
       MIN(created_at) AS first_seen,
       MAX(created_at) AS last_seen
FROM events
WHERE visitor_id IS NOT NULL AND visitor_id <> ''
GROUP BY visitor_id
HAVING COUNT(DISTINCT session_id) > 1
ORDER BY sessions DESC, events DESC;
```

Last-seven-days summary:

```sql
SELECT
  COUNT(DISTINCT NULLIF(visitor_id, '')) AS unique_browsers,
  COUNT(DISTINCT NULLIF(session_id, '')) AS sessions,
  SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) AS page_views,
  COUNT(DISTINCT CASE WHEN event_name = 'project_open' THEN session_id END) AS project_sessions,
  COUNT(DISTINCT CASE WHEN event_name = 'resume_open' THEN session_id END) AS resume_sessions,
  COUNT(DISTINCT CASE WHEN event_name = 'feedback_submit' THEN session_id END) AS feedback_sessions
FROM events
WHERE created_at >= datetime('now', '-7 days');
```
