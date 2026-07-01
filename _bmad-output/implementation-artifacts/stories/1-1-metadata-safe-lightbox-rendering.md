---
baseline_commit: 89962ec815595002d0244460aae432f825296db2
---

# Story 1.1: Metadata-Safe Lightbox Rendering

Status: done

## Story

As a visitor,
I want Lightbox to render safely even when photo metadata is incomplete,
so that I can browse without crashes.

## Acceptance Criteria

1. Lightbox renders without runtime error when any optional Photo Record metadata field is missing or null.
   - Given a Photo Record with one or more missing optional metadata fields
   - When the visitor opens Lightbox for that photo
   - Then the Lightbox renders without runtime error
   - And each missing field displays a safe fallback value without breaking layout

2. Navigation controls remain functional when metadata is absent.
   - Given a Lightbox open with incomplete metadata
   - When the visitor navigates Previous/Next
   - Then navigation still works and index stays bounded

3. Close action works reliably regardless of metadata state.
   - Given a Lightbox open with incomplete metadata
   - When the visitor presses Close, Escape, or clicks backdrop
   - Then Lightbox closes

## Tasks / Subtasks

- [x] Modify `src/components/Lightbox.tsx` EXIF display section to guard each metadata field (AC: #1)
- [x] Ensure navigation and close callbacks remain unaffected by metadata state (AC: #2, #3)
- [x] Run `npm run build` and `npm run lint` to verify no regressions
- [x] Run existing e2e suite to confirm lightbox interaction tests still pass

### Review Findings

- [x] [Review][Patch] Missing-metadata scenario is not exercised in the new resilience test [tests/gallery-lightbox.spec.ts:138]
- [x] [Review][Patch] Fallback value behavior is not asserted and coverage only checks 4 of 8 updated EXIF fields [tests/gallery-lightbox.spec.ts:151]
- [x] [Review][Patch] Fixed-count `Next` navigation loop can become brittle on small galleries [tests/gallery-lightbox.spec.ts:145]
- [x] [Review][Defer] Lightbox still dereferences `photos[index]` without an undefined guard [src/components/Lightbox.tsx:81] -- deferred, pre-existing

## Dev Notes

- **Architecture constraints:** AD-4 (Photo Record schema tolerance) requires metadata to be treated as optional at UI/hook boundaries with safe rendering fallbacks. AD-2 (State ownership) requires cross-component state changes only through context setters.
- **Current behavior:** Lightbox at `src/components/Lightbox.tsx:110-136` renders EXIF fields by directly accessing `photo.*` properties with no null/undefined guards. Missing fields will display nothing or crash depending on whether the field renders as a child of a React element.
- **Changes are UPDATE-only:** Modify existing Lightbox rendering; no new components or files needed. Do not change PhotoProps type, context contracts, or usePhotos behavior.
- **Preserve:** Keyboard navigation (Escape, ArrowLeft, ArrowRight, Space), touch swipe gestures (50px threshold), bounded prev/next index clamping, full-screen modal behavior, close-button in header.
- **Testing:** No unit tests exist yet (Epic 2). Run existing e2e suite via `npx playwright test` as smoke check. Per AD-3, lightbox reliability changes must include at least one assertion update — update existing e2e lightbox spec to cover a missing-metadata scenario.

### Files to modify

| File | Action | What to change |
|------|--------|----------------|
| `src/components/Lightbox.tsx` | UPDATE | Guard EXIF metadata rendering at lines 110-136 with safe fallbacks |
| `tests/gallery-lightbox.spec.ts` | UPDATE | Add or update a test scenario for missing metadata (per AD-3) |

### Files to read (context only)

| File | Purpose |
|------|---------|
| `src/types/PhotoProps.tsx` | Canonical Photo Record type showing optional-capable fields |
| `src/components/lightbox.css` | Existing lightbox styling (no changes needed) |
| `tests/helpers.ts` | GalleryPage POM for test reference |

### Project Structure Notes

- All modifications stay within existing files and folder boundaries (`src/components`, `tests/`).
- No new dependencies, components, or routing changes needed.

### References

- Architecture spine: `_bmad-output/planning-artifacts/architecture/architecture-Gallery-2026-06-27/ARCHITECTURE-SPINE.md` (AD-2, AD-4)
- UX Experience: `_bmad-output/planning-artifacts/ux-designs/ux-Gallery-2026-06-27/EXPERIENCE.md` (Component Patterns > Lightbox, EXIF Metadata Panel, State Patterns)
- Project context: `_bmad-output/project-context.md` (Framework-Specific Rules, Critical Don't-Miss Rules)
- Epic breakdown: `_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.1)

## Dev Agent Record

### Agent Model Used

deepseek-v4-flash

### Debug Log References

- No new debug logging added.
- Verified by `npm run build` passing (tsc + vite).
- Verified by `npm run lint` passing (ESLint).
- E2E test suite passes locally.

### Completion Notes List

- [x] `npm run build` passes
- [x] `npm run lint` passes
- [x] Existing e2e lightbox spec passes
- [x] Missing-metadata resilience test added to e2e spec
- Added `exifValue` guard function in Lightbox.tsx that returns em-dash ("—") fallback for null/undefined/nullish metadata values
- Wrapped all 8 optional EXIF fields (createdate, cameramodelname, lensmodel, focallengthin35mmformat, aperturevalue, exposuretime, iso, flash) with the guard
- Added `Lightbox resilience: renders without crash and metadata has fallback values` e2e test covering multi-photo navigation, metadata assertions, and keyboard close

### File List

- src/components/Lightbox.tsx
- tests/gallery-lightbox.spec.ts
