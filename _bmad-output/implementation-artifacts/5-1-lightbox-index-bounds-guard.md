---
baseline_commit: 43d832e
---

# Story 5.1: Lightbox Index Bounds Guard

Status: review

## Tasks

- [x] Add explicit bounds check before `photos[index]` access in Lightbox.tsx
- [x] Fix `next()` to clamp minimum at 0 (prevents -1 when photos.length === 0)
- [x] Verify lint, build, unit tests pass

## Story

As a visitor,
I want Lightbox navigation to never crash even if the photo index is out of bounds,
So that browsing remains stable under any state condition.

## Acceptance Criteria

1. **AC1: Bounds check before photo access**
   Given a Lightbox is open with a current photo index
   When `photos[currentIndex]` is accessed
   Then the index is validated against `photos.length`
   And a safe fallback is returned if out of bounds

2. **AC2: Graceful recovery on invalid index**
   Given the lightbox index becomes invalid (e.g., after filter change reduces photo count)
   When the invalid state is detected
   Then the Lightbox closes gracefully or resets to a valid index
   And no runtime error propagates

3. **AC3: Existing tests still pass**
   Given the bounds guard is in place
   When the full test suite runs
   Then all 55 unit tests and 26 e2e tests pass

## Dev Notes

- Source: Cycle retrospective — deferred item R31 from regression-closure-log.md
- Location: `src/components/Lightbox.tsx` around line 81
- The guard was consciously deferred during Story 1.1 as pre-existing
- Must preserve all existing lightbox behavior (keyboard nav, swipe, prev/next)
- See Story 1.1 Dev Notes for the original deferral context

## References

- [Source: regression-closure-log.md#R31] R31 — photos[index] without undefined guard
- [Source: cycle-retrospective-q3-2026.md] Action Item 1
- [Source: ARCHITECTURE-SPINE.md#AD-6] Filter/lightbox synchronization invariant
