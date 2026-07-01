## Deferred from: code review of 1-1-metadata-safe-lightbox-rendering.md (2026-06-27)

- Lightbox still dereferences `photos[index]` without an undefined guard at `src/components/Lightbox.tsx:81`; this risk appears pre-existing and not introduced by the current metadata fallback change.
