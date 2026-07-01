---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-Gallery-2026-06-27/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-Gallery-2026-06-27/ARCHITECTURE-SPINE.md
---

# Gallery - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Gallery, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Run Baseline Checks and capture pass/fail status before and after reliability fixes.
FR2: Ensure Lightbox works without crashes when Photo Record metadata fields are missing or malformed.
FR3: Remove confirmed unused runtime dependencies and keep build/tests passing.
FR4: Integrate Unit Test Suite for React + TypeScript + Vite in local and CI workflows.
FR5: Add tests for Photo Record filtering and sorting behavior used by Gallery.
FR6: Add tests for Lightbox interaction boundaries and keyboard navigation paths.
FR7: Apply dependency upgrades in Upgrade Batches with verification after each batch.
FR8: Maintain compatibility across TypeScript, Vite, ESLint, and test setup after upgrades.
FR9: Record explicit rationale for any deferred major dependency upgrade.
FR10: Resolve remaining regressions and pass final Baseline Checks on release candidate state.
FR11: Improve script/data resilience for malformed metadata and path anomalies.
FR12: Document and validate a repeatable maintenance and release checklist.

### NonFunctional Requirements

NFR1: Reliability - no known Lightbox crash path caused by incomplete Photo Record metadata.
NFR2: Performance - gallery load and lightbox open interactions remain within accepted E2E assertion thresholds.
NFR3: Maintainability - every major dependency change is traceable to verification outcomes.
NFR4: Reproducibility - local and CI baseline commands produce consistent pass/fail outcomes.

### Additional Requirements

- No starter template requirement is specified in Architecture; this is brownfield evolution.
- Enforce layered dependency direction: UI -> hooks/context -> data/source adapters (AD-1).
- Keep cross-component state ownership in FilterContext and LightboxContext; clear-year sentinel is `null` only (AD-2).
- Enforce verification gate order for each batch: `lint -> build -> unit -> e2e`; shape changes require contract tests (AD-3).
- Treat Photo Record metadata as optional at render boundaries and enforce normalized adapter output schema (AD-4).
- Run Upgrade Batches with single owner, single verification artifact, and full-batch rollback on gate failure (AD-5).
- Revalidate lightbox selection atomically after filter/data changes; stale index navigation is forbidden (AD-6).

### UX Design Requirements

No UX design contract found for this run (`DESIGN.md` + `EXPERIENCE.md` pair or legacy UX document).

### FR Coverage Map

FR1: Epic 2 and Epic 4 - baseline checks and final operational closure.
FR2: Epic 1 - lightbox failsafe behavior with incomplete metadata.
FR3: Epic 3 - remove confirmed unused runtime dependency.
FR4: Epic 2 - integrate unit-test toolchain into local and CI workflows.
FR5: Epic 1 - validate filtering and sorting behavior for Photo Record data.
FR6: Epic 1 and Epic 2 - preserve lightbox boundaries and test coverage.
FR7: Epic 3 - dependency upgrades via controlled Upgrade Batches.
FR8: Epic 3 - compatibility remediation across TypeScript, Vite, ESLint, and tests.
FR9: Epic 3 - document rationale for deferred major upgrades.
FR10: Epic 1, Epic 2, Epic 3, and Epic 4 - resolve regressions and reach release-candidate stability.
FR11: Epic 1 - improve script and data resilience for metadata/path anomalies.
FR12: Epic 2 and Epic 4 - produce and validate repeatable maintenance checklist.

## Epic List

### Epic 1: Reliable Gallery Interaction Foundation
Deliver a crash-resistant gallery and lightbox experience that remains stable with imperfect metadata and consistent state behavior.
**FRs covered:** FR2, FR5, FR6, FR10, FR11

### Epic 2: Quality Gate and Test Foundation
Establish confidence to change the app safely through a consistent verification flow and strong automated test foundation.
**FRs covered:** FR1, FR4, FR6, FR10, FR12

### Epic 3: Aggressive Dependency Modernization with Safety Gates
Modernize dependencies aggressively in verified batches while preserving runtime stability and explicit deferral decisions.
**FRs covered:** FR3, FR7, FR8, FR9, FR10

### Epic 4: Workflow Hardening and Operational Closure
Finalize the maintenance/release workflow and close the cycle with an all-green release-candidate verification pass.
**FRs covered:** FR1, FR10, FR12

## Epic 1: Reliable Gallery Interaction Foundation

Deliver a crash-resistant gallery and lightbox experience that remains stable with imperfect metadata and consistent state behavior.

### Story 1.1: Metadata-Safe Lightbox Rendering

As a visitor,
I want Lightbox to render safely even when photo metadata is incomplete,
So that I can browse without crashes.

**Acceptance Criteria:**

**Given** a Photo Record with one or more missing optional metadata fields
**When** the visitor opens Lightbox for that photo
**Then** the Lightbox renders without runtime error
**And** each missing field displays a safe fallback value without breaking layout.

### Story 1.2: Filter and Lightbox State Synchronization

As a visitor,
I want lightbox selection to stay valid when filters or photo data change,
So that navigation always targets a valid current photo.

**Acceptance Criteria:**

**Given** an open Lightbox and a filter or data change that updates the visible photo set
**When** selection is re-evaluated
**Then** the selected photo is atomically revalidated against the current filtered set
**And** Lightbox closes or repositions safely when the previous selection no longer exists.

### Story 1.3: Deterministic Photo Derivation and Ordering

As a visitor,
I want year filtering and ordering to be consistent,
So that browsing behavior is predictable across sessions.

**Acceptance Criteria:**

**Given** Photo Records across multiple years
**When** a year filter is applied or cleared using the `null` sentinel
**Then** only matching records are shown (or all records when cleared)
**And** the displayed order follows the defined deterministic sort contract.

### Story 1.4: Script and Data Resilience for Metadata and Path Anomalies

As Nico,
I want photo data preparation to handle malformed metadata and OS artifact files,
So that publishing updates remains reliable with less manual cleanup.

**Acceptance Criteria:**

**Given** malformed metadata entries and artifact files such as `._*` in the input set
**When** the script and data flow runs
**Then** anomalies are handled per policy without hard crash
**And** resulting Photo Records are still consumable by app hooks and components.

## Epic 2: Quality Gate and Test Foundation

Establish confidence to change the app safely through a consistent verification flow and strong automated test foundation.

### Story 2.1: Standardized Verification Command Set

As Nico,
I want one canonical command set for lint, build, unit, and e2e checks,
So that local and CI verification are consistent.

**Acceptance Criteria:**

**Given** the repository scripts configuration
**When** verification commands are run locally
**Then** lint, build, unit, and e2e checks are each executable via documented npm scripts
**And** command names and behavior align with CI.

### Story 2.2: Unit Test Toolchain Integration for React, TypeScript, and Vite

As Nico,
I want a working unit-test stack integrated into the project,
So that core component and hook behavior is validated quickly.

**Acceptance Criteria:**

**Given** the unit-test toolchain configuration
**When** unit tests execute
**Then** the runner works with the existing React + TypeScript + Vite setup without config conflicts
**And** test failures are reported in a format usable in local and CI contexts.

### Story 2.3: Core Behavior Unit Coverage for Hooks and Lightbox Boundaries

As Nico,
I want unit coverage for filtering, sorting, and lightbox boundary interactions,
So that regressions are caught before browser-level tests.

**Acceptance Criteria:**

**Given** test data across multiple years and boundary index conditions
**When** the unit suite runs
**Then** tests validate year filter behavior, deterministic ordering, and boundary-safe lightbox navigation
**And** the suite includes at least one missing-metadata safety scenario.

### Story 2.4: CI Gate Order Enforcement and Contract-Test Triggering

As Nico,
I want CI to enforce gate order and contract tests for shape-impacting changes,
So that risky changes cannot merge without compatibility evidence.

**Acceptance Criteria:**

**Given** a change batch in CI
**When** pipeline checks execute
**Then** checks run in order `lint -> build -> unit -> e2e`
**And** changes touching context contracts, adapter schema, or hook output shape require contract tests to pass.

### Story 2.5: Maintenance Checklist Draft and Dry-Run Validation

As Nico,
I want a documented maintenance checklist validated through a dry run,
So that release steps are repeatable and low-risk.

**Acceptance Criteria:**

**Given** a drafted maintenance checklist
**When** a full dry run is performed
**Then** each checklist step is executable and produces expected verification evidence
**And** any missing or ambiguous steps are corrected before sign-off.

## Epic 3: Aggressive Dependency Modernization with Safety Gates

Modernize dependencies aggressively in verified batches while preserving runtime stability and explicit deferral decisions.

### Story 3.1: Upgrade Batch Framework and Evidence Template

As Nico,
I want a standard Upgrade Batch workflow with ownership and evidence capture,
So that each aggressive upgrade wave is controlled and auditable.

**Acceptance Criteria:**

**Given** an upcoming dependency update wave
**When** a new Upgrade Batch is created
**Then** a single batch owner is assigned and recorded
**And** a verification artifact template exists for package changes and gate results.

### Story 3.2: Runtime and Toolchain Batch A Upgrade Execution

As Nico,
I want to execute the first aggressive upgrade batch,
So that modernization progress begins with controlled risk.

**Acceptance Criteria:**

**Given** selected dependencies for Batch A
**When** upgrades are applied
**Then** `lint -> build -> unit -> e2e` all pass
**And** any failure triggers full-batch rollback before further upgrades.

### Story 3.3: Runtime and Toolchain Batch B Compatibility Remediation

As Nico,
I want to apply the next upgrade batch with necessary code and configuration fixes,
So that major-version compatibility issues are resolved safely.

**Acceptance Criteria:**

**Given** Batch B includes packages requiring compatibility updates
**When** configuration or source remediations are implemented
**Then** TypeScript, Vite, ESLint, and test configurations remain coherent
**And** all verification gates pass for the batch.

### Story 3.4: Unused Runtime Dependency Removal

As Nico,
I want to remove confirmed unused runtime dependencies,
So that the runtime surface is leaner and easier to maintain.

**Acceptance Criteria:**

**Given** dependency usage analysis confirms a package is unused (for example `react-router`)
**When** the package is removed
**Then** the app builds and runs correctly without the package
**And** all verification gates pass after removal.

### Story 3.5: Deferred-Major Decision Ledger

As Nico,
I want explicit rationale for each deferred major upgrade,
So that deferrals are intentional and revisitable instead of accidental.

**Acceptance Criteria:**

**Given** a major upgrade cannot be safely completed in-cycle
**When** the deferral is recorded
**Then** the ledger includes reason, risk, and revisit trigger
**And** no major deferral remains undocumented.

## Epic 4: Workflow Hardening and Operational Closure

Finalize the maintenance and release workflow and close the cycle with an all-green release-candidate verification pass.

### Story 4.1: Final Baseline Re-Verification on Release Candidate

As Nico,
I want a final full baseline verification pass on release-candidate state,
So that I can confirm the cycle closes with stable, shippable quality.

**Acceptance Criteria:**

**Given** all prior epic changes are merged into release-candidate state
**When** baseline checks are executed
**Then** lint, build, unit, and e2e all pass
**And** results are recorded in the final verification artifact.

### Story 4.2: Regression Burn-Down and Closure Log

As Nico,
I want all known high-impact regressions explicitly tracked to closure,
So that no critical issue remains hidden at cycle end.

**Acceptance Criteria:**

**Given** the regression issue list from prior phases
**When** closure review is performed
**Then** each high-impact regression is marked resolved or explicitly deferred with rationale
**And** unresolved high-impact regressions equal zero at sign-off.

### Story 4.3: Maintenance Checklist Publication and Home Selection

As Nico,
I want the maintenance checklist finalized in its long-term location,
So that future updates follow one canonical workflow.

**Acceptance Criteria:**

**Given** checklist content validated in dry runs
**When** publication is completed
**Then** one canonical location is selected (`README` or docs workflow page)
**And** references from related docs point to that canonical location.

### Story 4.4: Operational Handoff Snapshot

As Nico,
I want a concise end-of-cycle operational snapshot,
So that future maintenance starts with clear context and evidence.

**Acceptance Criteria:**

**Given** final verification and checklist publication are complete
**When** the closure snapshot is written
**Then** it includes current verification status, known deferred items, and upgrade ledger links
**And** the next maintenance cycle can start without reconstructing prior decisions.
