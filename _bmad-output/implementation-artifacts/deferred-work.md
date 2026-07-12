## Deferred from: code review of 1-1-metadata-safe-lightbox-rendering.md (2026-06-27)

- Lightbox still dereferences `photos[index]` without an undefined guard at `src/components/Lightbox.tsx:81`; this risk appears pre-existing and not introduced by the current metadata fallback change.

## Deferred from: code review of 1-2-filter-and-lightbox-state-synchronization.md (2026-07-07)

- Hard-coded magic numbers in test assertions — data-dependent values acceptable for E2E
- No test for empty-photos edge case — no UI path currently to trigger zero photos
- `valueOrFallback` without `useCallback` — pre-existing issue not introduced by this change
- Non-atomic effect-based revalidation — React lifecycle gap has negligible practical impact
- E2E test doesn't exercise open-lightbox revalidation — modal overlay blocks simultaneous interaction

## Deferred from: code review of story 2.2 (2026-07-11)

- `test:e2e:ci` CI workflow uses upload-artifact@v6 for HTML report upload and upload-artifact@v4 for video upload — version mismatch is pre-existing, not introduced by this change.
