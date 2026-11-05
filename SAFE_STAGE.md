# Safe stage — 2026-11-05

The user designated the website state immediately before the first portfolio-app redesign as **safe stage**.

- Repository: `ShaojieChen82/ShaojieChen82.github.io`
- Commit: `817b9765596080a2e25525e9c50c41e8fe968230`
- Tree: `3da04698e1b9517cd784cfed7b16fc8b4643b0f2`
- Preserved GitHub branch: `safe-stage-2026-11-05`
- Local annotated tag: `safe-stage-2026-11-05`
- Full source/archive backup, outside the checkout: `../safe-stage-backup/safe-stage-2026-11-05-817b976.tar.gz`
- Backup SHA-256: `b4d2cb8a0c51a5e3b30f01935bd4557298c1d42fbb11277e4e89dc75821cce67`
- Backup manifest: `../safe-stage-backup/SAFE_STAGE.json`

Do not move or overwrite the safe-stage branch/tag. Work on a separate branch.

## Restore exact tracked website content without rewriting history

First save any local work and confirm the working tree is clean. Fetch `main` and the safe-stage branch. Create a new rollback branch from the latest `origin/main`, then restore its complete tree:

```bash
git fetch origin main safe-stage-2026-11-05
git switch -c restore-safe-stage origin/main
git restore --source=origin/safe-stage-2026-11-05 --staged --worktree -- .
git diff --cached --stat
git commit -m "Restore website to safe stage 2026-11-05"
git push -u origin restore-safe-stage
```

Review and merge that rollback PR to `main`, then verify the GitHub Pages deployment. This creates an ordinary forward commit; it does not erase later history. On sparse checkouts, restore in a full checkout so every tracked path is restored.

Alternatively, use the saved safe tree SHA to create a new Git commit whose parent is the current `main` head, then advance `main` with an expected-head lease. The resulting website tree must equal the safe tree exactly.

The source backup preserves repository files, not mutable external analytics/feedback records or hosting account settings. This redesign does not migrate those services.
