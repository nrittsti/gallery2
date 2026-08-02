---
title: 'Support 2026 photos in year filter E2E test'
type: 'bugfix'
created: '2026-08-02'
status: 'done'
review_loop_iteration: 0
route: 'one-shot'
---

# Support 2026 photos in year filter E2E test

## Intent

**Problem:** `tests/e2e/gallery-lightbox.spec.ts` asserted the year filter links as `[2022, 2023, 2024, 2025]`; with 45 photos from 2026 added to `src/assets/photos.json` the derived year list now includes 2026, failing the test.

**Approach:** Update the expected year list to include 2026, matching the data-derived links.

## Suggested Review Order

- Year filter list now expects 2026, matching the 45 photos added to photos.json
  [`gallery-lightbox.spec.ts:156`](../../tests/e2e/gallery-lightbox.spec.ts#L156)
