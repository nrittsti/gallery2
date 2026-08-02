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

## Deferred from: code review of 2-5-maintenance-checklist-draft.md (2026-07-14)

- Dependency upgrades bypass PR/CI — acceptable for single-person project
- No photos.json schema validation in checklist — script already validates with jq
- HEIC requires ImageMagick delegate — pre-existing dependency concern
- Hardcoded production URL — single-domain project, acceptable
- Missing input dir step — handled by create_thumbnails.sh
- No recovery for missing artifacts — re-running script is implied
- Git push rejection — standard git knowledge
- CI timeout not specified — CI has 10-min timeout configured
- No previous build artifact for first deploy — edge case
- Photo with no EXIF — app already handles missing metadata
- Git revert on merge commit needs `-m` flag — covered by patch

## Deferred from: code review of 3-1-upgrade-batch-framework.md (2026-07-15)

- MAINTENANCE.md pointer replaces inline script — discoverability trade-off is acceptable for solo-project convention
- Gate script names may not exist — pre-existing project configuration question, not a framework defect
- Security-patch fast-track not defined — out of scope for initial framework, can be added in a later batch story
- Hotfix during in-flight batch — AD-5 contract is intentional; exceptional cases handled ad-hoc
- Pre-existing gate failures not baselined — general risk not specific to this framework
- Naming convention 26-letter limit — practically unreachable for a solo hobby project
- Main branch drift during multi-day batch — general git workflow concern, same for any branch-based workflow
- Peer/sub-dependency conflicts — general npm upgrade risk, not specific to this framework
- `npm audit` / bundle size not gated — out of scope; can be added in Stories 3.2/3.3 if needed

## Deferred from: code review of 3-2-batch-a-upgrade-execution.md (2026-07-15)

- typescript-eslint 18-minor version jump (8.50.1→8.64.0) — lint passed with 0 errors before and after, confirming no breaking config changes. General batch risk, not specific defect.
- No npm outdated/audit output in evidence — scope was determined from npm outdated; evidence captures current/target. Minor documentation improvement.
- Lockfile drift risk from caret ranges — standard npm behavior; `npm ci` enforces lockfile. General concern, not batch-specific.

## Deferred from: code review of 3-3-batch-b-compatibility-remediation.md (2026-07-16)

- TypeScript `~6.0` lacks inline rationale — rationale documented in story & evidence; JSON cannot have comments
- globals 17.x API change not documented in evidence — empirically verified by passing lint
- eslint-plugin-react-refresh 0.4→0.5 semver-breaking not verified — empirically verified by passing lint
- wait-on 9.x breaking changes not documented — empirically verified by passing e2e tests
- Vitest 4.x on Vite 8.x compatibility not explicitly verified — empirically verified by passing unit tests

## Deferred from: one-shot review of year-filter test update for 2026 photos (2026-08-02)

- Year-list expectation hardcoded `[2022, 2023, 2024, 2025, 2026]` instead of derived from photos.json — will break again when 2027 photos arrive; consistent with the project's accepted "data-dependent values acceptable for E2E" stance
- No behavior assertion for the new 2026 filter (count / lightbox total) — only link membership checked
- "All" view (254 photos) never asserted — every total assertion exercises the default 2025 view
- 2026 batch metadata data quality: `"Futjifilm"` typo in make/cameramodelname, lowercase `"samsung"`, 3 entries missing `make`, plus gaps in aperturevalue/focallengthin35mmformat/flash/lensmodel — render as `—` fallbacks silently
- Tests coupled to hardcoded default filter `useState<number | null>(2025)` in App.tsx:12 — undocumented latent coupling
- Clamp test (lines 171-196) uses raw DOM probe + 500ms waitForTimeout and fixed 68 iterations — fragile against react-bootstrap DOM and data growth
- Year-links test sorts scraped years before comparing, so UI ordering regressions go undetected

## Deferred from: review of data-driven e2e year/count refactor (2026-08-02)

- DEFAULT_YEAR remains a constant in src/constants.ts (2025) rather than being derived from the latest available year — app still opens on 2025 after future years are added; product decision, see spec
- Resilience test targets hardcoded index 21 (default-year 2025 photo with absent lensmodel/aperturevalue) — survives 2027 additions only because 2025 ordering is unchanged; breaks if the default year ever changes
- Clamp test clicks the literal 2022 filter link — encodes "2022 count < default-year count"; breaks if data is rebalanced so 2022 >= default-year count
- E2E now derives every expectation from photos.json, so data regressions (wrong year assignment, dropped year, duplicate) pass silently — no unit test pins real per-year counts; a data-integrity test is the mitigation
- `with { type: 'json' }` import attribute in tests/e2e/helpers.ts is inconsistent with src/utils/photos.ts and unit tests which import the same JSON without the attribute — stylistic; unify later if desired
- eslint . lints generated coverage/ output (3 warnings) — pre-existing config gap, unrelated to this change
