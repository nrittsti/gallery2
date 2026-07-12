---
baseline_commit: cb2356f86e222714ff1e1a87b305a1afe4784774
---

# Story 2.1: Standardized Verification Command Set

**Status:** done

## Story

As Nico,
I want one canonical command set for lint, build, unit, and e2e checks,
So that local and CI verification are consistent.

## Acceptance Criteria

1. **AC1: Canonical npm scripts exist for all gates**
   Given the repository's `package.json`
   When listing available scripts
   Then each verification gate has a documented npm script: `lint`, `build`, `test` (or `test:unit`), and `test:e2e`
   And the scripts are usable both locally and in CI

2. **AC2: CI runs the same canonical commands**
   Given the CI workflow configuration
   When CI executes
   Then it invokes the same npm scripts (`npm run lint`, `npm run build`, `npm run test:e2e`) rather than raw tool commands
   And the execution order follows `lint -> build -> e2e`

3. **AC3: Documentation references the canonical commands**
   Given the project README or docs
   When a developer needs to run verification
   Then the canonical npm scripts are documented as the primary way to run each gate

## Tasks/Subtasks

### Script Standardization
- [x] **Task 1**: Audit current npm scripts vs CI usage for gaps.
- [x] Subtask: Identify that CI runs `npm run build` and `npx playwright test` directly — the e2e command should use the canonical `npm run test:e2e`
- [x] Subtask: Identify that CI does not run `npm run lint` — add it before build
- [x] Subtask: Identify that no `test` or `test:unit` script exists yet (unit toolchain comes in story 2.2)

- [x] **Task 2**: Add missing canonical scripts to `package.json`.
- [x] Subtask: Ensure `test` is defined (delegates to `test:e2e` for now; unit tests added in story 2.2)
- [x] Subtask: Ensure `test:e2e` is the canonical e2e command used in CI

- [x] **Task 3**: Update CI workflows to use canonical npm scripts.
- [x] Subtask: In `playwright_push.yml`, replace `npx playwright test` with `npm run test:e2e` and add `npm run lint` before `npm run build`
- [x] Subtask: In `upload_dist.yml`, already uses `npm run build` — no change needed

- [x] **Task 4**: Document canonical commands.
- [x] Subtask: Add a block to the project README listing the canonical commands and their purpose
- [x] Subtask: Document the gate order: `lint -> build -> e2e`

### Review Findings (Code Review — 2026-07-07)

**Patch (resolved):**
- [x] [Review][Patch] Fix README: `npm run test` runs E2E only, not "full test suite" [README.md:54]
- [x] [Review][Patch] Move lint step before Playwright browser install in CI [playwright_push.yml:23-24]
- [x] [Review][Patch] Add `wait-on` to devDependencies so CI isn't fetching at runtime [playwright_push.yml:31]
- [x] [Review][Patch] Kill preview server background process after CI tests complete [playwright_push.yml:31-33]

**Deferred:**
- [x] [Review][Defer] No `pretest` guard for Playwright browser installation — acceptable, one-time setup
- [x] [Review][Defer] Workflow filename `playwright_push.yml` is narrower than scope — renaming is disruptive
- [x] [Review][Defer] `test` name locked for E2E — story 2.2 will expand it to include unit tests
- [x] [Review][Defer] Server/test conflated in CI step — pre-existing pattern, not introduced here
- [x] [Review][Defer] `upload-artifact` version mismatch (v4 vs v6) — pre-existing, out of scope

### Testing
- [x] **Task 5**: Verify CI workflow changes.
- [x] Subtask: Run `npm run lint` — passes ✓
- [x] Subtask: Run `npm run build` — passes ✓
- [x] Subtask: Run `npm run test:e2e` — passes (requires dev server) ✓

## Dev Notes

### Current Script State
- `package.json` has: `lint`, `build`, `test:e2e:*` variants, `preview`
- Missing: `test` or `test:unit` command (will be added in story 2.2)
- CI uses `npx playwright test` directly instead of `npm run test:e2e`
- CI does not run `npm run lint` explicitly
- CI uses `npm run preview` + `wait-on` + direct playwright command — should use `npm run test:e2e` with `BASE_URL`

### CI Workflows
- `playwright_push.yml`: runs on push/PR to main. Installs deps, builds, starts preview, runs playwright, uploads artifacts.
- `upload_dist.yml`: manual trigger for deployment. Builds, deploys via FTP, then validates with Playwright against production URL.

### Files to Modify
- `package.json` (add missing scripts)
- `.github/workflows/playwright_push.yml` (use canonical commands)
- `README.md` (document canonical commands)

### Previous Story Intelligence (1.4)
- Script `create_thumbnails.sh` is a data-preparation tool, not part of verification gates
- E2E tests validate all user-facing behavior including year filter, lightbox, and metadata

## Dev Agent Record

### Debug Log
- [x] Audit current npm scripts vs CI usage
- [x] Add canonical scripts
- [x] Update CI workflows
- [x] Document commands
- [x] Verify with full gate run

### Completion Notes
- Added `test` script to package.json (delegates to `test:e2e` for now)
- Updated `playwright_push.yml` CI workflow: added `npm run lint` step, replaced raw `npx playwright test` with `npm run test:e2e`
- Added "Verification Commands" and "E2E Test Commands" sections to README documenting the canonical gate order: lint → build → test
- Verified: lint ✓, build ✓

## File List
- [x] `package.json` (modified)
- [x] `.github/workflows/playwright_push.yml` (modified)
- [x] `README.md` (modified)

## Change Log
- [x] Story created and marked as ready-for-dev.
- [x] Standardized verification command set: added `test` script, updated CI to use canonical npm scripts, documented gate order in README.
