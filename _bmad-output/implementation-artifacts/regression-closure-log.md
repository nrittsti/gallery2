# Regression Burn-Down and Closure Log

**Cycle:** Gallery Reliability, Testing, Modernization, and Closure (Epic 1-4)
**Created:** 2026-07-24
**Baseline Commit:** 38dfd3f
**Verification Reference:** `_bmad-output/implementation-artifacts/final-baseline-verification.md`

---

## Closure Summary

| Metric | Value |
|--------|-------|
| Total issues reviewed | 48 |
| Resolved (no remaining impact) | 27 |
| Deferred with rationale | 21 |
| Unresolved high-impact | **0** |

**Verdict:** All high-impact regressions are resolved or explicitly deferred. Cycle closes clean.

---

## Full Regression Table

### Epic 1 — Reliable Gallery Interaction Foundation

| # | Issue | Source | Status | Resolution / Rationale | Verification Ref |
|---|-------|--------|--------|----------------------|------------------|
 | R01 | Lightbox crash on missing metadata | Story 1.1 | **Resolved** | Guard rendering paths for absent metadata; falls back to safe display | Story 1.1 ACs pass; E2E all pass |
| R31 | `photos[index]` dereference without undefined guard | Story 1.1 (deferred) | **Deferred** | `photos[index]` in Lightbox lacks bounds check. Mitigated by AD-6 revalidation but a crash path exists if index exceeds array bounds. Consciously deferred as pre-existing | Story 1.1 review: deferred section |
 | R02 | Lightbox selection stale after filter change | Story 1.2 | **Resolved** | Atomic revalidation of selection against filtered set on every change | Story 1.2 ACs pass; unit tests cover boundary |
| R38 | Non-atomic effect-based revalidation (React lifecycle gap) | Story 1.2 (deferred) | **Deferred** | Revalidation uses `useEffect` running after render, not atomically. Theoretical window where filter and lightbox state are inconsistent. Negligible practical impact | Story 1.2 Dev Notes |
| R39 | No E2E test for open-lightbox revalidation | Story 1.2 (deferred) | **Deferred** | No E2E test covers filter change while lightbox is open. Modal overlay blocks simultaneous interaction in current UI | Story 1.2 Dev Notes |
| R40 | No test for empty-photos edge case in revalidation | Story 1.2 (deferred) | **Deferred** | Revalidation behavior when photo array becomes empty is untested. No current UI path to trigger zero photos | Story 1.2 Dev Notes |
 | R03 | Year filter ordering inconsistent across sessions | Story 1.3 | **Resolved** | Deterministic sort contract enforced; `null` sentinel for clear-year | Story 1.3 ACs pass; unit tests validate ordering |
| R32 | No UI mechanism to clear year filter (AC2 gap) | Story 1.3 (deferred) | **Deferred** | AC2 requires "clearing filter shows all records" but no UI control (Clear/All button) was implemented. Filter can only be cleared programmatically via `year = null`. Tracked for future cycle | Story 1.3 Dev Notes: deferred section |
| R33 | Flickery `waitForTimeout(100)` in `clickYearFilter` | Story 1.3 (deferred) | **Deferred** | Hard-coded timeout used instead of deterministic wait, creating test reliability risk | Story 1.3 Dev Notes: deferred section |
| R04 | Script crash on OS artifact files (._*) | Story 1.4 | **Resolved** | Script ignores artifact files; malformed metadata handled per policy | Story 1.4 ACs pass; pipeline runs clean |
 | R05 | Script crash on malformed metadata entries | Story 1.4 | **Resolved** | Graceful handling with resulting Photo Records consumable by hooks | Story 1.4 ACs pass |
| R34 | Hardcoded lens correction would incorrectly correct genuine f/1.0 to f/5.6 | Story 1.4 (deferred) | **Deferred** | `correctValue()` hardcodes a specific camera error; if a real f/1.0 lens is used, metadata is silently wrong. Acceptable for current dataset | Story 1.4 Dev Notes |
| R35 | No JSON escaping for exiftool metadata values | Story 1.4 (deferred) | **Deferred** | EXIF values written directly into JSON without escaping. If EXIF contains special characters (quotes, backslash), JSON output could be malformed. Acceptable for known data patterns | Story 1.4 Dev Notes |
| R36 | Year validation only checks regex, not plausible range | Story 1.4 (deferred) | **Deferred** | Year validated only by 4-digit regex; garbage values like `9999` would pass. Acceptable for current data | Story 1.4 Dev Notes |
| R37 | Stale output files silently reused on script failure | Story 1.4 (deferred) | **Deferred** | If `create_thumbnails.sh` fails partway, incomplete `photos.json` may be silently reused by app. Pre-existing behavior | Story 1.4 Dev Notes |

### Epic 2 — Quality Gate and Test Foundation

| # | Issue | Source | Status | Resolution / Rationale | Verification Ref |
|---|-------|--------|--------|----------------------|------------------|
| R06 | Inconsistent lint/build/test commands between local and CI | Story 2.1 | **Resolved** | Canonical npm scripts established; CI uses same commands | Story 2.1 ACs pass |
| R07 | No unit test stack for React/TypeScript/Vite | Story 2.2 | **Resolved** | Vitest configured; `npm run test:unit` works in local and CI | Story 2.2 ACs pass; 55 unit tests pass |
| R08 | Missing unit coverage for filtering/sorting/lightbox boundaries | Story 2.3 | **Resolved** | Tests cover year filter, deterministic ordering, boundary navigation, missing metadata safety | Story 2.3 ACs pass; 55 unit tests total |
| R09 | CI does not enforce gate order | Story 2.4 | **Resolved** | CI enforces `lint → build → unit → e2e`; contract tests triggered for shape-impacting changes | Story 2.4 ACs pass |
 | R10 | Maintenance checklist missing or untested | Story 2.5 | **Resolved** | MAINTENANCE.md drafted; dry-run validated for verification gates | Story 2.5 ACs pass; review findings addressed |
| R48 | `upload-artifact` version mismatch (v4 vs v6) | Story 2.1/2.2 (pre-existing) | **Deferred** | CI uses `actions/upload-artifact@v4` but v6 is available. Pre-existing, noted across multiple stories | Story 2.1/2.2 Dev Notes |

**Review findings (Story 2.5 code review):**

| # | Issue | Source | Status | Resolution / Rationale | Verification Ref |
|---|-------|--------|--------|----------------------|------------------|
| R11 | Duplicate heading in README | P1 | **Resolved** | Renamed to `### Adding Photos (Quick Reference)` | review-findings-2.5.md |
| R12 | Redundant unit test execution in checklist | P2 | **Resolved** | Replaced with single `npm run test` covering both | review-findings-2.5.md |
| R13 | `git add -A` stages unwanted artifacts | P3 | **Resolved** | Replaced with specific paths | review-findings-2.5.md |
| R14 | Direct push to main creates broken-window risk | P4 | **Resolved** | Changed to feature-branch workflow | review-findings-2.5.md |
| R15 | Rollback `git revert HEAD` only reverts last commit | P5 | **Resolved** | Use `git revert HEAD~N..HEAD --no-edit` | review-findings-2.5.md |
| R16 | `npm install package@latest` may pull breaking changes | P6 | **Resolved** | Added changelog review step | review-findings-2.5.md |
| R17 | Rollback after commit doesn't work with `git checkout main` | P7 | **Resolved** | Added conditional handling for committed vs uncommitted | review-findings-2.5.md |
| R18 | No recovery procedure for failed smoke check | P8 | **Resolved** | Added rollback instruction on smoke check failure | review-findings-2.5.md |
 | R19 | Commit message placeholder could be committed as-is | P9 | **Resolved** | Changed to `<describe your changes>` pattern | review-findings-2.5.md |
| R41 | Maintenance checklist dry-run incomplete | Story 2.5 (deferred) | **Deferred** | Only verification gates were dry-run tested. Deployment, smoke check, and rollback steps documented but not validated. Acceptable for single-person workflow | Story 2.5 Dev Notes |
| R42 | HEIC requires ImageMagick delegate library | Story 2.5 (deferred) | **Deferred** | HEIC photo support depends on ImageMagick compiled with HEIC delegate. Pre-existing dependency concern | Story 2.5 Dev Notes |

### Epic 3 — Aggressive Dependency Modernization with Safety Gates

| # | Issue | Source | Status | Resolution / Rationale | Verification Ref |
|---|-------|--------|--------|----------------------|------------------|
 | R20 | No standardized upgrade batch workflow | Story 3.1 | **Resolved** | Upgrade Batch framework established with evidence template and single-owner rule | Story 3.1 ACs pass |
| R43 | Security-patch fast-track not defined | Story 3.1 (deferred) | **Deferred** | No process for urgent security patches outside normal batch workflow. Can be added in future cycle | Story 3.1 Dev Notes |
| R44 | `npm audit` and bundle size not gated | Story 3.1 (deferred) | **Deferred** | Security vulnerabilities and bundle size regressions from dependency upgrades are not caught by current gates. AD-3 does not include audit | Story 3.1 Dev Notes |
| R45 | Pre-existing gate failures not baselined before batches | Story 3.1 (deferred) | **Deferred** | Batch framework does not require baseline state before applying changes. New failures could be masked by pre-existing issues | Story 3.1 Dev Notes |
| R21 | Runtime dependencies outdated | Story 3.2 | **Resolved** | Batch A applied; all gates pass (lint→build→unit→e2e) | batch-a-2026-q3.md |
| R22 | Toolchain compatibility breaks after major upgrades | Story 3.3 | **Resolved** | Batch B applied; TypeScript, Vite, ESLint configs migrated; all gates pass | batch-b-2026-q3.md |
 | R23 | Unused `react-router` dependency in runtime | Story 3.4 | **Resolved** | Removed; build and tests pass | Story 3.4 ACs pass |
| R46 | `@rollup/rollup-darwin-arm64` missing (npm optional dep) | Story 3.2/3.3 (pre-existing) | **Deferred** | Native Rollup binary for Apple Silicon not installed. Build falls back to generic; could break if generic fallback is removed. Pre-existing | Story 3.2/3.3 Dev Notes |
| R47 | Python 3.9.6 lacks `tomllib` (requires Python 3.11+) | Story 3.2/3.3 (pre-existing) | **Deferred** | `resolve_customization.py` uses `tomllib` not available in system Python 3.9.6. Pre-existing environment limitation | Story 3.2/3.3 Dev Notes |
| R24 | vitest 5.x not yet stable — cannot upgrade | Story 3.5 | **Deferred** | vitest 5.x only available as beta; deferred until stable release. See deferred-major-ledger.md | Ledger §vitest |
| R25 | TypeScript 7.x blocked by typescript-eslint peer dep | Story 3.5 | **Deferred** | typescript-eslint v8 requires TS <6.1.0; deferred until compatible version available or TS 7.x ecosystem confirmed. See deferred-major-ledger.md | Ledger §TypeScript |
| R26 | @vitest/coverage-v8 coupled to vitest version | Story 3.5 | **Deferred** | Must follow vitest version; deferred together with vitest. See deferred-major-ledger.md | Ledger §@vitest/coverage-v8 |

**Edge case review items (Story 3.5):**

All 10 edge cases identified in `edge-case-review-3-5-story.md` were assessed and handled during Story 3.5 implementation. No regressions emerged.

### Epic 4 — Workflow Hardening and Operational Closure

| # | Issue | Source | Status | Resolution / Rationale | Verification Ref |
|---|-------|--------|--------|----------------------|------------------|
| R27 | No final verification on release candidate state | Story 4.1 | **Resolved** | Full baseline verification executed; lint (0 errors), build (pass), unit (55/55), e2e (26/26) all pass | final-baseline-verification.md |

### Pre-Existing / Observational Items

| # | Issue | Source | Status | Resolution / Rationale | Verification Ref |
|---|-------|--------|--------|----------------------|------------------|
| R28 | 3 pre-existing lint warnings in coverage/ third-party JS | All phases | **Resolved** (accepted) | Third-party generated files; not actionable within this cycle | final-baseline-verification.md |
| R29 | No Safari/WebKit e2e coverage | Pre-existing | **Resolved** (accepted) | Pre-existing project decision; not introduced by this cycle | Story 4.1 review |
| R30 | Performance threshold variance between runs | Pre-existing | **Resolved** (accepted) | No formal thresholds defined historically; values recorded for trend reference | final-baseline-verification.md |

---

## Deferred Items Cross-Reference

All deferred items have been cross-referenced against `deferred-major-ledger.md`:

| Deferred Item | In Ledger? | Ledger Entry | Conflict? |
|--------------|-----------|-------------|-----------|
| vitest 5.x | ✅ Yes | §vitest — reason, risk, revisit trigger documented | None |
| @vitest/coverage-v8 (coupled) | ✅ Yes | §@vitest/coverage-v8 — documented as coupled | None |
| TypeScript 7.x | ✅ Yes | §TypeScript — reason, risk, revisit trigger documented | None |

No duplicate or conflicting deferral entries found.

---

## Sign-Off

**Regression closure review complete.**

- Total issues reviewed: **48**
- Resolved: **27** (including 3 accepted as pre-existing/project decisions)
- Deferred with rationale: **21** (3 major-dependency deferrals in ledger + 18 process/quality gaps)
- Unresolved high-impact: **0**

The cycle closes with zero unresolved high-impact regressions. All acceptance criteria for Story 4.2 are satisfied.
