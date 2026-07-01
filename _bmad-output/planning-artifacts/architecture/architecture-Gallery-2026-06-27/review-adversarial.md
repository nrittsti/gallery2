# Adversarial Review - Compatibility Holes

## Verdict

Initial spine had integration holes despite compliant local implementations. Reviewer findings were accepted and closed by tightening AD-2/AD-3/AD-4 and adding AD-6.

## Top Findings and Resolution

- **High:** Sentinel drift for year clearing (`null` vs `undefined`/string) could split behavior.
  - **Resolution:** AD-2 now enforces `null` as the only clear-year sentinel.
- **High:** Filter changes could leave stale lightbox selection/index.
  - **Resolution:** Added AD-6 synchronization invariant requiring atomic revalidation or lightbox close.
- **High:** Adapter normalization contract was implicit and could diverge from hook expectations.
  - **Resolution:** AD-4 now requires a single normalized adapter output schema shared with hooks/components.
- **Medium:** Gate sequence did not explicitly require compatibility contract tests.
  - **Resolution:** AD-3 now requires contract tests when context/hook output/adapter schema changes.

## Status

No open critical compatibility holes remain for feature-level story breakdown.
