---
project_name: 'Gallery'
user_name: 'Nico'
date: '2026-06-27'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
existing_patterns_found: 12
status: 'complete'
rule_count: 49
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- Runtime/app: React `^19.2.0`, React DOM `^19.2.0`, TypeScript `~5.9.3`
- Build toolchain: Vite `^7.2.4`, `@vitejs/plugin-react` `^5.1.1`
- UI system: Bootstrap `^5.3.8`, React-Bootstrap `^2.10.10`, Bootstrap Icons `^1.13.1`
- Routing: React Router `^7.11.0`
- Linting: ESLint `^9.39.1`, `@eslint/js` `^9.39.1`, `typescript-eslint` `^8.46.4`, `eslint-plugin-react-hooks` `^7.0.1`, `eslint-plugin-react-refresh` `^0.4.24`
- Testing (E2E): Playwright `^1.57.0` with Chromium and Firefox projects
- TypeScript constraints: `strict: true`, `moduleResolution: "bundler"`, `verbatimModuleSyntax: true`, `noUncheckedSideEffectImports: true`, `noUnusedLocals: true`, `noUnusedParameters: true`

## Critical Implementation Rules

### Language-Specific Rules

- Keep TypeScript in strict mode and satisfy all compiler/lint checks; do not suppress diagnostics unless unavoidable and documented.
- Use ESM imports consistently and follow current file-extension style used in app code (explicit `.tsx` in local imports where already established).
- Use `import type` for type-only imports to preserve clean runtime output.
- Keep React state and context types explicit (for example `useState<number | null>` and typed `createContext<...>` defaults).
- Preserve null-safety patterns around DOM and data access (for example non-null root mount and guarded touch/lightbox flows).
- Prefer typed pure transforms for collection work; avoid hidden mutation side effects when filtering/sorting photo arrays.
- Keep browser event handlers typed (`KeyboardEvent`, `React.TouchEvent`) and ensure key-path behavior is intentional.

### Framework-Specific Rules

- Use function components only; keep component files in `src/components` with PascalCase naming.
- Use React Context for cross-component UI state already modeled in this app (`FilterContext`, `LightboxContext`) instead of introducing new global state libraries.
- Keep reusable data derivation in hooks (for example `usePhotos`) and memoize computed collections when tied to filter state.
- Preserve current app shell composition in `App.tsx`: navigation in header, gallery and lightbox in main, footer in footer.
- Keep Bootstrap and React-Bootstrap as the primary layout system (`Container`, `Row`, `Col`, `Card`, `Modal`, `Navbar`, `Button`) before custom primitives.
- Preserve lightbox UX contract: keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`, space), swipe gestures, bounded previous/next behavior.
- When adding route-level features, align with React Router usage already installed; do not bypass router patterns with manual URL handling.

### Testing Rules

- Use Playwright E2E tests under `tests/` as the primary automated test layer for UI behavior.
- Follow the existing page-object helper pattern in `tests/helpers.ts` (encapsulate selectors and interactions in `GalleryPage` methods).
- Keep specs behavior-focused and user-visible (gallery render, lightbox open/close, keyboard navigation, metadata visibility) instead of implementation details.
- Use stable selectors aligned with existing markup contracts (`.gallery-card`, `.modal.show`, role-based button queries) and avoid brittle deep CSS chains.
- Preserve cross-browser execution coverage for Chromium and Firefox projects unless a test is explicitly browser-scoped.
- Keep performance assertions realistic and explicit for key paths (gallery load and lightbox open), with clear thresholds and intent.
- Prefer deterministic waits (`waitForSelector`, visibility/hidden states) over arbitrary timeouts.

### Code Quality & Style Rules

- Follow ESLint flat config as source of truth (`eslint.config.js`) for TypeScript and React files; resolve lint issues instead of disabling rules by default.
- Keep naming consistent with current codebase: PascalCase for components and types, camelCase for functions and variables, descriptive method names in test helpers.
- Preserve current folder boundaries: `src/components`, `src/context`, `src/hooks`, `src/types`, `tests`.
- Keep components small and single-purpose; move shared behavior into hooks and helpers instead of duplicating logic.
- Maintain accessibility-forward markup where possible (meaningful alt text, button roles and labels, keyboard operability for modal flows).
- Minimize inline styles; prefer component CSS files already used in the project (`gallery.css`, `lightbox.css`, and related files) for reusable styling.
- Avoid noisy debug logging in committed code (`console.log`) unless it serves an intentional operational or debugging purpose.

### Development Workflow Rules

- Use npm scripts in `package.json` as canonical workflow entry points (`dev`, `build`, `lint`, `test:e2e:*`).
- Validate changes locally with targeted checks before merge: at minimum `npm run lint`; run relevant Playwright specs for UI behavior changes.
- Keep E2E runs environment-aware: default base URL `http://localhost:5173`, override with `BASE_URL` for deployed or staging targets.
- Preserve CI parity assumptions from Playwright config (`forbidOnly` on CI, retries on CI, single worker on CI) when adding new tests.
- Keep changes scoped and cohesive by feature area (component plus hook plus tests together) to reduce regression risk in gallery and lightbox flows.
- When adjusting selectors or UI text, update affected page-object helpers and specs in the same change to keep tests green.
- Treat generated artifacts (`dist/`, Playwright reports) as build outputs, not source-of-truth code.

### Critical Don't-Miss Rules

- Do not break the lightbox interaction contract: open on gallery image click, close reliably, preserve bounded previous/next behavior, and keep keyboard and touch navigation functional.
- Do not assume photo metadata fields are always complete; guard rendering paths so missing values do not crash modal or list views.
- Do not introduce untyped context values or `any` shortcuts that bypass strict TypeScript guarantees already enforced by configuration.
- Do not mutate shared photo collections in ways that leak across renders; keep filtering and sorting behavior predictable and tied to selected-year state.
- Do not replace stable test selectors without updating `GalleryPage` helpers and affected specs in the same change.
- Do not regress accessibility basics in modal and gallery flows (focusable controls, readable labels, meaningful image alt text).
- Do not commit temporary debugging artifacts (excessive logs, ad-hoc waits, local-only test hacks) that reduce reliability across browsers and CI.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code in this repository.
- Follow all documented rules unless a user instruction explicitly overrides them.
- Prefer the more restrictive or existing-project pattern when multiple options exist.
- Update this file when new recurring patterns become part of the project standard.

**For Humans:**

- Keep this file lean and focused on non-obvious implementation guidance.
- Update stack and rules when dependencies, architecture, or workflow conventions change.
- Review periodically and remove rules that are obsolete or now obvious.

Last Updated: 2026-06-27
