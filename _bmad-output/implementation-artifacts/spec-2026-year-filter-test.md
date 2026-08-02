---
title: 'Data-driven year/count expectations in Playwright tests'
type: 'refactor'
created: '2026-08-02'
status: 'done'
review_loop_iteration: 0
route: 'one-shot'
---

# Data-driven year/count expectations in Playwright tests

## Intent

**Problem:** The Playwright tests hardcoded year lists (`[2022, 2023, 2024, 2025, 2026]`) and per-year counts (43, 63, 69), so every time a new year of photos lands in `src/assets/photos.json` the tests break and need a manual edit.

**Approach:** Derive all year/count expectations in the tests from the same `photos.json` the app renders, so future years (2027+) are supported automatically. The app's default selected year is extracted into a shared `DEFAULT_YEAR` constant so tests reference the same source of truth as `App.tsx`.

## Suggested Review Order

**Shared default-year constant**

- Default selected year moved to a single source both the app and tests read
  [`constants.ts:1`](../../src/constants.ts#L1)
  [`App.tsx:14`](../../src/App.tsx#L14)

**Data-derived test helpers**

- Expectations computed from photos.json via the helpers, imported with a JSON import attribute
  [`helpers.ts:1`](../../tests/e2e/helpers.ts#L1)

**Spec assertions now data-driven**

- Year list, per-year counts, default-year total, and clamp math all use the derived helpers
  [`gallery-lightbox.spec.ts:138`](../../tests/e2e/gallery-lightbox.spec.ts#L138)
