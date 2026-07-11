# GTP_Port Build Order

Last updated: 2026-07-11
Working branch: `gpt-handoff`
Verified baseline: remote commit `2e5aa86` plus delivered Chunks 1 through 3A

## Current phase

> Accessibility and shared shell completion

The functional content core is complete. Astro builds the site directly, TinaCMS runs locally, Markdown remains the source of truth, and the interrupted placeholder components have been restored or removed.

## Verified complete

- Static Astro 6.4.6 architecture
- Subscription-free local TinaCMS workflow
- Seven focused Tina collections
- Nine generated static pages
- Journal and Portfolio detail routes
- Portfolio galleries, lightbox, native video, YouTube, and Vimeo
- Automatic lightbox for inline project-story images
- Related Journal entries and Portfolio projects
- Structured Resume editor and timeline
- No zero-byte files under `src/`
- `npm run build` and `git diff --check` pass

## Publishing workflow

```text
Pull gpt-handoff
-> npm run dev
-> edit through local Tina
-> review the site
-> npm run build
-> commit and push in VS Code
-> Cloudflare Pages rebuilds
```

TinaCloud and a hosted production `/admin/` are intentionally excluded.

## Next build order

### Chunk 4A - Accessibility foundation

- Add a skip link.
- Add global visible `:focus-visible` styles.
- Mark the current navigation destination.
- Add reduced-motion handling.
- Verify keyboard navigation and color contrast.

### Chunk 4B - Mobile navigation

- Replace wrapping navigation with a deliberate compact menu.
- Support keyboard and screen-reader operation.
- Prevent clipping at narrow widths.

### Chunk 4C - Shared metadata cleanup

- Verify favicon behavior.
- Add consistent page descriptions.
- Prepare canonical and social metadata for the launch milestone.

### Then

- Page-by-page design refinement
- Real content replacement
- SEO, RSS, sitemap, robots, and image optimization
- Search and launch checks

## Deferred integrations

- Inline narrative video blocks
- Immich albums
- Pagefind
- Giscus
- Resume PDF generation
