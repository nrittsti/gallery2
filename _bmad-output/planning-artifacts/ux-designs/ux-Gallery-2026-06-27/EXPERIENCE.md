---
name: Gallery
status: draft
created: 2026-06-27
updated: 2026-06-27
design: DESIGN.md
status: final
sources:
  - codebase: src/components
  - codebase: src/context
  - codebase: src/hooks
companions:
  - DESIGN.md
---

# Experience: Nico's Photo Gallery

## Foundation

- **Form factor:** Responsive web (desktop and mobile browsers).
- **UI system:** Bootstrap 5 dark theme via React-Bootstrap. Visual identity reference: `DESIGN.md`.
- **Framework:** React 19 function components, TypeScript, Vite.
- **State pattern:** React Context (`FilterContext`, `LightboxContext`) for cross-component UI state; `usePhotos` hook for data derivation.

## Information Architecture

```
Home (single page)
  Navigation (fixed-top)
    Brand: "Nico's Photo Gallery"
    Year filter: [2025] [2024] [2023] [2022]
  Gallery (main content)
    Photo cards (responsive grid, lazy-loaded)
  Lightbox (modal overlay)
    Image display area
    EXIF metadata panel
    Navigation controls (desktop footer, keyboard, touch)
  Footer
    Copyright
    Social links: Pixelfed, Instagram, GitHub
    License notice
```

One-page SPA with no route-level navigation. The entire experience is a single scrollable gallery with modal lightbox overlay.

## Voice and Tone

- Minimal and recessive. The site is a showcase; the photography speaks.
- Functional microcopy: "Photo X of Y", "← Previous", "Next →", "Photo was taken", EXIF field labels.
- Footer license: "All photos are under CC BY-NC-ND licence."
- No marketing or promotional language.

## Component Patterns

### Navigation Bar

Fixed top navbar persistent across all interaction states. Year links act as filter toggles; active year is visually indicated. Only one year or all years (no filter) selectable at a time.

### Gallery Grid

Responsive card grid. Cards are visually recessive (no border, square corners, dark shadow). Images lazy-loaded. Click on any card opens Lightbox at that photo index. No hover states beyond default cursor change.

### Lightbox

Full-screen modal triggered by gallery card click. Shows one photo at a time with navigable index. Image area supports touch swipe to navigate. Desktop footer provides Previous/Next buttons with disabled states at boundaries. Modal title reflects current position ("Photo X of Y").

### EXIF Metadata Panel

Right-aligned panel on desktop, stacked below image on mobile (`flex-column flex-lg-row`). Each field is a label/value pair styled per `DESIGN.md` tokens. Fields are purely presentational; missing values show empty space (no crash).

## State Patterns

| State | Owner | Values |
|---|---|---|
| Selected year | `FilterContext` | `number | null` (null = all years) |
| Lightbox visibility | `LightboxContext` | `boolean` |
| Lightbox index | `LightboxContext` | `number` (0-indexed, bounded) |
| Filtered photos | `usePhotos` hook | derived array from photos.json + year |

State transitions:
- Selecting a year filter re-derives the photo list and re-renders the gallery grid.
- Opening lightbox sets `show=true` and resets index to clicked photo position.
- Navigation (next/prev) clamps index to valid array range `[0, photos.length-1]`.
- Closing lightbox sets `show=false` and resets index to 0.
- Data/filter change while lightbox open: selection is revalidated against the new set; lightbox closes if the selected photo is no longer present.

## Interaction Primitives

| Trigger | Surface | Action |
|---|---|---|
| Click gallery card | Gallery | Open lightbox at card index |
| Click "← Previous" | Lightbox footer | Decrement index (min 0) |
| Click "Next →" | Lightbox footer | Increment index (max length-1) |
| Press Escape | Lightbox (keyboard) | Close lightbox |
| Press ArrowLeft | Lightbox (keyboard) | Previous photo |
| Press ArrowRight | Lightbox (keyboard) | Next photo |
| Press Space | Lightbox (keyboard) | Next photo |
| Swipe left (>50px) | Lightbox image (touch) | Next photo |
| Swipe right (>50px) | Lightbox image (touch) | Previous photo |
| Tap Close (×) | Lightbox header | Close lightbox |
| Click year link | Navigation | Filter gallery by year |

## Accessibility Floor

- Gallery images include `alt` attribute with creation date as descriptive text.
- Lightbox navigation buttons have accessible names ("← Previous", "Next →").
- Modal close button is standard Bootstrap `btn-close` with screen-reader support.
- Lightbox is keyboard-operable: Escape closes, Arrow keys navigate, Space advances.
- Focus management: modal trap is handled by Bootstrap React Modal.
- Color contrast: white text on dark background meets WCAG AA for body text.

Areas for future improvement: add `aria-label` to year filter links, add `role` and `aria-live` region for lightbox title updates, ensure focus returns to triggering card on modal close.

## Key Flows

### UJ-1. Nico publishes a new batch and verifies the gallery

Nico runs the image processing pipeline, deploys new photos, then opens the live site. Scrolls through gallery, confirms new thumbnails render. Opens a few in lightbox to verify metadata displays. Checks year filter excludes/populates correctly. Confirms no regressions in existing photos.

### UJ-2. Visitor browses photos by year

Visitor lands on homepage. Gallery loads with default year (2025). Scrolls through thumbnails. Clicks a different year in the nav bar. Gallery re-renders with that year's photos. Clicks a photo to open lightbox. Browses through photos using Next/Previous buttons or keyboard arrows. Views EXIF data for a photo of interest. Closes lightbox and continues scrolling.

### UJ-3. Visitor uses lightbox on mobile

Visitor on phone opens gallery. Taps a photo to open full-screen lightbox. Swipes left to see the next photo. Swipes right to go back. Taps Close to return to gallery. Lightbox footer controls are hidden on small screens; navigation is touch-only.
