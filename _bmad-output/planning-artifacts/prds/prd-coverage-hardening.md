---
title: "Gallery — Test Coverage Hardening"
status: final
created: 2026-07-11
updated: 2026-07-11
---

# PRD: Test Coverage Hardening

## 0. Document Purpose

Define a focused cycle to raise automated test coverage of the Gallery codebase to measurable, sustainable thresholds — without chasing diminishing returns.

## 1. Vision

Gallery's test suite covers core logic well (100% in utils/hooks/context) but has gaps in component-level branches, especially error paths and edge cases. This cycle raises the floor: 90% line coverage and 80% branch coverage, measured and enforced in CI, so regressions in non-obvious code paths are caught automatically.

The outcome is confidence that `npm run test` means "all behavior is verified," not "most behavior is verified."

## 2. Target Audience

Nico — solo maintainer. Coverage is a safety net, not a KPI dashboard. Thresholds are chosen to catch real regressions without creating maintenance overhead.

## 3. Glossary

- **Line coverage** — percentage of executable source lines exercised by tests.
- **Branch coverage** — percentage of decision points (if/else, switch, ternary, logical operators) where both branches are exercised.
- **Coverage gate** — CI step that fails when coverage drops below configured thresholds.

## 4. Scope

### In Scope

- Raise **line coverage** to ≥90% across all `src/` TypeScript files (excluding assets, CSS, and type-only files).
- Raise **branch coverage** to ≥80% across all `src/` TypeScript files (excluding assets, CSS, and type-only files).
- Add `npm run test:coverage` script that runs unit tests with coverage reporting.
- Add a coverage gate to CI that fails if thresholds are not met.
- Write missing tests for uncovered lines and branches in `src/components/` (primarily Lightbox.tsx, currently at 78.68% lines / 59.25% branches).
- Exclude `src/assets/` (photos.json), `*.css` files, and type-only `.d.ts` files from coverage requirements.

### Out of Scope

- E2E test coverage (Playwright has no built-in coverage instrumentation for browser tests).
- Coverage targets for test files themselves.
- Refactoring code solely to make it more testable.
- Adding tests for touch/swipe gesture handlers (would require complex event simulation; defer to a UX-specific story if needed).

## 5. Functional Requirements

#### FR-1: Coverage measurement command

Nico can run coverage locally and see line/branch/function reports.

**Consequences (testable):**
- `npm run test:coverage` exists and produces a coverage report.
- The report includes line, branch, function, and statement percentages.
- The report is human-readable in the terminal and as HTML.

#### FR-2: Coverage gate enforcement in CI

CI blocks merging when coverage drops below threshold.

**Consequences (testable):**
- A CI step runs `npm run test:coverage` and fails if line coverage < 90% or branch coverage < 80%.
- Coverage is measured against `src/` excluding `src/assets/` and CSS files.
- The gate is documented in the project README.

#### FR-3: Lightbox branch coverage to 80%

Uncovered branches in `Lightbox.tsx` (currently 59.25%) are brought to ≥80%.

**Consequences (testable):**
- All `if/else` branches in Lightbox are exercised: photo guard (`if (!photo) return null`), revalidation effect branches, keyboard key matching.
- Navigation boundary branches (prev at 0, next at last) are already covered; the touch/swipe handler branches are the main gap.
- Touch/swipe handler branches (`if (!touchStart || !touchEnd)`, `if (distance > 50)`, `if (distance < -50)`) each have at least one test.

#### FR-4: General component gap coverage

Remaining uncovered lines in components are covered.

**Consequences (testable):**
- Every function component renders without crashing in a unit test.
- Conditional rendering branches (ternary, `&&`, `||`) in component JSX are exercised.
- Callback functions (event handlers, `useCallback`, `useEffect` closures) are reached by tests.

## 6. Open Questions

1. Should the coverage gate be a hard block in CI or a warning with trend reporting?
2. Should `photos.json` be excluded from coverage via `coverage.exclude` or via threshold calculation?

## 7. Assumptions

- Covering the touch/swipe gesture handler is feasible with `fireEvent.touchStart/Move/End` in jsdom. If not, those branches remain untested and the 80% branch target is adjusted accordingly.
- The current coverage measurement infrastructure (`@vitest/coverage-v8`) produces accurate branch counts.
