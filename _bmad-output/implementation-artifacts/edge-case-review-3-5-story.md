```json
[
  {
    "location": "3-5-deferred-major-decision-ledger.md:13-17",
    "trigger_condition": "AC1 assumes one or more deferred majors exist",
    "guard_snippet": "Add AC1 variant: Given zero deferred majors, the ledger states 'No deferred majors at this time'",
    "potential_consequence": "If npm outdated shows all current, AC1 precondition is vacuously false"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:18-22",
    "trigger_condition": "AC2 audit fails when npm outdated errors (network, registry)",
    "guard_snippet": "Add subtask: Handle npm outdated failure — use cached batch evidence as fallback audit source",
    "potential_consequence": "Audit cannot complete if npm registry is unreachable"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:18-22",
    "trigger_condition": "AC2 says 'major deferral' but a package may have newer minor/patch availabile",
    "guard_snippet": "Clarify scope: add explicit note that minor/patch upgrades are out of scope",
    "potential_consequence": "Developer queries npm outdated and documents minors, bloating ledger scope"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:30",
    "trigger_condition": "npm outdated run before npm install after Story 3.4 removal",
    "guard_snippet": "Add subtask: Run npm install first to ensure lockfile reflects current state",
    "potential_consequence": "npm outdated may show stale metadata from prior lockfile"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:33-40",
    "trigger_condition": "Revisit trigger condition met but no action prescribed",
    "guard_snippet": "Add section: 'Upgrade Procedure on Revisit' describing how to use the trigger info",
    "potential_consequence": "Trigger documented but owner has no process to act on it"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:60-63",
    "trigger_condition": "react-router listed as 'Removed' but AC2 may treat it as 'skipped major'",
    "guard_snippet": "Add explicit subsection: 'Removed Packages' separate from deferred ledger",
    "potential_consequence": "Inventory confusion — removed vs deferred have different revisit triggers"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:45",
    "trigger_condition": "Reference in sprint-status YAML may break YAML structure",
    "guard_snippet": "Use a comment or separate field in sprint-status.yaml, not inline key-value",
    "potential_consequence": "YAML parser error or duplicate key if story_location field reused"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:26-31",
    "trigger_condition": "Batch A review finds zero deferred items — implicit branch",
    "guard_snippet": "Add subtask: Note explicitly 'No deferred items in Batch A' after review",
    "potential_consequence": "Future reader cannot distinguish 'reviewed and empty' from 'not reviewed'"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:40",
    "trigger_condition": "Latest-versions section includes packages where newer major DOES exist",
    "guard_snippet": "Add subtask: Verify 'no newer major' by checking npm view versions, not just outdated",
    "potential_consequence": "Package misclassified as 'current' when a major is available but incompatible"
  },
  {
    "location": "3-5-deferred-major-decision-ledger.md:57",
    "trigger_condition": "jsdom at 29.1.1 with no newer stable — risk of ignoring future major",
    "guard_snippet": "Add 'Next Check Date' column to revisit triggers for time-based packages",
    "potential_consequence": "Ledger documents deferral but has no prompt to re-check pending upstream releases"
  }
]
```
