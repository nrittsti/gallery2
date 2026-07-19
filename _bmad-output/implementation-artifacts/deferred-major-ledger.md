# Deferred-Major Decision Ledger

Created: 2026-07-19
Source: Epic 3 — Aggressive Dependency Modernization with Safety Gates (Story 3.5)
Baseline commit: 0ed0dbb

## Purpose

This ledger documents every major-version dependency upgrade that was intentionally deferred during the Epic 3 modernization cycle. Each entry includes the reason, risk assessment, and conditions under which the upgrade should be revisited.

---

## Deferred Major Upgrades

### vitest 4.1.10 → 5.x

| Field | Value |
|-------|-------|
| **Current Version** | 4.1.10 |
| **Deferred Target** | 5.x (no stable release — only beta available) |
| **Reason for Deferral** | vitest 5.x is only available in beta; no stable release has been published as of 2026-07-19 |
| **Risk Assessment** | Low — staying on 4.x means missing 5.x performance and feature improvements, but minor security patches still land on the 4.x line |
| **Revisit Trigger** | vitest 5.x stable release |
| **Next Check Date** | Quarterly |
| **Upgrade Procedure** | Create new Upgrade Batch per AD-5; include `vitest` and `@vitest/coverage-v8` together; run gates in AD-3 order |

### @vitest/coverage-v8 4.1.10 (coupled)

| Field | Value |
|-------|-------|
| **Current Version** | 4.1.10 |
| **Deferred Target** | (coupled to vitest version) |
| **Reason for Deferral** | Must follow vitest version — cannot upgrade independently |
| **Risk Assessment** | Same as vitest — follows the same release track |
| **Revisit Trigger** | vitest 5.x stable release |
| **Next Check Date** | Quarterly |
| **Upgrade Procedure** | Upgrade together with vitest in the same batch |

### TypeScript 6.0.3 → 7.x

| Field | Value |
|-------|-------|
| **Current Version** | 6.0.3 (pinned to `~6.0`) |
| **Deferred Target** | 7.x (7.0.2 available as of 2026-07-19) |
| **Reason for Deferral** | `typescript-eslint` v8 peer dependency requires `<6.1.0`. Upgrading to TS 7.x would require `typescript-eslint` v8 to support TS 7.x, or an upgrade to `typescript-eslint` v9. Neither is confirmed compatible as of this cycle. |
| **Risk Assessment** | Medium — staying on TS 6.x means missing TS 7.x features and performance improvements. TS 6.x still receives patch updates. As TS 7.x matures, ecosystem support will follow. |
| **Revisit Trigger** | `typescript-eslint` publishes a version compatible with TS 7.x, or TS 7.x ecosystem support is confirmed at next quarterly check |
| **Next Check Date** | Quarterly |
| **Upgrade Procedure** | Create new Upgrade Batch per AD-5; check `typescript-eslint` peer dep compatibility first; update `~6.0` to `~7.0` in `package.json`; run full gates |

---

## Packages at Latest Compatible Versions

These packages have no newer major version available as of 2026-07-19:

| Package | Current Version | Notes |
|---------|----------------|-------|
| esbuild | (bundled with vite) | Managed by Vite 8.x — not independently upgradeable |
| jsdom | 29.1.1 | No newer stable version published |
| bootstrap | 5.3.8 | No newer major available |
| bootstrap-icons | 1.13.1 | No newer major available |
| react | 19.2.7 | No newer major available |
| react-bootstrap | 2.10.10 | No newer major available |
| react-dom | 19.2.7 | No newer major available |
| @eslint/js | 10.0.1 | No newer major available |
| @playwright/test | 1.61.1 | No newer major available |
| @testing-library/jest-dom | 6.9.1 | No newer major available |
| @testing-library/react | 16.3.2 | No newer major available |
| @types/node | 26.1.1 | No newer major available |
| @types/react | 19.2.17 | No newer major available |
| @types/react-dom | 19.2.3 | No newer major available |
| @vitejs/plugin-react | 6.0.3 | No newer major available |
| eslint | 10.7.0 | No newer major available |
| eslint-plugin-react-hooks | 7.1.1 | No newer major available |
| eslint-plugin-react-refresh | 0.5.3 | No newer major available |
| globals | 17.7.0 | No newer major available |
| typescript-eslint | 8.64.0 | No newer major available |
| vite | 8.1.5 | No newer major available |
| wait-on | 9.0.10 | No newer major available |

---

## Removed Packages (no longer in dependency tree)

These packages were removed from `dependencies` during the cycle (not deferred):

| Package | Version at Removal | Removed In | Reason |
|---------|-------------------|------------|--------|
| react-router | 7.18.1 | Story 3.4 | Confirmed unused — zero imports in source code |

---

## Revisit Procedure

When any deferred upgrade's revisit trigger fires:

1. Create a new Upgrade Batch following AD-5 (single owner, one batch in flight)
2. Record the package in the batch evidence template
3. Run verification gates in AD-3 order: `lint → build → unit → e2e`
4. If all gates pass: update this ledger to reflect the upgrade status
5. If gates fail: document the new reason and update the revisit trigger

---

## Audit Methodology

This ledger was audited against the installed dependencies using:
- `npm outdated` (2026-07-19) to identify packages with newer versions
- Cross-reference against `package.json` direct dependencies
- `npm view <pkg> versions` to confirm "latest compatible" status for packages at current major
- Review of Batch A (`batch-a-2026-q3.md`) and Batch B (`batch-b-2026-q3.md`) evidence for previously documented deferrals
- Review of Story 3.3 Dev Notes for excluded packages

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-07-19 | Initial ledger created with 3 deferred entries, 22 at-latest entries, 1 removed package | Nico |

