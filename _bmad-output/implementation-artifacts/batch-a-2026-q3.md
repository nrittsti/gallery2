# Upgrade Batch Evidence

## Batch Identity

| Field | Value |
|-------|-------|
| **Batch Name** | `batch-a-2026-q3` |
| **Owner** | Nico |
| **Created** | 2026-07-15 |
| **Status** | merged |

## Scope — Package Changes

| Package | Current Version | Target Version | Change Type |
|---------|----------------|----------------|-------------|
| react | 19.2.3 | 19.2.7 | [ ] major / [X] minor / [ ] patch |
| react-dom | 19.2.3 | 19.2.7 | [ ] major / [X] minor / [ ] patch |
| @types/react | 19.2.7 | 19.2.17 | [ ] major / [X] minor / [ ] patch |
| @types/node | 24.10.4 | 24.13.3 | [ ] major / [X] minor / [ ] patch |
| vite | 7.3.0 | 7.3.6 | [ ] major / [X] minor / [ ] patch |
| @vitejs/plugin-react | 5.1.2 | 5.2.0 | [ ] major / [X] minor / [ ] patch |
| eslint | 9.39.2 | 9.39.5 | [ ] major / [ ] minor / [X] patch |
| @eslint/js | 9.39.2 | 9.39.5 | [ ] major / [ ] minor / [X] patch |
| typescript-eslint | 8.50.1 | 8.64.0 | [ ] major / [X] minor / [ ] patch |
| eslint-plugin-react-hooks | 7.0.1 | 7.1.1 | [ ] major / [X] minor / [ ] patch |
| react-router | 7.11.0 | 7.18.1 | [ ] major / [X] minor / [ ] patch |
| @playwright/test | 1.57.0 | 1.61.1 | [ ] major / [X] minor / [ ] patch |

Before upgrading, review upstream changelogs for each package:
- [X] Changelogs reviewed for all planned upgrades
- [X] Breaking changes identified and assessed

After upgrading, record the **actual** installed version here.
| Package | Installed Version | Breaking Changes Noted |
|---------|-------------------|------------------------|
| react | 19.2.7 | None — patch bump, no breaking changes |
| react-dom | 19.2.7 | None — patch bump, no breaking changes |
| @types/react | 19.2.17 | None — type-only updates |
| @types/node | 24.13.3 | None — type-only updates |
| vite | 7.3.6 | None — minor bump within 7.x, no config changes needed |
| @vitejs/plugin-react | 5.2.0 | None — minor bump within 5.x |
| eslint | 9.39.5 | None — patch bump within 9.x |
| @eslint/js | 9.39.5 | None — patch bump within 9.x |
| typescript-eslint | 8.64.0 | None — minor bump within 8.x |
| eslint-plugin-react-hooks | 7.1.1 | None — minor bump within 7.x |
| react-router | 7.18.1 | None — minor bump within 7.x |
| @playwright/test | 1.61.1 | None — minor bump within 1.x |

## Lifecycle

Upgrade Batches follow AD-5 (single owner, one batch in flight, full-batch rollback on failure):

1. **Plan** — Select packages, record current/target versions, review changelogs for breaking changes
2. **Execute** — Apply upgrades, update config/source as needed
3. **Verify** — Run gates in order (see below)
4. **Pass** → proceed to Merge; **Fail** → Rollback entire batch (see below)
5. **Merge** — merge the batch branch

## Verification Gates (AD-3 order: lint → build → unit → e2e)

| Gate | Status | Notes |
|------|--------|-------|
| `npm run lint` | [X] pass / [ ] fail | 0 errors, 3 warnings (pre-existing in external JS files) |
| `npm run build` | [X] pass / [ ] fail | Built successfully (785ms) |
| `npm run test:unit` | [X] pass / [ ] fail | 55 passed across 5 test files |
| `npm run test:e2e` | [X] pass / [ ] fail | 26 passed (13 chromium + 13 firefox) |
| **Overall** | [X] **pass** / [ ] **fail** | All gates pass |

All gates must pass for the batch to proceed. If any gate fails, rollback the entire batch.

## Rollback Log

| Date | Rollback Reason | Method | Post-rollback Gates Re-run |
|------|----------------|--------|---------------------------|
|      |                | [ ] `git stash` (uncommitted) / [ ] `git reset --hard HEAD~1` or tag (committed) / [ ] `git revert -m 1` (pushed/merged) | [ ] pass / [ ] fail / [ ] N/A |

**Rollback procedure:**
- **Uncommitted changes:** `git stash push -m "batch-a-2026-q3 pre-rollback"` (retains unrelated working changes). Verify stash is correct, then `git stash drop` once rollback is confirmed.
- **Committed (single commit):** Tag the pre-batch commit first: `git tag batch-a-2026-q3-before`. Then `git reset --hard HEAD~1`. To restore: `git reset --hard batch-a-2026-q3-before`.
- **Committed (multiple commits):** `git reset --hard batch-a-2026-q3-before` (requires a pre-batch tag).
- **Pushed / merged:** Cannot use `reset` — use `git revert -m 1 <merge-sha>` (see MAINTENANCE.md Rollback section).
- After rollback, run `npm ci` to restore lockfile-consistent dependencies.
- Then re-run all gates (`lint → build → unit → e2e`) to confirm the baseline is clean before starting a new batch.

## Notes

- Only one Upgrade Batch may be in flight at a time (AD-5)
- Each batch has exactly one owner (Nico as solo maintainer)
- Batch evidence is filed at `_bmad-output/implementation-artifacts/`
