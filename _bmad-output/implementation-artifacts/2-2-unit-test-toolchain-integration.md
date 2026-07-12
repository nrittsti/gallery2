---
baseline_commit: 9af218bc353307e8d0bb8437ddb17ac854d46c15
---

# Story 2.2: Unit Test Toolchain Integration for React, TypeScript, and Vite

Status: done

## Story

As Nico,
I want a working unit-test stack integrated into the project,
So that core component and hook behavior is validated quickly.

## Acceptance Criteria

1. **AC1: Vitest is configured as the unit test runner**
   Given the project's build configuration
   When Vitest is invoked
   Then it uses the existing Vite config (`vite.config.ts`) with jsdom environment
   And it supports React TSX components, TypeScript path resolution, and JSON imports

2. **AC2: npm scripts for unit tests exist**
   Given `package.json`
   When listing available scripts
   Then `test:unit` runs the Vitest unit test suite
   And `test` runs both `test:unit` and `test:e2e` sequentially
   And `test:unit:watch` runs Vitest in watch mode for development

3. **AC3: A basic smoke test verifies the toolchain works**
   Given a trivial smoke test file
   When `npm run test:unit` executes
   Then the test passes, confirming Vitest, jsdom, and React Testing Library render a component

4. **AC4: CI runs unit tests in the verification pipeline**
   Given the CI workflow
   When CI executes
   Then `npm run test:unit` runs after build and before e2e tests
   And a unit-test failure blocks the pipeline

5. **AC5: Documentation references the unit test commands**
   Given the project README
   When a developer needs to run unit tests
   Then the canonical `npm run test:unit` command is documented alongside the existing verification commands

## Tasks / Subtasks

### Toolchain Installation and Configuration

- [x] **Task 1**: Install Vitest and testing libraries (AC: 1)
  - [x] Install `vitest` as a devDependency
  - [x] Install `@testing-library/react` and `@testing-library/jest-dom` as devDependencies
  - [x] Install `jsdom` as a devDependency
  - [x] Verify versions are compatible with existing React 19, TypeScript ~5.9, and Vite 7

- [x] **Task 2**: Configure Vitest in the project (AC: 1)
  - [x] Add a `test` section to `vite.config.ts` with `environment: "jsdom"` and `globals: true`
  - [x] Create `src/test-setup.ts` that imports `@testing-library/jest-dom` for DOM matchers
  - [x] Point Vitest's `setupFiles` to `src/test-setup.ts`
  - [x] Ensure TypeScript knows Vitest global types — add `vitest/globals` to `tsconfig.app.json` `types` array

- [x] **Task 3**: Add npm scripts (AC: 2)
  - [x] Add `"test:unit": "vitest run"` to `package.json`
  - [x] Add `"test:unit:watch": "vitest"` to `package.json`
  - [x] Update `"test"` script to `"npm run test:unit && npm run test:e2e"` — runs both unit and e2e

### Smoke Test

- [x] **Task 4**: Write a smoke test to validate the toolchain (AC: 3)
  - [x] Create `tests/unit/setup.ts` that configures Vitest imports
  - [x] Write `tests/unit/smoke.test.tsx` that renders a trivial React component (e.g., `<div>Hello Vitest</div>`) and asserts it appears
  - [x] Run `npm run test:unit` and confirm green

### E2E Test Migration to `tests/e2e/`

- [x] **Task 5**: Migrate existing Playwright tests from `tests/` to `tests/e2e/`
  - [x] Create `tests/e2e/` directory
  - [x] Move `tests/gallery-lightbox.spec.ts` → `tests/e2e/gallery-lightbox.spec.ts`
  - [x] Move `tests/helpers.ts` → `tests/e2e/helpers.ts`
  - [x] Update any internal imports in `tests/e2e/gallery-lightbox.spec.ts` to reference the new `helpers.ts` path
  - [x] Update `playwright.config.ts` `testDir` from `tests` to `tests/e2e`
  - [x] Update `.eslintignore` or ESLint config if it references the old paths
  - [x] Run `npm run test:e2e` and confirm all tests still pass

### CI Integration

- [x] **Task 6**: Update CI to run unit tests in the gate sequence (AC: 4)
  - [x] In `.github/workflows/playwright_push.yml`, add a `npm run test:unit` step after build and before the e2e step
  - [x] Update the `npm run test:e2e:ci` reference if the path change affects CI
  - [x] Verify the gate order becomes: `lint -> build -> unit -> e2e` (per AD-3)

### Documentation

- [x] **Task 7**: Update README (AC: 5)
  - [x] Add `npm run test:unit`, `npm run test:unit:watch` to the "Verification Commands" section
  - [x] Update file paths in E2E documentation from `tests/` to `tests/e2e/`
  - [x] Update the gate order diagram to include unit tests: `lint -> build -> unit -> e2e`
  - [x] Mention that unit tests use Vitest + React Testing Library + jsdom and live in `tests/unit/`

## Dev Notes

### Toolchain Decisions

- **Vitest** is the natural choice — it shares Vite's config, transform pipeline, and plugin ecosystem. No separate config file needed since it reads from `vite.config.ts`.
- **@testing-library/react** for component rendering and querying; it encourages testing user-visible behavior rather than implementation details.
- **@testing-library/jest-dom** provides DOM-specific matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.) for better assertion readability.
- **jsdom** simulates a browser environment in Node for React component rendering.
- **Unit test location**: `tests/unit/` keeps all test tooling under one top-level `tests/` directory alongside `tests/e2e/`, avoiding confusion and keeping `src/` clean of test infra. Vitest config needs to include `tests/unit/` in its test match pattern.

### E2E Migration Rationale

- With unit tests in `tests/unit/`, the flat `tests/` layout is ambiguous. Moving Playwright tests to `tests/e2e/` makes test type explicit at a glance.
- `playwright.config.ts` `testDir` must point to `tests/e2e` so Playwright only discovers E2E tests.
- The `npm run test:e2e:ci` script uses `playwright test` under the hood — it inherits the config change automatically.

### Architecture Compliance

- **AD-3 (Verification gate contract)**: Unit tests become gate 3 in the sequence: `lint -> build -> unit -> e2e`. Every change batch must pass all four gates.
- **AD-3 also states**: Any change touching lightbox/filter reliability paths must add or update at least one automated assertion in unit or e2e tests.
- The deferred decision on "unit-test folder layout" (Architecture Spine → Deferred section) is resolved here: `tests/unit/`.

### Files to Create

- `tests/unit/smoke.test.tsx` — smoke test to validate Vitest toolchain
- `tests/e2e/` — directory for migrated Playwright tests
- `tests/e2e/helpers.ts` — moved from `tests/helpers.ts`
- `tests/e2e/gallery-lightbox.spec.ts` — moved from `tests/gallery-lightbox.spec.ts`
- `src/test-setup.ts` — global test setup (imports `@testing-library/jest-dom`)

### Files to Modify

- `package.json` — add `test:unit`, `test:unit:watch` scripts; update `test` script
- `vite.config.ts` — add `test` configuration block for Vitest
- `tsconfig.app.json` — add `vitest/globals` to `types` array
- `playwright.config.ts` — update `testDir` from `tests` to `tests/e2e`
- `.github/workflows/playwright_push.yml` — add `npm run test:unit` step
- `README.md` — document unit test commands, update E2E paths, updated gate order

### Files to Delete

- `tests/helpers.ts` — moved to `tests/e2e/helpers.ts`
- `tests/gallery-lightbox.spec.ts` — moved to `tests/e2e/gallery-lightbox.spec.ts`
- `tests/README.md` — verify if it still makes sense after restructuring

### Previous Story Intelligence (2.1)

- Canonical scripts already established: `lint`, `build`, `test:e2e`
- `test` currently delegates to `test:e2e` only — must be updated to include both
- CI already follows lint -> build -> e2e order; unit will slot between build and e2e
- Review deferred from 2.1: "test name locked for E2E — story 2.2 will expand it"
- Review deferred from 2.1: "No test:unit script exists yet" — resolved here
- CI step pattern: `npm run test:e2e:ci` handles server start + e2e; unit tests run without server

### Project Context Reference

- `tsconfig.app.json` has `compilerOptions.types: ["vite/client"]` — add `vitest/globals`
- ESLint config at `eslint.config.js` — may need to ignore test files or add vitest plugin
- Photo data source at `src/assets/photos.json` — unit tests may import this for test fixtures
- E2E helpers moved to `tests/e2e/helpers.ts` — unit tests should not depend on Playwright; create separate test utilities

### Testing Notes

- Do NOT import Playwright in unit tests
- Unit tests should not need a running dev server
- Use `vi.mock()` for mocking context/hooks where needed
- Test data can use inline fixtures that match the `PhotoProps` interface shape (small subsets, 3-5 records)

## Dev Agent Record

### Agent Model Used

deepseek-v4-flash

### Completion Notes

Implemented Story 2.2 — Unit Test Toolchain Integration.

- Installed vitest@4.1.10, @testing-library/react@16.3.2, @testing-library/jest-dom@6.9.1, jsdom@29.1.1
- Configured Vitest in vite.config.ts (import defineConfig from vitest/config) with jsdom environment, globals, and setup file
- Created src/test-setup.ts with `@testing-library/jest-dom/vitest` import for DOM matchers
- Added vitest/globals to tsconfig.app.json types; created tests/tsconfig.json extending app config for test type checking
- Added npm scripts: test:unit, test:unit:watch; updated test script to run unit then e2e
- Wrote passing smoke test in tests/unit/smoke.test.tsx confirming Vitest + React Testing Library works
- Migrated Playwright tests from tests/ to tests/e2e/ (gallery-lightbox.spec.ts, helpers.ts, README.md)
- Updated playwright.config.ts testDir to ./tests/e2e
- Added npm run test:unit step to CI workflow between build and e2e
- Updated README with unit test commands, updated gate order (lint -> build -> unit -> e2e), and E2E paths

All gates pass: lint ✓, build ✓, test:unit ✓

### File List

- [x] `tests/unit/smoke.test.tsx` (create)
- [x] `tests/unit/vitest.d.ts` (create)
- [x] `src/test-setup.ts` (create)
- [x] `tests/e2e/` (create)
- [x] `tests/e2e/helpers.ts` (moved from `tests/helpers.ts`)
- [x] `tests/e2e/gallery-lightbox.spec.ts` (moved from `tests/gallery-lightbox.spec.ts`)
- [x] `tests/e2e/README.md` (moved from `tests/README.md`)
- [x] `tests/helpers.ts` (delete)
- [x] `tests/gallery-lightbox.spec.ts` (delete)
- [x] `tests/README.md` (delete — moved to tests/e2e/)
- [x] `tests/tsconfig.json` (create)
- [x] `package.json` (modify)
- [x] `vite.config.ts` (modify)
- [x] `tsconfig.app.json` (modify)
- [x] `tsconfig.json` (modify — added tests/tsconfig.json reference)
- [x] `playwright.config.ts` (modify)
- [x] `.github/workflows/playwright_push.yml` (modify)
- [x] `README.md` (modify)

## Change Log
- [x] Story implemented: Vitest toolchain installed and configured, smoke test created, E2E tests migrated to tests/e2e/, CI updated with unit gate, README updated.

### Review Findings (Code Review — 2026-07-11)

**Patch:**
- [x] [Review][Patch] `test:e2e:ci` exit code masking — exit code is always 0 due to `; kill %1 2>/dev/null || true` at end of script. Preview server process cleanup also unreliable in CI (no job control). Fixed with `trap` for cleanup and explicit exit code propagation. [`package.json:25`]
- [x] [Review][Patch] `vitest/globals` leaks into production tsconfig — `tsconfig.app.json` adds `vitest/globals` to `types`, making `test`/`expect`/`describe` available in all `src/` files without imports. Removed from `tsconfig.app.json`; `tests/tsconfig.json` retains it explicitly. [`tsconfig.app.json:5`]

**Deferred:**
- [x] [Review][Defer] `test:e2e:ci` upload-artifact version mismatch (v4 vs v6) — pre-existing, introduced in story 2.1 CI update, not part of this change.

**Dismissed (noise):**
- `test:e2e` script undefined — false positive, exists in package.json from story 2.1
- Duplicate `@testing-library/jest-dom/vitest` — `vitest.d.ts` is type-time, `src/test-setup.ts` is runtime, both needed
- Redundant `vitest/globals` in `tests/tsconfig.json` — harmless, explicit is clearer
- AC5 README missing — false positive, README was updated with unit test commands
