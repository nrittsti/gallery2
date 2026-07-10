---
baseline_commit: cb2356f86e222714ff1e1a87b305a1afe4784774
---

# Story 2.1: Standardized Verification Command Set

**Status:** ready-for-dev

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
- [ ] **Task 1**: Audit current npm scripts vs CI usage for gaps.
  - [ ] Subtask: Identify that CI runs `npm run build` and `npx playwright test` directly — the e2e command should use the canonical `npm run test:e2e`
  - [ ] Subtask: Identify that CI does not run `npm run lint` — add it before build
  - [ ] Subtask: Identify that no `test` or `test:unit` script exists yet (unit toolchain comes in story 2.2)

- [ ] **Task 2**: Add missing canonical scripts to `package.json`.
  - [ ] Subtask: Ensure `test` is defined (even if it delegates to unit tests later in story 2.2; for now it can echo a message)
  - [ ] Subtask: Ensure `test:e2e` is the canonical e2e command used in CI

- [ ] **Task 3**: Update CI workflows to use canonical npm scripts.
  - [ ] Subtask: In `playwright_push.yml`, replace `npx playwright test` with `npm run test:e2e` and add `npm run lint` before `npm run build`
  - [ ] Subtask: In `upload_dist.yml`, verify it also uses canonical commands

- [ ] **Task 4**: Document canonical commands.
  - [ ] Subtask: Add a block to the project README listing the canonical commands and their purpose
  - [ ] Subtask: Document the gate order: `lint -> build -> e2e`

### Testing
- [ ] **Task 5**: Verify CI workflow changes.
  - [ ] Subtask: Run `npm run lint` — must pass
  - [ ] Subtask: Run `npm run build` — must pass
  - [ ] Subtask: Run `npm run test:e2e` — must pass

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
- [ ] Audit current npm scripts vs CI usage
- [ ] Add canonical scripts
- [ ] Update CI workflows
- [ ] Document commands
- [ ] Verify with full gate run

### Completion Notes

## File List
- [ ] `package.json` (modified)
- [ ] `.github/workflows/playwright_push.yml` (modified)
- [ ] `README.md` (modified)

## Change Log
- [ ] Story created and marked as ready-for-dev.
