---
title: "Gallery"
status: final
created: 2026-06-27
updated: 2026-06-27
---

# PRD: Gallery

## 0. Document Purpose

This PRD defines the one-cycle cleanup plan for Nico's deployed photo gallery so downstream UX, architecture, and implementation work can execute with stable scope and measurable outcomes. It focuses on maintainability and reliability, not feature expansion, and captures requirements as phased capabilities with globally numbered functional requirements.

Primary source: `_bmad-output/planning-artifacts/briefs/brief-Gallery-2026-06-25/brief.md`.

## 1. Vision

Gallery remains a fast, personal publishing site for curated photos, but becomes safer to change week to week. The product should tolerate imperfect photo metadata, keep lightbox behavior predictable, and provide confidence before deployment through layered automated checks.

This cycle delivers all four cleanup phases from the brief: baseline reliability fixes, unit test foundation, aggressive dependency modernization, and final workflow hardening. The outcome is operational simplicity with less fragility and lower regression risk.

## 2. Target User

### 2.1 Jobs To Be Done

- Publish new photo batches without fear of breaking the live site.
- Browse and present photos by year with a clean, responsive lightbox experience.
- Detect breakage quickly before deploy using reliable local and CI checks.
- Keep maintenance overhead low for a solo hobby workflow.

### 2.2 Non-Users (v1)

- Multi-author editors and content teams.
- API consumers or external integrators.

### 2.3 Key User Journeys

- **UJ-1. Nico publishes a new photo batch and verifies quality before pushing live.**
  - **Persona + context:** Nico updates personal gallery content periodically from a local machine.
  - **Entry state:** Local repository and image pipeline are available.
  - **Path:** Runs image/data update flow -> runs lint/build/unit/e2e checks -> reviews a few representative photos in lightbox -> deploys.
  - **Climax:** All checks pass and sample interactions behave correctly.
  - **Resolution:** New photos are live with no regressions.

- **UJ-2. Visitor opens photos in lightbox and navigates reliably even with imperfect metadata.**
  - **Persona + context:** A public website visitor browses year-filtered photos on desktop or mobile.
  - **Entry state:** Gallery page is loaded.
  - **Path:** Selects a year -> opens a photo -> navigates previous/next via UI, keyboard, or touch.
  - **Climax:** Photo and available EXIF content render correctly without crashes.
  - **Resolution:** Visitor continues browsing or closes lightbox smoothly.

## 3. Glossary

- **Gallery** - The deployed React single-page photo application.
- **Photo Record** - A JSON-backed photo data entry used by Gallery and Lightbox.
- **Lightbox** - Full-screen modal photo viewer with metadata and navigation controls.
- **Baseline Checks** - Local/CI verification sequence: lint, build, unit tests, and e2e tests.
- **Unit Test Suite** - React-focused tests for component and hook behavior.
- **E2E Suite** - Playwright browser tests covering user-visible behavior.
- **Upgrade Batch** - A grouped dependency update set validated together.
- **Publishing Workflow** - Repeatable process to add photos and release updates safely.

## 4. Features

### 4.1 Phase 1: Baseline and Reliability Quick Wins
**Description:** Establish a trustworthy baseline and remove known brittle points in Gallery and Lightbox behavior. Realizes UJ-1 and UJ-2.

**Functional Requirements:**

#### FR-1: Baseline verification snapshot

Nico can run Baseline Checks and capture pass/fail status before and after reliability fixes. Realizes UJ-1.

**Consequences (testable):**
- A documented baseline run exists for lint/build/e2e at phase start.
- A follow-up run exists after quick wins and reports net improvements or resolved failures.

#### FR-2: Lightbox failsafe behavior with incomplete Photo Record data

Visitor can open Lightbox without runtime crashes when Photo Record metadata fields are missing or malformed. Realizes UJ-2.

**Consequences (testable):**
- Lightbox render path guards absent metadata values and still displays available content.
- Navigation and close actions remain functional when optional metadata is absent.

#### FR-3: Remove unused runtime dependencies

Nico can remove confirmed unused dependency packages from runtime scope to reduce maintenance noise. Realizes UJ-1.

**Consequences (testable):**
- `react-router` is removed if no runtime usage remains for this cycle.
- Build and tests pass after removal.

### 4.2 Phase 2: Unit Test Foundation
**Description:** Add and integrate a Unit Test Suite for core React behavior to complement E2E coverage. Realizes UJ-1 and UJ-2.

**Functional Requirements:**

#### FR-4: Unit testing toolchain integration

Nico can execute Unit Test Suite locally and in CI using project-standard commands. Realizes UJ-1.

**Consequences (testable):**
- Unit test runner is configured for React + TypeScript + Vite.
- `npm` script entry points exist for running Unit Test Suite.
- CI executes Unit Test Suite in the baseline pipeline.

#### FR-5: Core filtering and sorting tests

Unit Test Suite validates Photo Record filtering by year and sort behavior used by Gallery. Realizes UJ-2.

**Consequences (testable):**
- Tests assert expected filtered list for selected year and all-years views.
- Tests assert stable, expected ordering of photos used by Gallery display.

#### FR-6: Lightbox interaction boundary tests

Unit Test Suite validates Lightbox state changes and boundary navigation behavior. Realizes UJ-2.

**Consequences (testable):**
- Tests cover open/close, previous/next boundaries, and keyboard interaction paths.
- Boundary actions never set Lightbox index outside valid array range.

### 4.3 Phase 3: Aggressive Dependency Modernization
**Description:** Modernize runtime and toolchain dependencies to current major versions where feasible while preserving product stability. Realizes UJ-1.

**Functional Requirements:**

#### FR-7: Upgrade batches with verification gates

Nico can apply dependency upgrades in Upgrade Batches with mandatory verification after each batch. Realizes UJ-1.

**Consequences (testable):**
- Each Upgrade Batch has a recorded package list and verification result.
- Baseline Checks pass for each merged Upgrade Batch.

#### FR-8: Compatibility remediation for config and source

Gallery remains buildable and testable after major upgrades by updating TypeScript, Vite, ESLint, and test configuration/code as needed. Realizes UJ-1.

**Consequences (testable):**
- `npm run lint` and `npm run build` pass on upgraded stack.
- Unit Test Suite and E2E Suite both pass on upgraded stack.

#### FR-9: Deferred-major rationale capture

Nico can defer any infeasible major upgrade only with explicit documented rationale. Realizes UJ-1.

**Consequences (testable):**
- Any deferred major includes reason, risk, and revisit trigger.
- No silent deferment of major upgrades in this cycle.

### 4.4 Phase 4: Stabilization and Workflow Hardening
**Description:** Resolve post-upgrade regressions, harden script/data handling, and document repeatable maintenance workflow. Realizes UJ-1.

**Functional Requirements:**

#### FR-10: Regression resolution pass

Nico can identify and resolve remaining functional regressions from prior phases before cycle close. Realizes UJ-1 and UJ-2.

**Consequences (testable):**
- Known regression list reaches zero unresolved high-impact issues.
- Final Baseline Checks all pass on release candidate state.

#### FR-11: Script and data resilience improvements

Publishing Workflow tolerates metadata anomalies and path irregularities without manual cleanup surprises. Realizes UJ-1.

**Consequences (testable):**
- Image/data scripts gracefully handle malformed or missing metadata fields.
- OS artifact files (for example `._*`) are ignored or cleaned consistently.

#### FR-12: Maintenance workflow documentation

Nico can follow one clear maintenance checklist for routine updates and release verification. Realizes UJ-1.

**Consequences (testable):**
- Documentation defines repeatable update flow and required verification steps.
- A first dry run follows the documented workflow successfully.

### 4.5 Cross-Cutting NFRs

- **Reliability:** No known crash path in Lightbox from incomplete Photo Record metadata.
- **Performance:** Core user interactions (gallery load and lightbox open) remain within existing acceptable thresholds used by E2E assertions.
- **Maintainability:** Every major dependency change is traceable to verification outcomes.
- **Reproducibility:** Local and CI baseline commands produce consistent pass/fail outcomes.

## 5. Non-Goals (Explicit)

- Full visual redesign, rebranding, or major UI concept changes.
- Migration to backend/CMS architecture.
- New platform surfaces (native mobile app, external API product).
- Feature-heavy expansion unrelated to reliability, testing, or maintenance.

## 6. MVP Scope

### 6.1 In Scope

- Implement all four phases from the approved brief within one coordinated cleanup cycle.
- Deliver reliability hardening in Gallery/Lightbox and Photo Record handling.
- Add Unit Test Suite and include it in CI gate sequence.
- Complete dependency modernization with explicit handling of deferred majors (if any).
- Finalize workflow and documentation for repeatable publishing.

### 6.2 Out of Scope for MVP

- New customer-facing feature families unrelated to cleanup goals.
- Architecture rewrite beyond compatibility adjustments needed for modernization.
- Tooling experiments not tied to measurable reliability/testing outcomes.

## 7. Success Metrics

**Primary**
- **SM-1:** Lightbox crash incidence from incomplete metadata is zero in local verification and post-release smoke checks. Validates FR-2, FR-10, FR-11.
- **SM-2:** Baseline Checks (lint, build, Unit Test Suite, E2E Suite) pass in CI for release branch. Validates FR-1, FR-4, FR-8, FR-10.
- **SM-3:** All planned phase deliverables are completed or explicitly deferred with rationale by cycle end. Validates FR-7, FR-9, FR-12.

**Secondary**
- **SM-4:** Unit Test Suite covers core filtering/sorting and lightbox boundary interactions. Validates FR-5, FR-6.
- **SM-5:** Upgrade Batches are documented and verified without unresolved high-impact regressions. Validates FR-7, FR-8, FR-10.

**Counter-metrics (do not optimize)**
- **SM-C1:** Do not optimize only for dependency freshness at the expense of runtime stability. Counterbalances SM-3.
- **SM-C2:** Do not optimize test count alone; prioritize high-value behavior coverage over volume. Counterbalances SM-4.

## 8. Open Questions

1. Are there any files or areas you explicitly do not want modified during this cleanup cycle?
2. Which documentation location should be the long-term home for the maintenance checklist (README vs docs workflow page)?

## 9. Assumptions Index

- None currently. Fast-path defaults were accepted and converted into explicit PRD decisions.
