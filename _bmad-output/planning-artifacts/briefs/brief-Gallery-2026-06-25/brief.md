---
title: "Product Brief: Nico's Web Photo Gallery Cleanup"
status: draft
created: "2026-06-25"
updated: "2026-06-25"
---

# Product Brief: Nico's Web Photo Gallery Cleanup

## Executive Summary

Nico's photo gallery is a deployed React web app used to publish personal favorite images with lightbox viewing and EXIF metadata. The product already delivers core value: curated images are online, browsable by year, and maintainable through a script-driven image pipeline.

The next month is focused on a practical cleanup and reliability push, not a rewrite. The objective is to reduce maintenance friction and prevent regressions while continuing to publish photos. The plan prioritizes reliability and React unit tests, with an aggressive dependency modernization track to bring the stack to current major versions where feasible.

Success means the gallery remains simple to operate, but safer to change: fewer edge-case failures, stronger confidence from automated tests, and a cleaner toolchain baseline.

## Product Context

- Form factor: single-page web gallery (React + TypeScript + Vite), static deployment.
- Current usage: personal publishing and curation of favorite photos.
- Deployment: public website is live at `https://nicorittstieg.de`.
- Current scope: image grid, year filter, full-screen lightbox, EXIF display, image processing script.

## Problem

The app is functional, but several maintainability and reliability gaps create avoidable risk:

- Reliability edge cases in lightbox/data handling can cause breakage with incomplete metadata.
- Dependency versions are behind latest majors in multiple parts of the toolchain.
- Test coverage is weighted toward e2e; missing unit-level guardrails for core React behavior.
- Maintenance friction exists in script/data hygiene (metadata anomalies, path irregularities, OS artifact files).

For a personal project, these issues matter because they increase the chance that simple updates become time-consuming and brittle.

## Goals (One-Month Horizon)

1. Improve runtime reliability for gallery/lightbox behavior under real and imperfect data.
2. Add React unit tests for core logic and interactions.
3. Execute aggressive dependency upgrades (including majors) with controlled verification.
4. Keep photo publishing workflow straightforward and stable.

## Non-Goals

- Full visual redesign or brand overhaul.
- Migration to backend/CMS architecture.
- Large feature expansion unrelated to reliability/testing/maintenance.

## Scope

### In Scope

- Reliability hardening in `Gallery`, `Lightbox`, and photo data handling.
- React unit test setup and initial high-value coverage.
- Dependency upgrade campaign across runtime and build/test toolchain.
- CI and workflow fixes that directly improve confidence and repeatability.

### Out of Scope

- New platform surfaces (mobile app, API product).
- Fundamental architecture rewrite.
- Feature-heavy roadmap items not linked to stability or quality.

## Approach and Plan

### Phase 1 (Week 1): Baseline and Reliability Quick Wins

- Capture baseline status for lint, build, and e2e.
- Fix high-impact reliability issues and obvious CI correctness issues.
- Remove confirmed unused dependency (`react-router`).

### Phase 2 (Week 2): Unit Test Foundation

- Add unit test stack for React components/hooks.
- Implement tests for filtering/sorting, navigation state changes, lightbox boundaries, and key interactions.
- Integrate unit tests into CI.

### Phase 3 (Week 3): Aggressive Dependency Modernization

- Upgrade runtime and toolchain dependencies to latest compatible versions, including majors where feasible.
- Address resulting config/code compatibility issues in TypeScript, Vite, ESLint, and tests.
- Verify each upgrade batch with lint/build/unit/e2e.

### Phase 4 (Week 4): Stabilization and Workflow Hardening

- Resolve remaining regressions or edge-case issues from upgrades.
- Improve script/data resilience for metadata and path anomalies.
- Final pass on documentation and repeatable maintenance workflow.

## Success Criteria

- No known crash path in lightbox when photo metadata is incomplete.
- Unit tests exist and pass for critical React logic.
- CI includes and passes lint, build, unit tests, and e2e checks.
- Dependency set is modernized; any deferred major update has explicit rationale.
- Routine photo update flow remains intact and documented.

## Risks and Mitigations

- Risk: major upgrades cause cascading breakages.
  - Mitigation: upgrade in batches and verify after each batch.
- Risk: scope creep beyond one month.
  - Mitigation: tie tasks to reliability/testing goals; defer non-critical enhancements.
- Risk: test setup overhead delays delivery.
  - Mitigation: prioritize a small, high-value unit test suite first.

## Open Questions

- Which unit-test tooling combination should be standardized (`Vitest + React Testing Library` is the current recommendation)?
- Are there any areas the owner explicitly does not want modified during this cycle?
