# Code Review Findings — Story 2.5: Maintenance Checklist Draft

**Reviewers:** Blind Hunter + Edge Case Hunter + Acceptance Auditor
**Spec:** 2-5-maintenance-checklist-draft.md
**AC Verdict:** All ACs PASS

---

## Patch (fixable, unambiguous)

### P1 — Duplicate `### What the Script Does` heading in README
**File:** README.md:120,132 · **Severity:** low
Two identical H3 headings appear consecutively. The first was added by this story (link to MAINTENANCE.md + old photo steps), the second is pre-existing (script pipeline description).
**Fix:** Rename the first heading to `### Adding Photos (Quick Reference)`.

### P2 — Redundant unit test execution in verification gates
**File:** MAINTENANCE.md §2 · **Severity:** medium
Checklist runs `npm run test:unit` then `npm run test`. Since `npm run test` already runs `npm run test:unit && npm run test:e2e`, unit tests execute twice.
**Fix:** Remove `npm run test:unit` from the list and replace with `npm run test:e2e` (as a separate optional step), or add a note that `npm run test` covers both.

### P3 — `git add -A` stages unwanted artifacts
**File:** MAINTENANCE.md §3 · **Severity:** medium
`git add -A` stages all changes including `input/`, `node_modules/` (if not in .gitignore), `.DS_Store`, and other scratch files.
**Fix:** Replace with specific paths: `git add src/assets/photos.json src/assets/grid/ src/assets/lightbox/ MAINTENANCE.md` or add a verified `.gitignore` check step.

### P4 — Direct push to main creates broken-window risk
**File:** MAINTENANCE.md §3 · **Severity:** medium
Checklist pushes directly to `main`, then waits for CI to pass. If CI fails, `main` is broken. For a single-person project this is tolerable but improvable.
**Fix:** Change to feature-branch workflow: create branch → push → wait for CI PR check → merge to main → deploy.

### P5 — Rollback `git revert HEAD` only reverts last commit
**File:** MAINTENANCE.md §6 (Rollback) · **Severity:** medium
For multi-commit deployments, `git revert HEAD` only undoes the most recent commit. Also, merge commits need `-m 1` flag.
**Fix:** Use `git revert HEAD~N..HEAD --no-edit` or `git reset --hard <last-known-good>` + force push.

### P6 — `npm install package@latest` may pull breaking changes
**File:** MAINTENANCE.md §5 · **Severity:** medium
`@latest` tag can include major version bumps with breaking API changes.
**Fix:** Add a review step: check changelog/npm diff before applying. Consider `npm install package@^version` or semver-aware approach.

### P7 — Rollback after commit doesn't work with `git checkout main`
**File:** MAINTENANCE.md §5 · **Severity:** medium
"If any gate fails → rollback: `git checkout main`" only works before committing. After `git commit`, the commit still exists.
**Fix:** Add conditional handling: "If uncommitted: `git checkout main`. If committed: `git reset --hard HEAD~1`."

### P8 — No recovery procedure for failed smoke check
**File:** MAINTENANCE.md §4 · **Severity:** medium
Post-deployment smoke check lists verification items but gives no guidance on what to do if any fail.
**Fix:** Add "If any smoke check fails → initiate rollback (see Rollback section) and investigate root cause."

### P9 — Commit message placeholder could be committed as-is
**File:** MAINTENANCE.md §3 · **Severity:** low
`git commit -m "description of changes"` uses a literal placeholder string.
**Fix:** Use `<describe your changes>` or `${msg}` variable pattern.

---

## Decision Needed (requires human input)

### D1 — Dry-run validation was only partial
**File:** story file (Dev Agent Record) · **Severity:** medium
The story claims dry-run validation (AC2), but only verification gates (`npm run lint`, `build`, `test:unit`) were tested. The photo preparation, deployment, smoke check, and rollback steps were not dry-run validated. Manual production URL verification cannot be fully tested in a dry run.
**Question:** Do you want to accept AC2 as-is, perform additional dry-run validation of the remaining steps, or note the limitation?

### D2 — FTP upload mid-deployment failure handling
**File:** MAINTENANCE.md §3 · **Severity:** medium
If the `upload_dist.yml` workflow's FTP upload step partially succeeds (some files uploaded, some not), there is no rollback for this partial deployment state. Also, `upload_dist.yml` does not yet exist in the repo.
**Question:** Do you want to add a partial-failure rollback instruction, or accept the manual re-deploy as sufficient?

---

## Deferred (pre-existing or handled elsewhere)

| # | Finding | File | Reason |
|---|---------|------|--------|
| F1 | Dependency upgrades bypass PR/CI review | MAINTENANCE.md §5 | Acceptable for single-person project |
| F2 | No photos.json schema validation in checklist | MAINTENANCE.md §1 | Script already validates with `jq` |
| F3 | HEIC requires ImageMagick delegate | MAINTENANCE.md §1 | Pre-existing dependency concern |
| F4 | Hardcoded production URL | MAINTENANCE.md §4 | Single-domain project, acceptable |
| F5 | Missing input dir handled by script | MAINTENANCE.md §1 | `create_thumbnails.sh` creates dirs |
| F6 | No recovery for missing artifacts | MAINTENANCE.md §1 | Re-running script is implied |
| F7 | Git push rejection not covered | MAINTENANCE.md §3 | Standard git knowledge |
| F8 | CI timeout not specified | MAINTENANCE.md §3 | CI has 10-min timeout configured |
| F9 | No previous build artifact for first deploy | MAINTENANCE.md §6 | Edge case for initial deploy |
| F10 | Photo with no EXIF not distinguishable | MAINTENANCE.md §4 | App already handles missing metadata |
| F11 | Git revert on merge commit needs `-m` flag | MAINTENANCE.md §6 | Covered by P5 fix |

---

**Summary:** 9 patch items, 2 decisions needed, 11 deferred. AC compliance: ✅ Pass.
