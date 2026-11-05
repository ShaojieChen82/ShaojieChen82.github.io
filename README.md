# Shaojie Chen Engineering Portfolio — v1

A static, dual-direction GitHub Pages portfolio. Energy and Motorsport share project data, URL state and navigation; CSS provides distinct desktop and compact mobile presentations.

## Run locally

```bash
python3 -m http.server 4176 --bind 127.0.0.1
```

Open `http://127.0.0.1:4176/index.html?mode=chp` or `?mode=motorsport`. No installation or build step is required. Local preview does not send real analytics records. Feedback delivery still uses the existing configured service; do not submit test messages to production.

## Structure

- `index.html`: Overview, Work and individual case views.
- `faq.html`: About / FAQ, personal interests, patent application and hiring notes.
- `contact.html`: direction-aware resume ordering, contact methods and original feedback form.
- `assets/js/portfolio-state.js`: shared URL/deep-link resolution and Eastern-time calendar arithmetic.
- `assets/js/portfolio-app.js`: app shell, views, filtering, accessible dialogs and media viewer.
- `assets/css/portfolio-app.css`: responsive design system. Energy uses warm paper / green; Motorsport uses graphite / vermilion.
- `assets/data/*-projects.json`: canonical project descriptions and selected evidence. Their generated JS bundles are used by both screen sizes.
- `assets/js/site.js`: existing regional API routing and analytics bootstrap; legacy presentation is excluded from v1 pages.
- `SAFE_STAGE.md`: immutable baseline and exact-content rollback procedure.

### URLs

- Energy: `index.html?mode=chp`
- Motorsport: `index.html?mode=motorsport`
- Work: `index.html?mode=chp&view=work`
- Case: `index.html?mode=chp&case=e200#e200`
- Older case hashes such as `index.html#e200` remain supported and are normalized before in-case navigation.
- `projects.html`, `resume.html` and `capabilities.html` remain compatible entry points.

### Update project content

Edit the JSON source, then regenerate the associated bundle:

```bash
python3 tools/build_chp_content.py
python3 tools/build_motorsport_content.py
```

The builders detect v1 and preserve the app shell. They retain legacy support for older checkouts. After changing assets or bundles, increment their HTML query versions when publishing.

### Hiring plan

The About page deliberately separates the **Nov 30, 2026 offer planning target** from the **estimated Dec 29, 2026 grace-period end**, which is pending immigration-counsel confirmation. Neither is described as a confirmed legal deadline. The countdown uses calendar dates in `America/Detroit`, refreshes after backgrounding and displays an update-pending state after the target. Dates and their explanatory copy are in `portfolio-app.js`.

## Verify

```bash
node --check assets/js/portfolio-app.js
node --check assets/js/portfolio-state.js
node tools/test_portfolio_state.cjs
python3 tools/build_chp_content.py --check
python3 tools/build_motorsport_content.py --check
python3 tools/validate_static_assets.py
```

Browser QA covers 1440px desktop, 390px and 360px mobile, direction switching across pages, filtered lists, direct cases, media controls, resume targeting and the FAQ timeline. The site uses standard browser history, native PDF links and a native dialog focus trap; it does not replace browser back/forward gestures.

## Publication and recovery

GitHub Pages publishes `main`. The original safe stage is preserved on `safe-stage-2026-11-05` at `817b9765596080a2e25525e9c50c41e8fe968230`, plus a complete local archive. Follow `SAFE_STAGE.md` to restore the exact original tree with a forward commit; do not force-reset main or overwrite the safe branch.

Original project assets and legacy presentation files are retained. External analytics/feedback infrastructure and public audience are unchanged.
