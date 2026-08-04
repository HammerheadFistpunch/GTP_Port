# GTP_Port Build Order

Last updated: 2026-08-03
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

## Next executable chunk - Sprint 1

### Chunk 1A - Schema and route proof

- add the Flexible Pages content definition in Astro
- add the Tina collection with creation and deletion enabled
- add title, path, description, draft, and basic SEO fields
- add a catch-all route and minimal shared renderer
- protect reserved top-level paths
- create one parent and one nested test page

Stop and verify:

- Tina local indexing succeeds
- strict TypeScript checking passes
- the production build generates both test URLs
- all existing routes still build
- Cloudflare preview deploys successfully

### Chunk 1B - Page shell and editorial controls

- add eyebrow, header image, navigation metadata, and safe defaults
- add missing-page and draft filtering behavior
- refine the flexible-page layout responsively
- document page creation, nesting, renaming, and deletion
- reindex TinaCloud and test create/edit/delete in the hosted editor

Stop and verify:

- a page can be created and nested entirely through Tina
- renaming does not collide with a reserved or existing route
- deleting the test child removes its generated route on the next build
- existing About, Contact, Resume, Journal, Portfolio, and archive routes remain
  unchanged

## Decision gates

- Before Sprint 2: approve the initial block list and determine whether Content
  Entry video uses the same structured block or a rich-text template.
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
