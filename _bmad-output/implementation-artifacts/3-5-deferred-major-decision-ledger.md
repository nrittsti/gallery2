---
baseline_commit: 0ed0dbb
---

# Story 3.5: Deferred-Major Decision Ledger

Status: done

## Story

As Nico,
I want explicit rationale for each deferred major upgrade,
So that deferrals are intentional and revisitable instead of accidental.

## Acceptance Criteria

1. **AC1: Deferred upgrades documented with full rationale**
   Given one or more major dependency upgrades that could not be safely completed in-cycle
   When each deferral is recorded in the ledger
   Then the entry includes the package name, current version, deferred target version, reason for deferral, risk assessment, and revisit trigger
   And if zero deferred majors exist, the ledger states "No deferred majors at this time" with a timestamp

2. **AC2: No major deferral remains undocumented**
   Given the current dependency state after all Epic 3 upgrade batches
   When the ledger is audited against installed dependencies
   Then every major-version upgrade that was intentionally skipped has a corresponding ledger entry
   And packages at latest compatible versions (no newer major available) are explicitly noted as current
   And the audit distinguishes between skipped majors, removed packages, and packages at latest (no newer major exists)

## Tasks / Subtasks

- [x] **Task 1**: Inventory all deferred major upgrades from upgrade batches (AC: 2)
  - [x] Run `npm install` first to ensure lockfile reflects current state after Story 3.4
  - [x] Review Batch A evidence (`batch-a-2026-q3.md`) for deferred items — noted explicitly "No deferred items"
  - [x] Review Batch B evidence (`batch-b-2026-q3.md`) for deferred items
  - [x] Check Story 3.3 Dev Notes for excluded packages
  - [x] Run `npm outdated` on current HEAD — discovered TypeScript 7.0.2 as new deferred major
  - [x] Cross-reference against current `package.json` to confirm which packages have newer majors available

- [x] **Task 2**: Create deferred-major decision ledger document (AC: 1)
  - [x] Create `_bmad-output/implementation-artifacts/deferred-major-ledger.md`
  - [x] For each deferred package, documented: package name, current/deferred versions, reason, risk, revisit trigger, next check date, upgrade procedure
  - [x] Added a "Removed Packages" subsection for `react-router` removed in Story 3.4
  - [x] Added a section for packages at latest compatible versions

- [x] **Task 3**: Verify completeness and cross-reference (AC: 2)
  - [x] Verify every deferred package from upgrade batches has an entry — 3 deferred (vitest, @vitest/coverage-v8, typescript), 22 at latest (full list in ledger)
  - [x] Verify `npm outdated` shows no unexpected missed majors — only TypeScript 7.x newly discovered, documented
  - [x] Added comment in `sprint-status.yaml` pointing to ledger

## Dev Notes

### Known Deferred Major Upgrades

| Package | Current | Deferred Target | Reason | Risk | Revisit Trigger | Next Check Date |
|---------|---------|----------------|--------|------|----------------|-----------------|
| vitest | 4.1.10 | 5.x | 5.x only in beta — no stable release yet | Staying on 4.x means missing 5.x perf/feature improvements; minor security patches still land on 4.x | vitest 5.x stable release | 2026-Q4 |
| @vitest/coverage-v8 | 4.1.10 | 5.x | Must follow vitest version | Same as vitest | vitest 5.x stable release | 2026-Q4 |
| typescript | 6.0.3 | 7.0.2 | typescript-eslint v8 peer dep requires <6.1.0 | Medium — TS 6.x still receives patches; missing TS 7.x features | typescript-eslint publishes TS 7.x-compatible version | 2026-Q4 |

### Removed Packages (no longer in dependency tree)

| Package | Current Version (removed) | Reason |
|---------|--------------------------|--------|
| react-router | 7.18.1 | Confirmed unused — removed in Story 3.4 |

**Note:** Removed packages are tracked separately from deferred upgrades. They have no revisit trigger because they are no longer in the dependency tree.

### Architecture Constraints

- **AD-5** (Upgrade Batch ownership): Each batch has one owner, one evidence artifact. The ledger serves as the cumulative record of deferrals across batches.
- **FR-9** is the functional requirement this story serves (PRD FR-9: Deferred-major rationale capture)
- **AD-3** is not directly relevant — this story produces documentation, not code changes

### Procedure on Revisit Trigger

When a deferred upgrade's revisit trigger fires (e.g., vitest 5.x stable releases):
1. Create a new Upgrade Batch following AD-5 (single owner, one batch in flight)
2. Record the package in the batch evidence template
3. Run verification gates in AD-3 order: `lint → build → unit → e2e`
4. If all gates pass, update the ledger to reflect the upgrade status
5. If gates fail, document the new reason and update the revisit trigger

### Package Scope Boundaries

- Only **major-version** upgrade deferrals are in scope for this ledger
- Minor and patch upgrades are handled through normal `npm update` and are not tracked here
- Use `npm view <pkg> versions` to distinguish "no newer major exists" from "newer major available but deferred"

### Documentation-Only Story

- This story produces a single new document: `_bmad-output/implementation-artifacts/deferred-major-ledger.md`
- No source code files are modified
- No dependencies are changed
- Run `npm outdated` to verify no majors were missed, but do not perform any upgrades

### What NOT to Do

- Do NOT upgrade any packages — this is documentation only
- Do NOT modify `package.json` or `package-lock.json`
- Do NOT run upgrade batches — the ledger documents why upgrades were deferred

### Previous Story Intelligence (Story 3.4)

- Story 3.4 removed `react-router` (confirmed unused, zero imports)
- No additional deferred majors were identified during Story 3.4
- Current verification baseline: lint 0 errors, build OK, unit 55/55, e2e 26/26
- Verification gates are not needed for this documentation-only story

### References

- [Source: epics.md#Story-3.5] Story 3.5 acceptance criteria
- [Source: ARCHITECTURE-SPINE.md#AD-5] Upgrade Batch ownership contract
- [Source: PRD.md#FR-9] FR-9 — Deferred-major rationale capture
- [Source: batch-b-2026-q3.md] Batch B evidence with deferred upgrades table (lines 26-33)
- [Source: 3-3-batch-b-compatibility-remediation.md] Story 3.3 Dev Notes excluded packages table
- [Source: _bmad-output/project-context.md] Project implementation rules
- [Source: package.json] Current dependency state

## Senior Developer Review (AI)

### Action Items

- [x] [Review][Patch] Sprint status: moved ledger reference from comment to real YAML key `deferred_major_ledger`
- [x] [Review][Patch] Dev Notes: split deferred table and at-latest packages — removed jsdom/esbuild from deferred table
- [x] [Review][Patch] Task 3 text: fixed "2 at latest" to reflect 22-entry ledger
- [x] [Review][Patch] Ledger: added Change Log section and Audit Methodology section
- [x] [Review][Patch] Ledger: changed "Quarterly" to concrete "2026-Q4" dates
- [x] [Review][Patch] @vitest/coverage-v8: changed target from "(coupled)" to "5.x"
- [x] [Review][Patch] Typescript: changed target from "7.x" to specific "7.0.2"
- [x] [Review][Patch] Sprint status: updated stale comment timestamp
- [x] [Review][Patch] Completion Notes: rephrased "22 direct dependencies" to "22 packages"

## Dev Agent Record

### Agent Model Used

deepseek-v4-flash

### Debug Log References

- Batch A: no deferred items (all upgrades completed in batch)
- Batch B: vitest 5.x in beta, jsdom at latest, esbuild bundled — documented
- npm outdated: discovered TypeScript 7.0.2 (new deferred major) — constrained by typescript-eslint v8 peer dep
- 22 direct dependencies confirmed at latest compatible major versions

### Completion Notes List

- Created deferred-major-ledger.md with 3 deferred entries, 22 packages at latest compatible versions, and 1 removed package entry
- Discovered TypeScript 7.0.2 as newly available deferred major (was 6.0.3 from Batch B)
- Added audit methodology section documenting npm outdated + npm view verification
- Documentation-only story — no source code or dependency files modified

### File List

- `_bmad-output/implementation-artifacts/3-5-deferred-major-decision-ledger.md` (modify — story file, tasks marked complete)
- `_bmad-output/implementation-artifacts/deferred-major-ledger.md` (create — deferred-major decision ledger document)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modify — added ledger reference comment)

## Change Log

- Created Story 3.5 with deferred-major decision ledger scope, inventory of all known deferred upgrades from Batch A/B
- Created `deferred-major-ledger.md` with 3 deferred entries (vitest, @vitest/coverage-v8, TypeScript 7.x), 22 packages at latest compatible versions, and 1 removed package entry (react-router)
- Discovered TypeScript 7.0.2 as newly available deferred major via `npm outdated`
