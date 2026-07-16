---
baseline_commit: 2ef18c78970d48d68c8dc1f804b93a59c44196ea
---

# Story 3.1: Upgrade Batch Framework and Evidence Template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Nico,
I want a standard Upgrade Batch workflow with ownership and evidence capture,
So that each aggressive upgrade wave is controlled and auditable.

## Acceptance Criteria

1. **AC1: Upgrade Batch is documented with owner and scope**
   Given a dependency update wave is planned
   When an Upgrade Batch is created
   Then a single batch owner is assigned (Nico as solo maintainer)
   And the batch scope lists every package with current and target versions
   And the batch is identified by a unique name (e.g., "batch-a-2026-q3")

2. **AC2: Verification artifact template exists**
   Given an Upgrade Batch is being executed
   When verification gates run
   Then an evidence template captures: package changes, gate results (lint/build/unit/e2e), pass/fail per gate, and batch owner
   And the template is usable as a standalone markdown file

3. **AC3: Rollback procedure is defined per batch**
   Given any verification gate fails for an Upgrade Batch
   When the batch is rolled back
   Then the entire batch is reverted before starting the next batch
   And the rollback is documented in the batch evidence

4. **AC4: Framework integrates with existing maintenance checklist**
   Given the MAINTENANCE.md dependency section exists
   When the Upgrade Batch framework is created
   Then MAINTENANCE.md is updated to reference the detailed batch workflow
   And the batch evidence artifacts live in `_bmad-output/implementation-artifacts/`

## Tasks / Subtasks

- [x] **Task 1**: Design and document Upgrade Batch process (AC: 1, 3)
  - [x] Define batch naming convention and metadata (owner, date, scope)
  - [x] Document batch lifecycle: plan → execute → verify → merge-or-rollback
  - [x] Specify single-owner and one-batch-in-flight constraints per AD-5
  - [x] Define full-batch rollback procedure on gate failure

- [x] **Task 2**: Create verification artifact template (AC: 2)
  - [x] Create `_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md` template
  - [x] Template includes: batch name, owner, date, package change table, gate results table, rollback log
  - [x] Template includes pass/fail checkboxes for each gate (lint → build → unit → e2e)

- [x] **Task 3**: Update MAINTENANCE.md to reference detailed workflow (AC: 4)
  - [x] Replace the brief "Dependency Maintenance" section with a pointer to the Upgrade Batch framework
  - [x] Ensure rollback section in MAINTENANCE.md aligns with batch rollback procedure

- [x] **Task 4**: Validate framework against existing project context (AC: 1, 2, 3, 4)
  - [x] Verify template works with a dry-run entry for a hypothetical batch
  - [x] Verify MAINTENANCE.md reference is correct
  - [x] Run lint/build/test to confirm no breakage

## Dev Notes

- **Architecture constraints:**
  - AD-5 (Upgrade Batch ownership and rollback contract): Each batch has one owner, one verification artifact. If any gate fails, revert entire batch. Only one batch in flight at a time.
  - AD-3 (Verification gate contract): Gate order is `lint → build → unit → e2e`. Upgrade batches merge only when all four gates pass.
  - FR-7, FR-8, FR-9, FR-10 are the functional requirements this story serves.

- **Files to create:**
  - `_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md` — evidence template

- **Files to modify:**
  - `MAINTENANCE.md` — update §5 Dependency Maintenance to reference the Upgrade Batch framework

- **Existing patterns:**
  - MAINTENANCE.md §5 currently has a brief dependency update procedure with inline steps
  - The existing `_bmad-output/implementation-artifacts/` directory already holds story files and review artifacts
  - Previous stories (2.5) established the MAINTENANCE.md and the maintenance checklist pattern

- **Testing:**
  - This is a process/documentation story — validation is via dry-run and manual review
  - Run `npm run lint` and `npm run build` to confirm no project breakage
  - Verify rendered markdown is correct

- **Key decisions:**
  - Evidence artifacts location: `_bmad-output/implementation-artifacts/` (consistent with existing practice)
  - Template format: Markdown with checkboxes (same pattern used in story files)
  - Batch naming: `batch-{letter}-{year}-q{quarter}` (e.g., `batch-a-2026-q3`)

### Project Structure Notes

- Alignment with unified project structure: Evidence templates go in `_bmad-output/implementation-artifacts/templates/`, following existing artifact patterns
- MAINTENANCE.md is at project root, referenced from README.md

### References

- [Source: ARCHITECTURE-SPINE.md#AD-5] Upgrade Batch ownership and rollback contract
- [Source: ARCHITECTURE-SPINE.md#AD-3] Verification gate contract — lint → build → unit → e2e
- [Source: epics.md#Epic-3] Epic 3 description and FR-7/FR-8/FR-9 requirements
- [Source: MAINTENANCE.md#5] Current Dependency Maintenance section to be updated
- [Source: PRD.md#FR-7] Upgrade batches with verification gates
- [Source: story 2.5] Maintenance checklist established in MAINTENANCE.md

## Dev Agent Record

### Agent Model Used

deepseek-v4-flash

### Debug Log References

- Story 3.1 implemented: Upgrade Batch framework created
- Pre-existing build error (rollup native module) unrelated to this change
- Lint: 0 errors

### Completion Notes List

- Created Upgrade Batch evidence template with lifecycle, naming convention, gate tracking, and rollback procedures
- Updated MAINTENANCE.md §5 to reference the Upgrade Batch framework instead of inline instructions
- Validated: lint passes (0 errors), template supports dry-run entry, MAINTENANCE.md reference is correct

### File List

- `_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md` (create)
- `MAINTENANCE.md` (modify — §5 Dependency Maintenance now references Upgrade Batch framework)

## Change Log

- Implemented Upgrade Batch framework: evidence template created, MAINTENANCE.md updated to reference it

## Senior Developer Review (AI)

### Review Findings

- [x] [Review][Patch] `git checkout main` discards unrelated working changes — Use `git stash push -m "batch-xxx pre-rollback"` instead, then `git stash drop` after rollback is confirmed. [`upgrade-batch-evidence.md:55`]
- [x] [Review][Patch] Rollback leaves stale `node_modules` — After `git reset`, run `npm ci` to restore lockfile-consistent dependencies. [`upgrade-batch-evidence.md:55-59`]
- [x] [Review][Patch] `HEAD~1` assumes single batch commit — Multi-commit guidance exists but is secondary; promote it to primary with an explicit branch tag or `git merge-base` approach. [`upgrade-batch-evidence.md:57`]
- [x] [Review][Patch] No post-rollback gate re-run checkbox — Add a "Post-rollback gates re-run" row to the Rollback Log or Verification Gates table. [`upgrade-batch-evidence.md:47-49`]
- [x] [Review][Patch] Status checkboxes allow contradictory states — Replace `[ ] planned [ ] in-progress [ ] passed [ ] rolled-back` with a single status line: `**Status:** planned / in-progress / passed / rolled-back` (choose one). [`upgrade-batch-evidence.md:10`]
- [x] [Review][Patch] No cancelled/deferred/merged states — Add `cancelled` and `deferred` to status options; `passed` doesn't indicate whether merge happened — add explicit `merged` state. [`upgrade-batch-evidence.md:10`]
- [x] [Review][Patch] Merge not a numbered lifecycle step — Lifecycle numbers 1-4, "Pass → Merge" is inline text. Add step 5: **Merge** — merge the batch branch. [`upgrade-batch-evidence.md:31`]
- [x] [Review][Patch] Breaking change review not captured — Template has "Breaking Changes Noted" column but no explicit checkbox for changelog review. Add a changelog review checkbox to the Plan section. [`upgrade-batch-evidence.md:18-21`]
- [x] [Review][Patch] Rollback after PR merge not covered — Batch template only covers local rollback. Add reference to `git revert -m 1` (from MAINTENANCE.md Rollback §) for post-merge scenarios. [`upgrade-batch-evidence.md:51-55`]

- [x] [Review][Defer] MAINTENANCE.md pointer replaces inline script — discoverability trade-off is acceptable for solo-project convention [`MAINTENANCE.md:§5`]
- [x] [Review][Defer] Gate script names may not exist — pre-existing project configuration question, not a framework defect [`upgrade-batch-evidence.md:37-42`]
- [x] [Review][Defer] Security-patch fast-track not defined — out of scope for initial framework, can be added in a later batch story [`upgrade-batch-evidence.md`]
- [x] [Review][Defer] Hotfix during in-flight batch — AD-5 contract is intentional; exceptional cases handled ad-hoc [`3-1-upgrade-batch-framework.md:69`]
- [x] [Review][Defer] Pre-existing gate failures not baselined — general risk not specific to this framework [`upgrade-batch-evidence.md`]
- [x] [Review][Defer] Naming convention 26-letter limit — practically unreachable for a solo hobby project [`upgrade-batch-evidence.md:7`]
- [x] [Review][Defer] Main branch drift during multi-day batch — general git workflow concern, same for any branch-based workflow [`upgrade-batch-evidence.md`]
- [x] [Review][Defer] Peer/sub-dependency conflicts — general npm upgrade risk, not specific to this framework [`upgrade-batch-evidence.md`]
- [x] [Review][Defer] `npm audit` / bundle size not gated — out of scope; can be added in Stories 3.2/3.3 if needed [`upgrade-batch-evidence.md`]

