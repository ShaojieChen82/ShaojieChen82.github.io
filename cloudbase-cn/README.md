# China mirror — Tencent CloudBase free environment

This directory keeps the China-side deployment in the same GitHub repository as the global GitHub Pages site.

## Architecture

- Static site: the repository root is deployed to CloudBase Static Website Hosting.
- Global API: `portfolio-api.cheerioov2.workers.dev` remains unchanged on GitHub Pages.
- China API: when the same site is opened on a CloudBase default hostname, `assets/js/site.js` rewrites portfolio API requests to same-origin `/portfolio-api/*`.
- China data: the CloudBase function stores `visits`, `events`, and `feedback` in the existing CloudBase PostgreSQL instance through the server-side `app.rdb()` API.

No visitor-facing GitHub API call is made by the China function. This keeps feedback reliable within the short timeout of the free CloudBase function environment. China feedback is durable in the PostgreSQL `feedback` table.

## Required CloudBase resources

Use the existing free CloudBase environment and existing PostgreSQL instance. Apply the versioned migration in `cloudbase/migrations`, which creates these server-only tables:

- `visits`
- `events`
- `feedback`

The tables have RLS enabled without browser policies. The `anon` and `authenticated` roles have no table privileges; the China cloud function accesses them with the server-side service role.

Deploy the function in `cloudbase-cn/functions/portfolio-cn-api` as `portfolio-cn-api`.

Associate the CloudBase default domain with:

- `/` -> Static Website Hosting
- `/portfolio-api` -> `portfolio-cn-api` cloud function

Enable path transmission / passthrough for the function route so `/portfolio-api/visit`, `/portfolio-api/event`, `/portfolio-api/feedback`, and `/portfolio-api/health` reach the function with their full request path.

## Static hosting

Connect the GitHub repository and deploy branch `main` from the repository root. This is a pure static site; no build step is required. Future updates to `main` should trigger a new CloudBase deployment.

## Health check

After routing is active:

```bash
curl -i https://YOUR-CLOUDBASE-DOMAIN/portfolio-api/health
```

Expected JSON:

```json
{"ok":true,"service":"portfolio-cn-api","source":"china_cloudbase"}
```

## Notes

CloudBase's free default domain is intended for development/testing and shows Tencent's access-warning interstitial. It is acceptable for this low-volume family/friends mirror, but it is not a no-warning production domain. A filed custom domain is the later upgrade path if needed.
