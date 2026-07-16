# Upgrade Batch Evidence

## Batch Identity

| Field | Value |
|-------|-------|
| **Batch Name** | `batch-b-2026-q3` |
| **Owner** | Nico |
| **Created** | 2026-07-16 |
| **Status** | passed-merged |

## Scope — Package Changes

| Package | Current Version | Target Version | Change Type |
|---------|----------------|----------------|-------------|
| eslint | 9.39.5 | 10.7.0 | major — config migration needed |
| @eslint/js | 9.39.5 | 10.0.1 | major — config migration needed |
| vite | 7.3.6 | 8.1.5 | major — config migration needed |
| @vitejs/plugin-react | 5.2.0 | 6.0.3 | major — breaking plugin API changes |
| typescript | 5.9.3 | 6.0.3 | major — limited by typescript-eslint v8 peer dep (<6.1.0) |
| globals | 16.5.0 | 17.7.0 | major — eslint config dependency |
| wait-on | 8.0.5 | 9.0.10 | major |
| @types/node | 24.13.3 | 26.1.1 | major — type-only updates |
| eslint-plugin-react-refresh | 0.4.24 | 0.5.3 | major — check compatibility with ESLint 10.x |

**Upgrade deferred to later batch:**
| Package | Current | Reason |
|---------|---------|--------|
| react-router | 7.18.1 | Skipped — Story 3.4 removes this unused dependency |
| vitest | 4.1.10 | 5.x only in beta — no stable release |
| @vitest/coverage-v8 | 4.1.10 | Coupled to vitest — skip until vitest 5.x stable |
| esbuild | (bundled with vite) | Vite 8.x bundles compatible esbuild |
| jsdom | 29.1.1 | No newer stable version |

**Compatibility confirmed (no change needed):**
| Package | Current | Reason |
|---------|---------|--------|
| typescript-eslint | 8.64.0 | Compatible with TS 6.0.x per peer dep (<6.1.0) |
| eslint-plugin-react-hooks | 7.1.1 | Compatible with ESLint 10.x per peer dep |
| @types/react | 19.2.17 | No newer version needed |
| @types/react-dom | 19.2.3 | No newer version needed |

Before upgrading, review upstream changelogs for each package:
- [x] Changelogs reviewed for all planned upgrades
- [x] Breaking changes identified and assessed

After upgrading, record the **actual** installed version here.
| Package | Installed Version | Breaking Changes Noted |
|---------|-------------------|------------------------|
 | eslint | 10.7.0 | |
 | @eslint/js | 10.0.1 | |
 | vite | 8.1.5 | |
 | @vitejs/plugin-react | 6.0.3 | |
 | typescript | 6.0.3 | |
 | globals | 17.7.0 | |
 | wait-on | 9.0.10 | |
 | @types/node | 26.1.1 | |
 | eslint-plugin-react-refresh | 0.5.3 | |

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
| `npm run lint` | [x] pass / [ ] fail | 0 errors, 3 pre-existing warnings |
| `npm run build` | [x] pass / [ ] fail | Build successful |
| `npm run test:unit` | [x] pass / [ ] fail | 55 passed (matches baseline) |
| `npm run test:e2e` | [x] pass / [ ] fail | 26 passed (matches baseline) |
| **Overall** | [x] **pass** / [ ] **fail** | All gates pass |

All gates must pass for the batch to proceed. If any gate fails, rollback the entire batch.

## Rollback Log

| Date | Rollback Reason | Method | Post-rollback Gates Re-run |
|------|----------------|--------|---------------------------|
|      |                | [ ] `git stash` (uncommitted) / [ ] `git reset --hard HEAD~1` or tag (committed) / [ ] `git revert -m 1` (pushed/merged) | [ ] pass / [ ] fail / [ ] N/A |

**Rollback procedure:**
- **Uncommitted changes:** `git stash push -m "batch-b-2026-q3 pre-rollback"` (retains unrelated working changes). Verify stash is correct, then `git stash drop` once rollback is confirmed.
- **Committed (single commit):** Tag the pre-batch commit first: `git tag batch-b-2026-q3-before`. Then `git reset --hard HEAD~1`. To restore: `git reset --hard batch-b-2026-q3-before`.
- **Committed (multiple commits):** `git reset --hard batch-b-2026-q3-before` (requires a pre-batch tag).
- **Pushed / merged:** Cannot use `reset` — use `git revert -m 1 <merge-sha>` (see MAINTENANCE.md Rollback section).
- After rollback, run `npm ci` to restore lockfile-consistent dependencies.
- Then re-run all gates (`lint → build → unit → e2e`) to confirm the baseline is clean before starting a new batch.

## Notes

- Only one Upgrade Batch may be in flight at a time (AD-5)
- Each batch has exactly one owner (Nico as solo maintainer)
- Batch evidence is filed at `_bmad-output/implementation-artifacts/`
