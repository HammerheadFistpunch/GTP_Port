# GTP_Port Build Order

Last updated: 2026-08-04
Working branch: `gpt-handoff`
Verified baseline: unified Content Entries architecture and TinaCloud editor

## Current phase

> Controlled Tina site-builder expansion

The site is operational and publishable. The next phase adds dynamic pages,
reorderable blocks and landing-page tiles, editorial taxonomy, and a compact
homepage while preserving the current content and routes.

## Active sprint order

1. Flexible page foundation
2. Reorderable page blocks and media
3. Work hierarchy and Tina tile board
4. Journal sections and landing page
5. Tags and subject archives
6. Homepage redesign
7. Nested navigation and information-architecture cleanup
8. Migration, QA, and documentation

Full scope and acceptance criteria are in `Roadmap.md`.

## Locked design constraints

- Preserve the existing typography and color choices.
- Use the approved homepage mockup for layout, hierarchy, density, and spacing.
- Do not treat the redesign as a new visual system.

## Completed sprint - Sprint 1

### Chunk 1A - Schema and route proof

- [x] add the Flexible Pages content definition in Astro
- [x] add the Tina collection with creation and deletion enabled
- [x] add title, path, description, draft, and basic SEO fields
- [x] add a catch-all route and minimal shared renderer
- [x] protect reserved top-level paths and reject duplicate published paths
- [x] create one parent and one nested test page

Stop and verify:

- [x] Tina local indexing succeeds
- [x] strict TypeScript checking passes
- [x] the Astro production build generates both test URLs
- [x] all existing routes still build
- [x] Cloudflare preview deploys successfully

Chunk 1A is deployed and verified. The Tina draft-default publishing fix is
also deployed.

### Chunk 1B - Page shell and editorial controls

- [x] add eyebrow, header image, navigation metadata, and safe defaults
- [x] add missing-page and draft filtering behavior
- [x] refine the flexible-page layout responsively
- [x] document page creation, nesting, renaming, and deletion
- [x] regenerate the Tina lock and verify local indexing
- [x] reindex TinaCloud and test create/edit/delete in the hosted editor

Stop and verify:

- [x] a page can be created and nested entirely through hosted Tina
- [x] reserved, malformed, and duplicate paths fail the build safely
- [x] deleting a hosted test child removes its generated route on the next build
- [x] existing About, Contact, Resume, Journal, Portfolio, and archive routes remain
  unchanged

Chunk 1B is deployed and the hosted create, nest, rename, draft, publish,
delete, and 404 workflows are verified.

## Active sprint - Sprint 2 hosted verification

### Chunk 2A - Block schema and renderer foundation

- [x] approve the initial six-block list
- [x] choose rich-text YouTube embeds for Content Entry bodies
- [x] add an ordered, drag-reorderable block list to Flexible Pages
- [x] add Markdown text, image, YouTube, Immich gallery, child-page tile, and
  call-to-action templates
- [x] add shared Astro validation, types, and block renderer
- [x] preserve existing Flexible Page Markdown below the new block list
- [x] add all six block types to the `/services/` verification page
- [x] regenerate the Tina lock and verify local indexing

Stop and verify:

- [x] Tina accepts all six templates and their stored YAML shapes
- [x] strict TypeScript checking passes
- [x] Astro generates all 20 current routes
- [x] generated `/services/` HTML follows the saved block order
- [x] Cloudflare deploys the schema and proof page successfully
- [x] hosted Tina can add, remove, and drag-reorder the proof blocks

### Chunk 2B - Media behavior and Content Entry video

- [x] finish responsive block spacing and media presentation
- [x] add image lightbox and keyboard behavior to Flexible Page image blocks
- [x] harden invalid and incomplete block fallbacks
- [x] add the approved rich-text YouTube embed to Content Entry bodies
- [x] verify existing Content Entry Markdown remains unchanged and valid after
  the `.mdx` extension migration
- [ ] finish the owner workflow and hosted accessibility checks

## Decision gates

- [x] Before Sprint 2: use the six documented Flexible Page blocks and a
  rich-text YouTube embed for Content Entry bodies.
- Before Sprint 3: decide whether the public name and URL remain Portfolio or
  change to Work.
- Before Sprint 4: approve final Journal section names and migration mapping.
- Before Sprint 5: choose generated tags or a controlled tag registry after a
  Tina usability test.
- Before Sprint 7: decide whether About remains a standalone navigation item.

## Chunk rules

- one schema or presentation concern per reviewable chunk
- no removal of legacy fields in the same chunk that introduces replacements
- preserve published URLs or add redirects before changing them
- use explicit Tina selections for featured content
- update Tina, Astro validation, renderers, sample content, lockfile, and docs
  together when a schema changes
- require a successful local production build and Cloudflare preview before
  starting the next chunk
- finish every sprint by reviewing `PROJECT_LOG.md`, `BUILD_ORDER.md`,
  `Roadmap.md`, and `SITE_MAINTENANCE_GUIDE.md`
- update `README.md`, content guidance, portability guidance, or another
  feature-specific document whenever that sprint changes its subject

## Parallel content work

Content publishing does not need to stop while the redesign is built:

1. Replace remaining Resume, About, and Contact placeholders.
2. Publish representative Work projects and Journal entries.
3. Review imported WordPress drafts and media rights.
4. Avoid relying on numeric Portfolio order or display-only Journal topics for
   new long-term organization; those fields will be migrated.

## Still deferred

- Pagefind
- Giscus
- Resume PDF generation
- advanced related-content ranking
- unrestricted visual page building

See `CONTENT_PORTABILITY.md` before expanding structured block use.
