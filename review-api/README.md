# Portfolio Analytics + Feedback Backend

This directory contains the Cloudflare Worker backend for the GitHub Pages portfolio.

The site remains hosted on GitHub Pages. Cloudflare is used only as a small API layer.

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

This is client-side page-view analytics. Visitors with JavaScript disabled or blockers that prevent the Worker request may not be recorded.

### POST /feedback
Accepts only:
- name
- email
- comment

The feedback is stored privately in D1 together with the technical metadata above. If `GITHUB_TOKEN` and `GITHUB_REPO` are configured, the Worker also creates a private GitHub Issue containing the feedback and metadata.

No feedback is dynamically displayed on the public website.

A visitor's MAC address is not available to normal websites and is not collected.

## Cloudflare dashboard setup

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

At that point visitor analytics and the feedback form work even without GitHub mirroring because feedback is already safely stored in D1.

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
4. Apply the schema with `wrangler d1 execute portfolio-analytics --remote --file ./schema.sql`.
5. Deploy with `wrangler deploy`.

## Useful D1 queries

Recent visits:

```sql
SELECT created_at, ip, city, region, country, page, referrer, user_agent
FROM visits
ORDER BY created_at DESC
LIMIT 100;
```

Unique IPs:

```sql
SELECT COUNT(DISTINCT ip) AS unique_ips FROM visits;
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
