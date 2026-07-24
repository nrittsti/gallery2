# Maintenance Checklist

Canonical step sequence for publishing photo updates and dependency maintenance.

## 1. Photo Preparation

```bash
# Place originals in input/[year]/[month]/ (supported: JPG, HEIC)

# Run the processing pipeline
bash ./create_thumbnails.sh
```

**Verify:**
- `src/assets/photos.json` exists and contains new entries
- `src/assets/grid/` has new thumbnails (600x600)
- `src/assets/lightbox/` has new full-size images

## 2. Local Verification

Run gates in order. Stop and fix if any step fails.

```bash
# 1. Lint
npm run lint

# 2. Build
npm run build

# 3. All tests (unit + E2E)
npm run test
```

**Verify:**
- All gates pass (0 errors, 0 failures)
- New tests pass if any were added
- No TypeScript errors

## 3. Deployment

```bash
# Commit and push to a feature branch
git checkout -b release/YYYY-MM-DD
git add src/assets/photos.json src/assets/grid/ src/assets/lightbox/ MAINTENANCE.md
git commit -m "<describe changes>"
git push origin release/YYYY-MM-DD
```

CI (`playwright_push.yml`) runs automatically on push:
- lint → build → unit → e2e

**Wait for CI to pass on the branch.** If CI fails, fix and re-push.

**Once CI passes,** merge to `main`:
1. Create a pull request on GitHub from `release/YYYY-MM-DD` → `main`
2. Wait for merge CI to pass
3. Go to GitHub → Actions → **Upload Distribution** workflow
4. Click **Run workflow** (on `main` branch)
5. Wait for completion (build → FTP upload → E2E validation against production URL)

**If upload workflow fails:**
- If FTP upload partially succeeded: re-run the workflow (it overwrites files on the server)
- If build failed: fix locally, re-commit, and re-deploy
- If production E2E validation failed: initiate rollback (see Rollback section)

## 4. Post-Deployment Smoke Check

- Open https://nicorittstieg.de
- Verify gallery loads with new photos
- Click a photo to open lightbox
- Verify EXIF metadata is displayed
- Test navigation (prev/next, keyboard arrows, Escape)
- Verify year filter works with new content

**If any smoke check fails:**
- Initiate rollback immediately (see Rollback section)
- Investigate root cause before re-deploying

## 5. Dependency Maintenance

Use the **Upgrade Batch** framework for all dependency changes:

- Batch workflow and evidence template: `_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md`
- Each batch has one owner (Nico), one evidence artifact, and follows: plan → execute → verify → merge-or-rollback
- Gate order: `lint → build → unit → e2e` — if any gate fails, rollback the entire batch
- Only one batch in flight at a time
- See the template for full lifecycle instructions and rollback procedures

## Rollback

If production has issues after deployment:

1. **Quick rollback:** Use the previous CI run's build artifact and upload manually via FTP
2. **Git rollback:** `git revert -m 1 HEAD` (for merge commits) or `git revert HEAD~N..HEAD` (for multi-commit ranges) on main, push, then re-deploy
3. **After rollback:** Investigate root cause, fix, test, re-deploy

## Cycle Artifacts

For context from the Q3 2026 maintenance cycle:

- **Deferred major upgrades:** See [`_bmad-output/implementation-artifacts/deferred-major-ledger.md`](_bmad-output/implementation-artifacts/deferred-major-ledger.md) — rationale and revisit triggers for vitest 5.x, TypeScript 7.x, and coupled packages
- **Regression closure log:** See [`_bmad-output/implementation-artifacts/regression-closure-log.md`](_bmad-output/implementation-artifacts/regression-closure-log.md) — all 48 issues tracked across the cycle
- **Upgrade batch evidence:** See [`_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md`](_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md) — batch workflow and evidence template
- **Final verification:** See [`_bmad-output/implementation-artifacts/final-baseline-verification.md`](_bmad-output/implementation-artifacts/final-baseline-verification.md) — all gates pass on release candidate
