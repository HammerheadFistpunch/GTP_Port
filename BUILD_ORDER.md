# GTP_Port Build Order

Last updated: 2026-07-11
Working branch: `gpt-handoff`
Verified baseline: `gpt-handoff` after Milestones 1 through 5

## Current phase

> Milestone 6 - Page and component completion

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
- Accessibility foundation and skip link
- Keyboard-accessible compact mobile navigation
- Current-page navigation states and reduced-motion handling
- Explicit favicons, canonical URLs, and social metadata foundation
- Passing shared-shell color contrast
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

### Milestone 6 remaining work

1. Add Journal category filters or category routes.
2. Add Portfolio project filters.
3. Add inline narrative video blocks.
4. Complete Resume print refinement.
5. Reconcile documentation and close Milestone 6.

### Then

- Milestone 7 page-by-page design refinement
- Milestone 8 real content replacement
- Milestone 9 launch-quality SEO, RSS, sitemap, robots, image optimization, search, and launch checks

## Deferred integrations

- Inline narrative video blocks
- Immich albums
- Pagefind
- Giscus
- Resume PDF generation
