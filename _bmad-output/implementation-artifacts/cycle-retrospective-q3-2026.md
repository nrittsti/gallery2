# Cycle Retrospective — Gallery Q3 2026

**Date:** 2026-07-24
**Cycle:** Epic 1-4 — Reliability, Testing, Modernization, and Closure

---

## What Went Well

### Solid verification foundation (Epic 2)
The standardized command set and CI gate order (`lint → build → unit → e2e`) paid off consistently — every upgrade batch and story change was verified against the same gates, and the results were reproducible across local and CI.

### Upgrade batches with evidence (Epic 3)
The batch framework with single-owner, single-batch-in-flight, and evidence template made dependency modernization safe. Both Batch A (minor/patch) and Batch B (major with remediation) passed all gates with zero rollbacks.

### Zero high-impact regressions
All 48 issues across the cycle were tracked to closure in the regression log. No unresolved high-impact regressions existed at cycle end. The deferred-major ledger ensured intentional deferrals are documented and revisit-triggered.

### Documentation as a first-class output
MAINTENANCE.md, the deferred-major ledger, regression closure log, and operational handoff snapshot were all created as artifacts that make the next cycle easier to start.

## What Could Be Improved

### Front-loaded deep audit would catch more
The regression closure log (Story 4.2) initially missed 18 latent issues that were only found during code review's deep re-audit of prior story Dev Notes. A systematic per-story audit step earlier in the process would have caught these the first time.

### Documentation-only stories still need lightweight review
Stories 4.2, 4.3, and 4.4 were documentation-only but the review workflow is designed for code diffs. A lighter review path for documentation changes would save time.

### Some deferred items are carry-overs from cycle start
Pre-existing items (no Safari coverage, no `npm audit` in gates, no performance thresholds) were deferred through the entire cycle. These should either be addressed or explicitly accepted as permanent decisions rather than carried as deferred.

## Key Process Gaps for Next Cycle

| Priority | Gap | Epic Origin |
|----------|-----|-------------|
| High | `photos[index]` without undefined guard — latent crash vector | 1.1 |
| High | No UI mechanism to clear year filter (AC2 gap) | 1.3 |
| Medium | No Safari/WebKit e2e coverage | Pre-existing |
| Medium | No `npm audit` in verification gates | 3.1 |
| Medium | Security-patch fast-track not defined | 3.1 |
| Medium | Hardcoded lens correction could corrupt genuine f/1.0 metadata | 1.4 |
| Medium | No JSON escaping for exiftool metadata values | 1.4 |
| Low | Non-atomic effect-based revalidation (React lifecycle gap) | 1.2 |
| Low | No formal performance thresholds | Pre-existing |
| Low | Flickery `waitForTimeout(100)` in year filter test | 1.3 |

## Action Items

1. **Resolve top-2 high-priority items before next feature cycle**
   - Add bounds guard to `photos[index]` in Lightbox
   - Add "All" / "Clear" button to year filter navigation
   - Owner: Nico

2. **Decide on permanent disposition of carry-over gaps**
   - Either add Safari coverage, `npm audit`, and performance thresholds
   - Or explicitly accept them as permanent project decisions and remove from deferred lists
   - Owner: Nico

3. **Add `npm outdated` to next-cycle prerequisites**
   - Check deferred-major-ledger revisit triggers at cycle start
   - vitest 5.x may have a stable release by next cycle
   - Owner: Nico

## Artifacts

- [deferred-major-ledger.md](deferred-major-ledger.md) — 3 deferred upgrades
- [regression-closure-log.md](regression-closure-log.md) — 48 issues tracked
- [operational-handoff-snapshot.md](operational-handoff-snapshot.md) — cycle capstone
- [MAINTENANCE.md](../../MAINTENANCE.md) — canonical maintenance checklist
- [ARCHITECTURE-SPINE.md](../planning-artifacts/architecture/architecture-Gallery-2026-06-27/ARCHITECTURE-SPINE.md) — design invariants
