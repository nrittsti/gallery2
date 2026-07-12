# Story 2.4: CI Gate Order Enforcement and Contract-Test Triggering

Status: ready-for-dev

## Story

As Nico,
I want CI to enforce gate order and contract tests for shape-impacting changes,
So that risky changes cannot merge without compatibility evidence.

## Acceptance Criteria

1. **AC1: CI enforces gate order**
   Given a CI pipeline run
   When the pipeline executes
   Then steps run in the order: `lint -> build -> unit -> e2e`
   And a failure in any gate halts the pipeline before the next gate starts

2. **AC2: Contract tests exist for context contracts**
   Given the `FilterType` and `LightboxType` interfaces
   When contract tests run
   Then they verify that context providers and consumers agree on shape
   And they detect when a required field is added, removed, or its type changes

3. **AC3: Contract tests exist for hook output shape**
   Given the `usePhotos` hook return type (`PhotoProps[]`)
   When contract tests run
   Then they verify the output shape matches what Gallery and Lightbox components expect
   And they detect breaking changes in the photo data contract

4. **AC4: Contract tests exist for adapter schema**
   Given the `photos.json` data schema
   When contract tests run
   Then they verify the adapter output conforms to `PhotoProps` interface
   And they detect structural changes (missing fields, type mismatches)

5. **AC5: Contract tests run on shape-impacting changes**
   Given a PR that modifies context contracts, adapter schema, or hook output shape
   When CI runs
   Then contract tests are triggered as part of the unit gate
   And a contract test failure blocks the pipeline

## Tasks / Subtasks

### Contract Test Implementation

- [ ] **Task 1**: Create contract test utilities (AC: 2, 3, 4)
  - [ ] Create `tests/unit/contract-helpers.ts` with type-check assertion helpers
  - [ ] Implement helper that performs runtime shape validation against a type definition
  - [ ] Implement helper that generates test data conforming to a known interface

- [ ] **Task 2**: Write contract tests for context contracts (AC: 2)
  - [ ] Test: `FilterType` shape validation (year: number | null, setYear: function)
  - [ ] Test: `LightboxType` shape validation (show: boolean, setShow, index: number, setIndex)
  - [ ] Test: detect missing field in context provider
  - [ ] Test: detect type mismatch in context value

- [ ] **Task 3**: Write contract tests for hook output shape (AC: 3)
  - [ ] Test: `usePhotos` returns `PhotoProps[]`
  - [ ] Test: each returned photo has required fields (year, grid, lightbox, file)
  - [ ] Test: photo fields match expected types

- [ ] **Task 4**: Write contract tests for adapter schema (AC: 4)
  - [ ] Test: `photos.json` entries parse to valid `PhotoProps`
  - [ ] Test: all required fields are present in data
  - [ ] Test: type assertions for numeric vs string fields

### CI Gate Verification

- [ ] **Task 5**: Verify CI gate order (AC: 1)
  - [ ] Audit `.github/workflows/playwright_push.yml` for correct step ordering
  - [ ] Confirm steps run: lint -> build -> test:unit -> test:e2e
  - [ ] Add a `fail-fast` configuration if missing
  - [ ] Document the gate contract in a CI comment or README

### Final Verification

- [ ] **Task 6**: Run the full test suite and confirm green (All ACs)
  - [ ] Run `npm run test:unit` and confirm contract tests pass
  - [ ] Run `npm run lint` and confirm no new issues
  - [ ] Run `npm run build` and confirm no type errors

## Dev Notes

### Contract Test Approach

Contract tests use TypeScript's type system at compile time and runtime shape checks. The approach:

- **Compile-time**: Use `satisfies` or type assertions that fail TypeScript compilation when shapes diverge
- **Runtime**: Use JSON schema validation or manual shape checks against known interfaces

For this project, a lightweight approach is best — define expected shapes as test-time constants and assert against them:

```typescript
// Compile-time contract test
type _FilterTypeContract = Parameters<typeof createContext<FilterType>>[0]
// If FilterType changes shape, this test will fail to compile
```

```typescript
// Runtime shape test
const requiredPhotoFields = ['year', 'grid', 'lightbox', 'file', 'width', 'height']
test('all photos have required fields', () => {
  for (const photo of allPhotos) {
    for (const field of requiredPhotoFields) {
      expect(photo).toHaveProperty(field)
    }
  }
})
```

### Architecture Compliance

- **AD-3 (Verification gate)**: This story explicitly enforces the gate contract and adds contract tests for shape-impacting changes
- **AD-2 (State ownership)**: Contract tests verify `FilterContext`/`LightboxContext` shapes are stable
- **AD-4 (Schema tolerance)**: Adapter schema contract tests verify `PhotoProps` shape is maintained

### Previous Story Intelligence (2.3)

- Unit test infrastructure is mature: 36 tests across 4 files
- Vitest + @testing-library/react fully configured
- `tests/unit/fixtures.ts` has reusable photo data
- Lightbox and hook tests already exercise core behaviors
- Build required `vite/client` in `tests/tsconfig.json` types array

### Files to Create

- `tests/unit/contract-helpers.ts` — contract test utilities
- `tests/unit/contract-tests.test.ts` — contract tests for contexts, hooks, adapter

### Files to Modify

- `.github/workflows/playwright_push.yml` — add fail-fast if missing, verify gate order
- `README.md` — update gate documentation if needed

### Testing Notes

- Contract tests should be FAST — no DOM rendering needed
- Type-level contract tests (compile-time checks) are preferred where possible
- Runtime contract tests should use the same fixture data as other unit tests
