# GTP_Port Build Order

Last updated: 2026-07-15
Working branch: `gpt-handoff`
Verified baseline: unified architecture through Chunk 5

## Current phase

> Real content and job-search readiness

The functional site, hosted editor, deployment path, and core presentation
components are operational. Real content can now be published while remaining
design and feature work continues incrementally.

## Verified complete

- Static Astro 6.4.6 architecture
- TinaCMS local workflow and authenticated TinaCloud production editor
- Six focused Tina collections
- Unified Content Entries schema and Tina editing workflow
- Portfolio, Journal, and shared `/archive/[slug]/` routes
- Tina-controlled Portfolio bento grid and manual ordering
- Editable Homepage preview headings linked to Portfolio and Journal
- Project galleries, native video, YouTube, Vimeo, and lightboxes
- Live Journal and Portfolio Immich galleries with proportion-preserving,
  higher-quality previews and an accessible lightbox
- Cross-type related Content Entries
- Structured Resume editor and timeline
- Responsive shared shell and keyboard-accessible mobile navigation
- Skip link, visible focus states, current-page navigation, and reduced motion
- Favicons, descriptions, canonical URLs, and social metadata foundation
- Cloudflare production variables and automatic deployment from `gpt-handoff`

## Publishing workflow

Hosted content edits can be made at `/admin/`. Tina writes those content
changes to `gpt-handoff`, and Cloudflare rebuilds the site.

Code, schema, and layout work follows the review-first workflow:

```text
Pull gpt-handoff
-> make one focused chunk
-> run the appropriate build and diff checks
-> review changed files
-> commit and push in VS Code
-> confirm the Cloudflare deployment
```

## Active build order

### Content first

1. Replace Resume, About, and Contact placeholders.
2. Publish two or three strong Portfolio projects.
3. Publish one or two representative Journal entries.
4. Revisit Homepage copy and featured selections using the real content.
5. Remove test entries and placeholder media after replacements are verified.

### Parallel refinement

1. Refine the pages that real content exposes as weak.
2. Convert the display-only Journal topic chips into static topic routes when
   the entry count makes them useful.
3. Add Portfolio filtering when the project count makes it useful.
4. Add inline narrative video only when a real story requires it.
5. Complete Resume print styling.

### Launch quality

1. Add sitemap, robots.txt, and RSS.
2. Optimize images and final social cards.
3. Run Lighthouse, responsive, cross-browser, and broken-link checks.
4. Add analytics and search only if they provide clear value.

## Deferred integrations

- Pagefind until the published content volume warrants search
- Giscus until a comment workflow is desired
- Resume PDF generation
- advanced related-content ranking

See `CONTENT_PORTABILITY.md` before adding new content-specific block systems.
