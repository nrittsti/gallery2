---
name: Gallery
status: draft
created: 2026-06-27
updated: 2026-06-27
tokens:
  colors:
    bg-canvas: '#333333'
    bg-surface: '#212529'
    bg-card: transparent
    text-primary: '#ffffff'
    text-secondary: '#cccccc'
    text-exif-label: '#ffffff'
    text-exif-value: '#cccccc'
    shadow-card: '0 4px 12px rgba(0, 0, 0, 0.7)'
  typography:
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif'
    exif-label: '0.9rem/600'
    exif-value: '0.8rem/400'
  rounded:
    card: '0'
    modal: default Bootstrap
  spacing:
    container-py: 'my-4'
    grid-gap: 'g-3'
    navbar-px: 'px-3'
    footer-py: 'py-3'
  components:
    navbar: dark, fixed-top, expand-md
    card: rounded-0, border-none, lazy-loaded image
    modal: fullscreen, centered header/footer
status: final
sources:
  - codebase: src/components
  - codebase: src/context
  - codebase: index.html
companions:
  - EXPERIENCE.md
---

# Design: Nico's Photo Gallery

## Brand and Style

Personal photo gallery website. Minimal dark theme using Bootstrap 5 defaults. No custom brand marks beyond a favicon. Photography is the hero; UI stays neutral and recessive.

## Colors

| Token | Value | Usage |
|---|---|---|
| bg-canvas | `#333333` | Page background (`gallery-bg`) |
| bg-surface | `#212529` | Bootstrap dark (`bg-dark`) navbar and footer |
| bg-card | transparent | Card background defers to canvas |
| text-primary | `#ffffff` | Headings, labels, button text |
| text-secondary | `#cccccc` | EXIF value text, secondary content |
| text-exif-label | `#ffffff` | Bold metadata field labels |
| text-exif-value | `#cccccc` | Metadata values |
| shadow-card | `0 4px 12px rgba(0,0,0,0.7)` | Gallery card drop shadow |

All other color tokens inherit from Bootstrap 5 dark theme defaults (`data-bs-theme="dark"`).

## Typography

| Element | Stack | Size / Weight |
|---|---|---|
| Body | Bootstrap system-ui stack | 1rem / 400 (default) |
| Navbar brand | Bootstrap default | ~1.25rem / 400 |
| EXIF label | Bootstrap system-ui stack | 0.9rem / 600 |
| EXIF value | Bootstrap system-ui stack | 0.8rem / 400 |
| Footer text | Bootstrap default | 1rem / 400 |

## Layout and Spacing

- Page: flex column, minimum viewport height (`min-vh-100`)
- Header: `fixed-top` navbar, dark variant
- Main: `flex-grow-1` between header and footer
- Gallery: Bootstrap `Container` with `Row` + `Col` grid, `g-3` gutter
- Breakpoints: `xs(12)` / `sm(6)` / `md(4)` / `lg(3)` columns
- Lightbox body: `d-flex flex-column flex-lg-row` (stacked on mobile, side-by-side on desktop)
- Footer: `flex-column flex-md-row` with centered items

## Elevation and Depth

- Navbar: fixed-top (no additional shadow)
- Gallery cards: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7)`
- Lightbox modal: Bootstrap fullscreen (no visible backdrop gap)

## Shapes

- Gallery cards: `rounded-0` (square corners)
- Lightbox modal: Bootstrap default border-radius
- Buttons: Bootstrap default rounded

## Components

### Navigation Bar

Bootstrap `Navbar` with `bg-dark` `variant="dark"` `expand="md"`. Brand text "Nico's Photo Gallery". Collapsible nav with year filter links. Active year highlighted via Bootstrap `active` class.

### Gallery Card

Bootstrap `Card` with `rounded-0` and no border. Contains `Card.Img` with `loading="lazy"`. Click triggers lightbox. Hover cursor set to pointer.

### Lightbox Modal

Bootstrap `Modal` with `fullscreen` prop. Close button in header. Title shows "Photo X of Y". Body split into image area (touch/swipe-enabled) and EXIF metadata panel. Footer has Previous/Next buttons (hidden on mobile via `@media max-width: 768px`).

### Footer

`bg-dark text-light py-3`. Three social links (Pixelfed, Instagram, GitHub) with Bootstrap Icons. Copyright left, license right on desktop; stacked on mobile.

## Do's and Don'ts

- Do let photography dominate the visual experience; keep UI recessive.
- Do use Bootstrap utility classes for layout before custom CSS.
- Don't add decorative elements that compete with photos.
- Don't use inline styles; prefer component CSS files or Bootstrap utilities.
