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

**Problem:** The Playwright tests hardcoded year lists (`[2022, 2023, 2024, 2025, 2026]`), per-year counts (43, 63, 69), and a fixed default-year index (21), so every new year of photos in `src/assets/photos.json` broke the tests and required a manual edit.

**Approach:** Derive all year/count/index expectations in the tests from the same `photos.json` the app renders, so future years (2027+) are supported automatically. The app's default selected year is derived from the data (`getAvailableYears(allPhotos)[0]`), so the gallery auto-opens on the newest year and tests share the same source of truth.

## Suggested Review Order

**Data-derived default year**

- Default selected year computed from the latest available year in photos.json; shared by app and tests
  [`constants.ts:1`](../../src/constants.ts#L1)
  [`App.tsx:14`](../../src/App.tsx#L14)

**Data-derived test helpers**

- Expectations computed from photos.json via the helpers, imported with a JSON import attribute
  [`helpers.ts:1`](../../tests/e2e/helpers.ts#L1)

**Spec assertions now data-driven**

- Year list, per-year counts, default-year total, clamp math, and the resilience target index all use the derived helpers
  [`gallery-lightbox.spec.ts:138`](../../tests/e2e/gallery-lightbox.spec.ts#L138)
