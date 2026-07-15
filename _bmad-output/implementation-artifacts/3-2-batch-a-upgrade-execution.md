---
baseline_commit: 2ef18c78970d48d68c8dc1f804b93a59c44196ea
---

# Story 3.2: Runtime and Toolchain Batch A Upgrade Execution

Status: in-progress

## Story

As Nico,
I want to execute the first aggressive upgrade batch,
So that modernization progress begins with controlled risk.

## Acceptance Criteria

1. **AC1: Batch A packages are selected and scoped**
   Given the `npm outdated` report
   When Batch A is planned
   Then a batch evidence file is created from the template
   And every package in the batch has current and target versions recorded

2. **AC2: Compatible upgrades applied within safe range**
   Given selected Batch A packages
   When upgrades are applied
   Then all upgrades are within semver-compatible range (wanted, not latest major)
   And `npm install` completes without peer dependency conflicts

3. **AC3: All verification gates pass after upgrade**
   Given upgraded dependencies in Batch A
   When gates run in AD-3 order
   Then `lint → build → unit → e2e` all pass
   And results are recorded in the batch evidence artifact

4. **AC4: Full-batch rollback on gate failure**
   Given any gate fails after batch upgrades
   When rollback is triggered
   Then the entire batch is reverted per AD-5
   And rollback is documented in the batch evidence

## Tasks / Subtasks

- [x] **Task 1**: Plan Batch A scope and create evidence artifact (AC: 1)
  - [x] Run `npm outdated` and identify all within-range upgrade candidates
  - [x] Copy evidence template from `_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md` to a new batch file: `_bmad-output/implementation-artifacts/batch-a-2026-q3.md`
  - [x] Fill in batch name, owner (Nico), date, and status: planned → updated to in-progress
  - [x] Record current and target versions for each package in Batch A
  - [x] Review upstream changelogs for all planned upgrades (check for breaking changes or behavioral changes)

- [x] **Task 2**: Execute compatible dependency upgrades (AC: 2)
  - [x] Update each package to its semver-compatible target: `npm install <pkg>@<version>` for each
  - [x] Verify `npm install` completes without peer dependency conflicts or warnings
  - [x] Update evidence artifact scope table with actual installed versions after upgrade
  - [x] Set evidence status to in-progress

- [x] **Task 3**: Run verification gates in AD-3 order (AC: 3)
  - [x] `npm run lint` — 0 errors, 3 warnings (pre-existing) — PASS
  - [x] `npm run build` — builds successfully — PASS
  - [x] `npm run test:unit` — 55 passed — PASS
  - [x] `npm run test:e2e` — 26 passed — PASS
  - [x] Set overall gate status in evidence: pass
  - [x] All gates pass → proceeding to Task 4

- [ ] **Task 4**: Merge Batch A and file evidence (AC: 3)
  - [ ] Set evidence status to passed
  - [ ] Commit all changes with message: `batch-a: upgrade compatible dependencies to latest semver range`
  - [ ] Merge into main (or push feature branch for CI verification)
  - [ ] After merge, set evidence status to merged

- [ ] **Task 5**: Rollback Batch A on gate failure (AC: 4)
  - [ ] Execute full-batch rollback per AD-5 procedure (see evidence template rollback section)
  - [ ] Run `npm ci` to restore lockfile-consistent deps
  - [ ] Re-run gates to confirm clean baseline
  - [ ] Set evidence status to rolled-back
  - [ ] Document rollback reason in evidence

## Dev Notes

### Batch A Package Scope

Recommendation: Batch A covers **all semver-compatible** upgrades (packages where `npm outdated` shows `wanted != current` but staying within the specified semver range). These are low-risk and establish the workflow before tackling major upgrades in Batch B.

Based on current `npm outdated` output, Batch A candidates (non-major, within-range):

- `@types/node` — compatible minor/patch
- `@types/react` — compatible patch
- `eslint-plugin-react-hooks` — compatible minor
- `eslint-plugin-react-refresh` — compatible minor
- `react` — compatible patch
- `react-dom` — compatible patch
- `typescript-eslint` — compatible minor

Potential Batch A additions (no upgrade needed but verify):
- `@testing-library/jest-dom` — verify current version is compatible
- `@testing-library/react` — verify current version is compatible
- `@vitest/coverage-v8` — verify current version is compatible
- `jsdom` — verify current version is compatible
- `vitest` — verify current version is compatible
- `bootstrap` — verify current version is compatible
- `bootstrap-icons` — verify current version is compatible
- `react-bootstrap` — verify current version is compatible

**Explicitly excluded from Batch A** (save for Batch B — Story 3.3):
- `react-router` — major upgrade available (7.x → 8.x), may need compatibility work
- `eslint` — major upgrade available (9.x → 10.x), config migration needed
- `@eslint/js` — major upgrade available (9.x → 10.x), bundled with eslint upgrade
- `@vitejs/plugin-react` — major upgrade available (5.x → 6.x)
- `vite` — major upgrade available (7.x → 8.x)
- `typescript` — major upgrade available (5.x → 7.x), significant config impact
- `@playwright/test` — included if semver-compatible, verify after upgrade
- `globals` — major upgrade available (16.x → 17.x)
- `wait-on` — major upgrade available (8.x → 9.x)

See `_bmad-output/implementation-artifacts/deferred-work.md` for the deferred-major rationale ledger.

### Architecture Constraints

- **AD-5** (Upgrade Batch ownership and rollback): One owner (Nico), one evidence artifact per batch, full-batch rollback on failure, one batch in flight at a time.
- **AD-3** (Verification gate order): `lint → build → unit → e2e`. Batch merges only when all four gates pass.
- **FR-7, FR-8** are the functional requirements this story serves.

### Files to Create

- `_bmad-output/implementation-artifacts/batch-a-2026-q3.md` — Batch A evidence artifact (copy from template)

### Files to Modify

- `package.json` — version bumps from upgrades
- `package-lock.json` — updated lockfile

### Testing

- Run full gate suite after upgrades: `npm run lint && npm run build && npm run test:unit && npm run test:e2e`
- Pre-existing issue: `@rollup/rollup-darwin-arm64` missing (npm optional dependency bug) — unrelated to batch changes
- Pre-existing issue: Python 3.9.6 means `tomllib` not available for `resolve_customization.py` — unrelated

### Previous Story Intelligence (Story 3.1)

- Evidence template lives at `_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md`
- Template includes: batch identity, scope table, lifecycle steps, verification gates table, rollback log
- Rollback procedure uses `git stash push` for uncommitted changes, pre-batch tagging for committed
- Post-merge rollback uses `git revert -m 1` — see MAINTENANCE.md Rollback section
- Review findings from 3.1 all resolved; deferred items documented in `deferred-work.md`

### Project Structure Notes

- Evidence artifacts: `_bmad-output/implementation-artifacts/` (consistent with 3.1 convention)
- MAINTENANCE.md §5 points to the Upgrade Batch framework
- All gates pass on current baseline (pre-existing build error is an npm bug, not a code error)

### References

- [Source: ARCHITECTURE-SPINE.md#AD-3] Verification gate contract — lint → build → unit → e2e
- [Source: ARCHITECTURE-SPINE.md#AD-5] Upgrade Batch ownership and rollback contract
- [Source: epics.md#Epic-3] Epic 3 description and FR-7/FR-8 requirements
- [Source: PRD.md#FR-7] Upgrade batches with verification gates
- [Source: PRD.md#FR-8] Compatibility remediation for config and source
- [Source: _bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md] Evidence template
- [Source: MAINTENANCE.md#5] Dependency Maintenance — references Upgrade Batch workflow

## Dev Agent Record

### Agent Model Used

deepseek-v4-flash

### Debug Log References

### Completion Notes List

### File List

- `_bmad-output/implementation-artifacts/batch-a-2026-q3.md` (create — batch evidence)
- `package.json` (modify — dependency version bumps)
- `package-lock.json` (modify — lockfile update)

## Change Log
