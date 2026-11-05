# Portfolio v1 — verification record

Baseline: `817b9765596080a2e25525e9c50c41e8fe968230` (safe stage).

## Scope

- Shared URL/mode owner replaces competing desktop/mobile presentation loaders on the three main entry pages.
- Desktop keeps a two-column engineering editorial layout. Mobile uses a 56px header, four bottom destinations, compact project rows and dedicated case screens.
- Motorsport uses graphite, warm white and vermilion, without gradients/glows.
- Canonical project descriptions, validation boundaries and selected evidence are retained. No new performance measurements or project dates are invented.
- FAQ retains personal motivation and C8 Z06 / GT3 RS garage goals. Hiring targets are explicitly estimates; the offer target and estimated grace-period end are separate.
- Existing analytics/feedback services remain in place. Local preview suppresses analytics writes.

## Automated checks

- JavaScript syntax checks: `portfolio-app.js`, `portfolio-state.js`, `site.js`.
- 17 state/calendar/evidence regression groups in `tools/test_portfolio_state.cjs`.
- Both canonical-content generator `--check` commands.
- 214 unique local asset references resolve, including previously sparse-excluded radiator SVGs.
- No duplicate IDs in entry-page shells; `git diff --check` passes.

## Browser checks (local preview)

| Viewport / route | Action | Result |
| --- | --- | --- |
| 1440 × 1000 / Overview | Switch Energy to Motorsport | Heading, theme, project data, URL, resume and navigation all change together. |
| 390 × 844 / Motorsport Work | Open project list | Four project entries are visible in the viewport; no horizontal project carousel. |
| Mobile / CAN controller case | Open Evidence, enlarge image, next, close | Project remains selected; full-screen dialog, caption, navigation and return focus work. |
| Mobile / About → Connect | Navigate across pages and switch to Energy | Mode persists; active resume becomes Energy; original feedback form remains present once. |
| Mobile / Connect | Copy email | Success status appears. |
| Mobile / engine benchmark case | Open video and press play | Video reports playing, readyState 4 and no media error. |
| 360 × 800 / legacy `?mode=motorsport#e200` | Open and follow Evidence | Normalizes to Energy E200 with a persistent case parameter; no overflow. |
| Mobile / Work | Select Test & DAQ | Only benchmark-platform and DAQ cases remain. |
| 1440 × 1000 / About | Inspect hiring summary | Nov 30 offer target and provisional Dec 29 date are distinguished. Countdown is 25 days on Nov 5, 2026. |

No browser error/warning entries were observed in the checked local flows. These are browser viewport checks, not physical iPhone/Android device certification. The original feedback service is retained; no real test feedback was sent.

## Recovery

GitHub safe branch, local annotated tag, complete compressed archive and SHA-256 manifest were created before source edits. See `SAFE_STAGE.md`. Restoring the saved tree can be done with a forward commit, without rewriting main history.
