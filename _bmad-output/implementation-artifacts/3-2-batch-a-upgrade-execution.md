---
baseline_commit: 2ef18c78970d48d68c8dc1f804b93a59c44196ea
---

# Story 3.2: Runtime and Toolchain Batch A Upgrade Execution

Status: done

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

- [x] **Task 4**: Merge Batch A and file evidence (AC: 3)
  - [x] Set evidence status to passed → merged
  - [x] Commit all changes: `batch-a: upgrade compatible dependencies to latest semver range`
  - [x] Commit cc4b132 on main
  - [x] Evidence status updated to merged

- [ ] **Task 5**: Rollback Batch A on gate failure (AC: 4)
  - [ ] Execute full-batch rollback per AD-5 procedure (see evidence template rollback section)
  - [ ] Run `npm ci` to restore lockfile-consistent deps
  - [ ] Re-run gates to confirm clean baseline
  - [ ] Set evidence status to rolled-back
  - [ ] Document rollback reason in evidence

## Dev Notes

### Batch A Package Scope

Batch A covers **all semver-compatible** upgrades (packages where `npm outdated` showed `wanted != current` staying within the specified semver range). Upgraded packages:

| Package | From | To | Change Type |
|---------|------|----|-------------|
| react | ^19.2.0 | ^19.2.7 | patch |
| react-dom | ^19.2.0 | ^19.2.7 | patch |
| @types/react | ^19.2.5 | ^19.2.17 | minor |
| @types/node | ^24.10.1 | ^24.13.3 | minor |
| vite | ^7.2.4 | ^7.3.6 | minor |
| @vitejs/plugin-react | ^5.1.1 | ^5.2.0 | minor |
| eslint | ^9.39.1 | ^9.39.5 | patch |
| @eslint/js | ^9.39.1 | ^9.39.5 | patch |
| typescript-eslint | ^8.46.4 | ^8.64.0 | minor |
| eslint-plugin-react-hooks | ^7.0.1 | ^7.1.1 | minor |
| react-router | ^7.11.0 | ^7.18.1 | minor |
| @playwright/test | ^1.57.0 | ^1.61.1 | minor |

No config or source changes needed — all upgrades within compatible semver range.

**Deferred to Batch B (Story 3.3):**
- `eslint` 9.x → 10.x, `@eslint/js` 9.x → 10.x — config migration needed
- `@vitejs/plugin-react` 5.x → 6.x, `vite` 7.x → 8.x — breaking changes
- `typescript` 5.x → 7.x — significant TS config impact
- `globals` 16.x → 17.x, `wait-on` 8.x → 9.x
- `react-router` 7.x → 8.x — if config changes required
- `@playwright/test` — currently on 1.61.1

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

- Planned Batch A scope with 12 within-range upgrade candidates
- Created batch evidence at `_bmad-output/implementation-artifacts/batch-a-2026-q3.md`
- Upgraded 12 packages: react, react-dom, @types/react, @types/node, vite, @vitejs/plugin-react, eslint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, react-router, @playwright/test
- All 4 verification gates passed: lint (0 errors), build (success), unit (55/55), e2e (26/26)
- Chromium + Firefox browsers re-downloaded for Playwright 1.61.1 compatibility
- Batch committed as cc4b132 and evidence filed as merged

### File List

- `_bmad-output/implementation-artifacts/batch-a-2026-q3.md` (create — batch evidence)
- `package.json` (modify — dependency version bumps)
- `package-lock.json` (modify — lockfile update)
- `_bmad-output/implementation-artifacts/3-2-batch-a-upgrade-execution.md` (modify — story tracking)

## Senior Developer Review (AI)

### Review Findings

- [x] [Review][Patch] Dev Notes scope exclusion contradicts actual upgrade scope — 5 packages listed as "Explicitly excluded from Batch A" were upgraded within-range: react-router (7.11.0→7.18.1), eslint (9.39.2→9.39.5), @eslint/js (9.39.2→9.39.5), @vitejs/plugin-react (5.1.2→5.2.0), vite (7.3.0→7.3.6). Fixed: replaced speculative exclusion list with actual upgrade table. [`3-2-batch-a-upgrade-execution.md:103-112`]

- [x] [Review][Defer] typescript-eslint 18-minor version jump (8.50.1→8.64.0) — lint passed with 0 errors before and after, confirming no breaking config changes. General batch risk, not specific defect.
- [x] [Review][Defer] No npm outdated/audit output in evidence — scope was determined from npm outdated; evidence captures current/target. Minor documentation improvement.
- [x] [Review][Defer] Lockfile drift risk from caret ranges — standard npm behavior; `npm ci` enforces lockfile. General concern, not batch-specific.

## Change Log

- Executed Batch A: 12 compatible dependency upgrades, all gates passed, committed as cc4b132
