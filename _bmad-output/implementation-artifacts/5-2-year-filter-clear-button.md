---
baseline_commit: c36fac6
---

# Story 5.2: Year Filter Clear/All Button

Status: done

## Tasks

- [x] Add "All" Nav.Link to Navigation.tsx that sets `selectedYear` to `null`
- [x] Verify active state matches when `year === null`
- [x] Verify lint, build, unit tests pass

## Story

As a visitor,
I want a way to clear the year filter and see all photos,
So that I can navigate back to the full gallery without reloading the page.

## Acceptance Criteria

1. **AC1: Clear/All button exists in navigation**
   Given the navigation bar is rendered
   When a year filter is active
   Then a button labeled "All" or equivalent is visible
   And clicking it sets `selectedYear` to `null`

2. **AC2: All photos displayed after clearing**
   Given the year filter has been cleared
   When the gallery re-renders
   Then all photos are displayed without year filtering
   And the `null` sentinel convention (AD-2) is preserved

3. **AC3: No regression on active year filtering**
   Given the year filter has a specific year selected
   When the gallery renders
   Then filtering by year still works correctly
   And all existing tests pass

## Dev Notes

- Source: Cycle retrospective — deferred item R32 from regression-closure-log.md
- Location: `src/components/Navigation.tsx` — add an "All" button alongside year buttons
- The `null` sentinel for clear-year is already supported by `FilterContext` and `usePhotos`
- This was deferred during Story 1.3 — AC2 was technically unmet from UI perspective
- See Story 1.3 Dev Notes for the original deferral context
- No UI mechanism existed to clear the filter without page refresh

## References

- [Source: regression-closure-log.md#R32] R32 — No UI mechanism to clear year filter
- [Source: cycle-retrospective-q3-2026.md] Action Item 1
- [Source: ARCHITECTURE-SPINE.md#AD-2] State ownership — null sentinel only
- [Source: epics.md#Story-1.3] Original story with unmet AC2
