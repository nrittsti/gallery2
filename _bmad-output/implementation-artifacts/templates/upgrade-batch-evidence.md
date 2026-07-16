# Upgrade Batch Evidence

## Batch Identity

| Field | Value |
|-------|-------|
| **Batch Name** | `batch-{letter}-{year}-q{quarter}` (e.g. `batch-a-2026-q3`) |
| **Owner** | Nico |
| **Created** | YYYY-MM-DD |
| **Status** | planned / in-progress / passed / merged / rolled-back / cancelled / deferred |

## Scope — Package Changes

| Package | Current Version | Target Version | Change Type |
|---------|----------------|----------------|-------------|
|         |                |                | [ ] major / [ ] minor / [ ] patch |
|         |                |                | [ ] major / [ ] minor / [ ] patch |

Before upgrading, review upstream changelogs for each package:
- [ ] Changelogs reviewed for all planned upgrades
- [ ] Breaking changes identified and assessed

After upgrading, record the **actual** installed version here.
| Package | Installed Version | Breaking Changes Noted |
|---------|-------------------|------------------------|
|         |                   |                        |

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
| `npm run lint` | [ ] pass / [ ] fail | |
| `npm run build` | [ ] pass / [ ] fail | |
| `npm run test:unit` | [ ] pass / [ ] fail | |
| `npm run test:e2e` | [ ] pass / [ ] fail | |
| **Overall** | [ ] **pass** / [ ] **fail** | |

All gates must pass for the batch to proceed. If any gate fails, rollback the entire batch.

## Rollback Log

| Date | Rollback Reason | Method | Post-rollback Gates Re-run |
|------|----------------|--------|---------------------------|
|      |                | [ ] `git stash` (uncommitted) / [ ] `git reset --hard HEAD~1` or tag (committed) / [ ] `git revert -m 1` (pushed/merged) | [ ] pass / [ ] fail / [ ] N/A |

**Rollback procedure:**
- **Uncommitted changes:** `git stash push -m "batch-xxx pre-rollback"` (retains unrelated working changes). Verify stash is correct, then `git stash drop` once rollback is confirmed.
- **Committed (single commit):** Tag the pre-batch commit first: `git tag batch-xxx-before`. Then `git reset --hard HEAD~1`. To restore: `git reset --hard batch-xxx-before`.
- **Committed (multiple commits):** `git reset --hard batch-xxx-before` (requires a pre-batch tag).
- **Pushed / merged:** Cannot use `reset` — use `git revert -m 1 <merge-sha>` (see MAINTENANCE.md Rollback section).
- After rollback, run `npm ci` to restore lockfile-consistent dependencies.
- Then re-run all gates (`lint → build → unit → e2e`) to confirm the baseline is clean before starting a new batch.

## Notes

- Only one Upgrade Batch may be in flight at a time (AD-5)
- Each batch has exactly one owner (Nico as solo maintainer)
- Batch evidence is filed at `_bmad-output/implementation-artifacts/`
