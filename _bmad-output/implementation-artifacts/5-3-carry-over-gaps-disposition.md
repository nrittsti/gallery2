# Story 5.3: Carry-Over Gaps Disposition Decision

Status: ready-for-dev

## Story

As Nico,
I want a clear decision on each carry-over gap from the Q3 2026 cycle,
So that they are either resolved or explicitly accepted as permanent project standards.

## Acceptance Criteria

1. **AC1: Each gap reviewed and decided**
   Given three carry-over gaps exist (no Safari e2e, no npm audit, no performance thresholds)
   When each gap is reviewed
   Then a decision is recorded per gap: implement, schedule for next cycle, or permanently accept

2. **AC2: Decision documented**
   Given the decisions are made
   When documentation is updated
   Then the outcome is recorded in ARCHITECTURE-SPINE.md or a project standards doc
   And deferred items in regression-closure-log.md are updated to reflect the final disposition

## Carry-Over Gaps

| # | Gap | Source | Description |
|---|-----|--------|-------------|
| G1 | No Safari/WebKit e2e coverage | Pre-existing + R29 | E2E tests only run on Chromium and Firefox. Safari-specific regressions undetected |
| G2 | No npm audit in gates | Story 3.1 + R44 | Security vulnerability scanning not part of verification pipeline |
| G3 | No formal performance thresholds | Pre-existing + R30 | Gallery load and lightbox open times vary; no thresholds defined |

## Decision Options per Gap

- **Accept permanently** — document as explicit project standard, remove from deferred lists
- **Schedule for next cycle** — create a story in the next epic
- **Implement now** — requires additional effort in current cycle

## References

- [Source: regression-closure-log.md#R29] R29 — No Safari/WebKit e2e coverage
- [Source: regression-closure-log.md#R44] R44 — npm audit not gated
- [Source: regression-closure-log.md#R30] R30 — No formal performance thresholds
- [Source: cycle-retrospective-q3-2026.md] Action Item 2
- [Source: ARCHITECTURE-SPINE.md#Deferred] Current deferred items section
