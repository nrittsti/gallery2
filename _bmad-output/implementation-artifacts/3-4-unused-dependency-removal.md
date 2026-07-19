---
baseline_commit: ff5d293
---

# Story 3.4: Unused Runtime Dependency Removal

Status: done

## Story

As Nico,
I want to remove confirmed unused runtime dependencies,
So that the runtime surface is leaner and easier to maintain.

## Acceptance Criteria

1. **AC1: Unused dependency identified and removed**
   Given dependency usage analysis confirms `react-router` is not imported by any source file in `src/`
   When `react-router` is removed from `dependencies` in `package.json`
   Then `npm install` produces a clean lockfile without the package
   And `npm run build` passes with 0 errors

2. **AC2: No source changes required after removal**
   Given `react-router` is removed from `package.json`
   When the app builds and runs
   Then no import or usage change is needed in any `src/` file
   And the app renders correctly (same behavior as before removal)

3. **AC3: All verification gates pass after removal**
   Given the dependency removal is complete
   When gates run in AD-3 order
   Then `npm run lint` passes with 0 errors
   And `npm run build` passes
   And `npm run test:unit` passes (baseline: 55+)
   And `npm run test:e2e` passes (baseline: 26+)

4. **AC4: No residual references to removed package**
   Given the package is removed from `package.json`
   When the codebase is scanned
   Then no `import` or `require` of `react-router` exists in `src/` or `tests/`
   And no config file references the package

## Tasks / Subtasks

- [x] **Task 1**: Confirm unused dependency scope (AC: 1)
  - [x] Verify `react-router` has zero imports in `src/` via grep
  - [x] Check `tests/` for any `react-router` imports
  - [x] Check all config files (`.ts`, `.js`) for `react-router` references
  - [x] Verify no transitive usage: check if other installed packages list `react-router` as peer dependency (run `npm ls react-router`)

- [x] **Task 2**: Remove `react-router` from `package.json` dependencies (AC: 1, 2)
  - [x] Remove `"react-router": "^7.18.1"` from `dependencies` object
  - [x] Run `npm install` to update `package-lock.json`
  - [x] Verify `npm ls react-router` shows nothing (no top-level or nested dependency)

- [x] **Task 3**: Run full verification gate in AD-3 order (AC: 3)
  - [x] `npm run lint` — 0 errors, 3 pre-existing warnings
  - [x] `npm run build` — passed (tsc -b + vite build)
  - [x] `npm run test:unit` — 55 passed (5 files)
  - [x] `npm run test:e2e` — 26 passed (Chromium + Firefox)

- [x] **Task 4**: Confirm app renders correctly (AC: 2)
  - [x] Start `npm run dev` and verify app loads without runtime errors
  - [x] Verify gallery, navigation, and lightbox interactions work

## Dev Notes

### Dependency Removal Scope

- `react-router` (`^7.18.1`) is the sole confirmed unused runtime dependency:
  - Zero imports in `src/` (confirmed via grep across all `.tsx`, `.ts` files)
  - App uses no routing — `App.tsx` is a flat composition of `Navigation`, `Gallery`, `Lightbox`, `Footer`
  - `Navigation.tsx` uses React-Bootstrap `Nav.Link` for styling only (no router integration)
  - No references in test files or config files

### Architecture Constraints

- **AD-1** (Layered dependency): Removal must not break `UI -> hooks/context -> data/source adapters` direction
- **AD-3** (Verification gate order): `lint -> build -> unit -> e2e`. All four must pass.
- **FR-3** is the functional requirement this story serves (PRD FR-3: Remove unused runtime dependencies)

### What NOT to Do

- Do NOT add/replace any routing library — the app has no routing requirement
- Do NOT refactor `App.tsx` or components to use routing
- Do NOT remove any `devDependencies` — only target unused `dependencies`
- Do NOT modify any source code files — only `package.json` and `package-lock.json`

### Potential Risk: Peer Dependency Breakage

- Check if any installed package declares `react-router` as peer dependency: `npm ls react-router` after removal
- If a peer dependency warning appears, verify it is not a hard requirement by checking the dependent package docs

### Verification

- All four verification gates must pass on the removal commit:
  - `npm run lint` (0 errors expected)
  - `npm run build` (tsc -b + vite build)
  - `npm run test:unit` (vitest, baseline ~55 passed)
  - `npm run test:e2e` (Playwright Chromium + Firefox, baseline ~26 passed)
- E2E test has `getYearFilterLinks()` helper — not related to routing, must still pass

### Previous Story Intelligence (Story 3.3)

- Post-Batch-B baseline: lint 0 errors, build ok, unit 55 passed, e2e 26 passed
- Verification gates are well-established and reliable
- Evidence files stored in `_bmad-output/implementation-artifacts/batch-*-*-q*.md`
- Python 3.9.6 on this system means `tomllib` not available (not relevant to this story)

### References

- [Source: epics.md#Story-3.4] Story 3.4 acceptance criteria
- [Source: ARCHITECTURE-SPINE.md#AD-1] Layered dependency direction
- [Source: ARCHITECTURE-SPINE.md#AD-3] Verification gate contract — lint -> build -> unit -> e2e
- [Source: PRD.md#FR-3] FR-3 — Remove unused runtime dependencies
- [Source: _bmad-output/project-context.md] Project implementation rules
- [Source: package.json] Current dependencies

## Dev Agent Record

### Agent Model Used

deepseek-v4-flash

### Debug Log References

- grep search: zero `react-router` imports across all source/ config files (only `package.json` + `package-lock.json`)
- npm ls: empty after removal — no transitive or peer dependencies
- Verification gates all pass: lint (0 errors), build OK, unit (55/55), e2e (26/26)

### Completion Notes List

- Removed unused `react-router` dependency (confirmed zero imports in `src/` and `tests/`)
- No source code changes needed — app has no routing usage
- All verification gates pass after removal
- 3 packages removed, 0 peer breakage warnings, 0 vulnerabilities

### File List

- `package.json` (modify — removed `react-router` from dependencies)
- `package-lock.json` (modify — lockfile updated via npm install)

## Change Log

- Created Story 3.4 with scope limited to `react-router` removal, verification gates, and build confirmation
- Removed `react-router` (confirmed unused — zero imports, no config references), 3 packages removed
- All verification gates pass: lint (0 errors), build OK, unit 55/55, e2e 26/26
