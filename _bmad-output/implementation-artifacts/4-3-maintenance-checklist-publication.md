---
baseline_commit: 38dfd3f
---

# Story 4.3: Maintenance Checklist Publication and Home Selection

Status: review

## Story

As Nico,
I want the maintenance checklist finalized in its long-term location,
So that future updates follow one canonical workflow.

## Acceptance Criteria

1. **AC1: Canonical location selected**
   Given the maintenance checklist content is already validated in dry runs
   When publication is completed
   Then one canonical location is selected from: `README` (inline or section) or a dedicated docs workflow page
   And the decision is recorded in the project

2. **AC2: All references point to canonical location**
   Given the canonical location has been selected
   When references are audited
   Then every doc, story, and artifact that references maintenance procedures points to the canonical location
   And no stale or duplicate maintenance instructions exist outside it

3. **AC3: Canonical content is final**
   Given the canonical location is selected and references are updated
   When the content is reviewed
   Then the maintenance checklist is complete, accurate, and ready for the next maintenance cycle
   And the deferred major-ledger, upgrade batch evidence, and regression closure log are all discoverable from the canonical location

## Tasks / Subtasks

- [x] **Task 1**: Resolve canonical location decision
  - [x] Present options to Nico: (a) keep MAINTENANCE.md as standalone, linked from README, (b) inline full checklist into README, (c) move to a `docs/` workflow page
  - [x] Record the decision in the story file once made
  - [x] Update ARCHITECTURE-SPINE.md deferred items if applicable

- [x] **Task 2**: Audit all cross-references
  - [x] Search codebase for all references to maintenance procedures, MAINTENANCE.md, and the upgrade batch workflow
  - [x] Verify README.md link to MAINTENANCE.md is correct (currently at `README.md:118`)
  - [x] Verify MAINTENANCE.md §5 references the upgrade batch framework correctly (currently points to `_bmad-output/implementation-artifacts/templates/upgrade-batch-evidence.md`)
  - [x] Check batch evidence files (batch-a, batch-b) for MAINTENANCE.md references
  - [x] Check deferred-work.md, deferred-major-ledger.md for any stale maintenance references
  - [x] Update any broken or stale references — none found, all existing references are correct

- [x] **Task 3**: Finalize canonical content
  - [x] Review MAINTENANCE.md for completeness: covers photo prep, verification, deployment, smoke check, dependency maintenance, rollback
  - [x] Ensure the deferred-major-ledger.md, upgrade batch evidence, and regression closure log are discoverable from the canonical location
  - [x] Verify no duplicate instructions exist between README and MAINTENANCE.md — README has quick reference, MAINTENANCE.md has detailed checklist; both serve distinct purposes
  - [x] Add link to regression-closure-log.md from the canonical location for end-of-cycle context

- [x] **Task 4**: Update sprint status
  - [x] Mark story as done in sprint-status.yaml
  - [x] Ensure epic-4-retrospective is noted as optional

### Decision Record

**Canonical location:** `MAINTENANCE.md` (standalone at project root, linked from README.md)

Nico chose to keep MAINTENANCE.md as the standalone canonical location. The remaining tasks are:
- Audit cross-references to ensure everything points to MAINTENANCE.md
- Add discoverability links from MAINTENANCE.md to deferred-major-ledger, regression closure log, and upgrade batch evidence
- Resolve the architecture deferred item

## Dev Notes

### FR Binding

- **FR-12** (Maintenance workflow documentation) is the primary functional requirement
- PRD consequences: "Documentation defines repeatable update flow and required verification steps" and "A first dry run follows the documented workflow successfully"
- FR-12 binds to AD-3 (verification gate order) and AD-5 (upgrade batch ownership)

### Current State

- MAINTENANCE.md exists at project root since Story 2.5, already contains full checklist
- README.md has a link to MAINTENANCE.md at line 118 in the "Adding New Photos" section
- MAINTENANCE.md has been updated by Stories 3.1 (batch framework ref) and 2.5 code review (P1-P9 fixes)
- PRD Open Question #2: "Which documentation location should be the long-term home for the maintenance checklist (README vs docs workflow page)?"
- Architecture (deferred): "Choosing long-term home for maintenance checklist pending owner preference"

### Architecture Constraints

- **AD-3** (Verification gate order): Checklist must document correct gate order: lint → build → unit → e2e
- **AD-5** (Upgrade batch ownership): Dependency section must reference the batch framework

### What NOT to Do

- Do NOT modify any source code or configuration — documentation only
- Do NOT change the content of MAINTENANCE.md beyond what the canonical location decision requires
- Do NOT remove existing README content — only add or update references

### Previous Story Intelligence (Story 4.2)

- Regression closure log created at `regression-closure-log.md` — should be discoverable from the canonical maintenance location
- 48 issues tracked, 21 deferred items in the ledger
- Known deferred items (vitest, TS 7.x, etc.) should be referenced from the maintenance docs for revisit tracking

### References

- [Source: epics.md#Story-4.3] Story 4.3 acceptance criteria
- [Source: PRD.md#FR-12] FR-12 — Maintenance workflow documentation
- [Source: PRD.md#8] Open Question #2 — checklist home location
- [Source: ARCHITECTURE-SPINE.md#AD-3] Verification gate contract
- [Source: ARCHITECTURE-SPINE.md#AD-5] Upgrade Batch ownership
- [Source: ARCHITECTURE-SPINE.md#Deferred] Long-term home for checklist
- [Source: MAINTENANCE.md] Current maintenance checklist
- [Source: README.md] Current README with link to MAINTENANCE.md
- [Source: _bmad-output/implementation-artifacts/regression-closure-log.md] Regression closure log
- [Source: _bmad-output/implementation-artifacts/deferred-major-ledger.md] Deferred upgrade decisions

## Senior Developer Review (AI)

TBD

## Dev Agent Record

### Baseline Requirements

- Documentation-only story
- Decision needed: where should the canonical checklist live?
- Audit and update cross-references

### Completion Notes List

- Canonical location decision: MAINTENANCE.md standalone (Nico confirmed)
- Cross-reference audit: all existing references correct, none stale
- MAINTENANCE.md updated: added Cycle Artifacts section referencing deferred-major-ledger, regression-closure-log, upgrade batch template, and final verification
- ARCHITECTURE-SPINE.md: resolved deferred item about checklist location
- No duplicate instructions found between README and MAINTENANCE.md — quick reference vs detailed checklist serve distinct purposes

### File List

- `_bmad-output/implementation-artifacts/4-3-maintenance-checklist-publication.md` (create — story file, tasks marked complete)
- `MAINTENANCE.md` (modify — added Cycle Artifacts section for discoverability)
- `_bmad-output/planning-artifacts/architecture/architecture-Gallery-2026-06-27/ARCHITECTURE-SPINE.md` (modify — resolved deferred item)

## Change Log

- Canonical location decision: MAINTENANCE.md standalone, confirmed by Nico
- MAINTENANCE.md: added Cycle Artifacts section linking to deferred-major-ledger, regression-closure-log, upgrade batch template, final verification
- ARCHITECTURE-SPINE.md: resolved deferred item about checklist location
