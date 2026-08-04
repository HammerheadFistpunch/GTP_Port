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
3. Portfolio hierarchy and Tina tile board
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

## Completed sprint - Sprint 2

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
- [x] finish the owner workflow and hosted accessibility checks

Sprint 2B is deployed and owner-verified at commit `f2c2c7c`.

## Completed sprint - Sprint 3

- [x] keep Portfolio as the public name and `/portfolio/` as the canonical URL
- [x] create Video, Photography, Case Studies, Writing Samples, and Software
  Projects category pages under `/portfolio/`
- [x] add a drag-reorderable Tina Portfolio tile board
- [x] allow each tile to reference a Content Entry or Flexible Page
- [x] add tile size, emphasis, title, image, and description overrides
- [x] add Dense and Exact Order packing modes
- [x] migrate Homepage Featured Portfolio to the same reference model
- [x] preserve numeric Portfolio ordering as a fallback during migration

Stop and verify:

- [x] Tina audits the tile references and content documents
- [x] strict TypeScript checking passes
- [x] Astro generates the Portfolio, all five category routes, and every
  existing archive detail URL
- [x] generated Portfolio and Homepage HTML contain the curated selections
- [x] Cloudflare deploys the schema and all Portfolio routes successfully
- [x] hosted Tina can add, remove, and drag-reorder tiles; the owner accepted
  the public tile layout

## Completed sprint - Sprint 4

- [x] approve Automotive, Projects, Field Notes, and Off-topic as the assignable
  sections; Latest is the complete feed
- [x] add a required primary section to published Journal entries
- [x] migrate all six existing Journal entries
- [x] add static filtered section routes
- [x] replace display-only topic chips with working links
- [x] add a Tina-selected featured story
- [x] keep the remaining feed chronological without duplicating the feature
- [x] implement the approved compact editorial landing-page layout
- [x] remove the visible scrollbar from the section index without disabling
  narrow-screen horizontal scrolling

Stop and verify:

- [x] Tina audits every content document and Journal reference
- [x] strict TypeScript checking passes
- [x] Astro generates all four section routes and every archive detail URL
- [x] generated Journal HTML contains working section links and one copy of the
  selected feature
- [x] Cloudflare deploys the Journal landing and section routes successfully
- [ ] hosted Tina can change an entry section and select a different feature

The public Journal design and scrollbar follow-up are owner-accepted. The
remaining hosted editor check will be completed with the Sprint 5 schema
reindex rather than blocking the approved taxonomy sprint.

## Completed sprint - Sprint 5

- [x] choose a controlled Tina Tags collection rather than free-text tags
- [x] migrate all 29 existing tag labels to registry documents
- [x] replace free-text Content Entry tags with controlled references
- [x] add static `/tags/[slug]/` archives for Journal and Portfolio entries
- [x] add clickable tag links to Journal cards and entry-page footers
- [x] add stable labels, permanent slugs, and previous-slug aliases
- [x] reject duplicate tag routes and orphaned entry references
- [x] preserve all existing `/archive/[slug]/` detail routes

Stop and verify:

- [x] Tina audits all 54 content documents and references
- [x] strict TypeScript checking passes
- [x] Astro generates 58 routes, including all 29 tag archives
- [x] drafts are excluded and mixed Journal/Portfolio matches render together
- [x] duplicate, renamed, empty, and orphaned tag behavior is explicit
- [x] Cloudflare deploys every tag archive successfully
- [ ] hosted Tina can create a tag and select it on a Content Entry
- [ ] an old tag URL remains valid after its slug is added as an alias

The public tag archive workflow is owner-accepted. The two remaining hosted
editor edge-case checks will be completed during the final schema reindex and
QA sprint rather than blocking the approved Homepage sprint.

## Completed sprint - Sprint 6

- [x] implement the approved compact Homepage layout
- [x] reduce the Hero height and pair it with the Journal panel on desktop
- [x] add a Tina-selected Journal feature and compact recent-story list
- [x] exclude the selected feature from the recent-story list
- [x] add editable About Me, What I Do, and Technology Stack sections
- [x] add visibility controls, editable links, and drag-reorderable section order
- [x] use reference-based Featured Portfolio tiles for all five Portfolio categories
- [x] preserve the expanded About page and all existing public routes
- [x] add safe fallbacks for drafted, deleted, and invalid featured references

Stop and verify:

- [x] Tina audits all 54 content documents and Homepage references
- [x] strict TypeScript checking and `git diff --check` pass
- [x] Astro generates all 58 existing routes
- [x] generated Homepage HTML follows the stored section order
- [x] the selected Journal feature is absent from the three-story recent list
- [x] all five Featured Portfolio category links resolve to generated routes
- [x] Cloudflare deploys the redesigned Homepage successfully
- [x] owner accepts the hosted Homepage layout
- [ ] full desktop, tablet, phone, and keyboard edge-case review passes
- [ ] hosted Tina can reorder, hide, edit, and change Homepage selections

Sprint 6 is deployed and owner-accepted. The remaining cross-device, keyboard,
and hosted-editor edge-case checks will be completed during Sprint 8's final
schema reindex and QA pass rather than blocking navigation work.

## Active sprint - Sprint 7

- [x] remove About from the primary navigation while preserving its page,
  Homepage link, and footer link
- [x] add ordered navigation items with optional child links
- [x] support internal page references and explicit external URLs
- [x] add accessible desktop and mobile nested-navigation behavior
- [x] connect Portfolio to Video, Photography, Case Studies, and Software Projects
- [x] keep Journal section navigation on the Journal archive rather than in the
  site-wide header
- [x] remove Writing Samples from the primary hierarchy and Homepage category
  tiles while preserving its existing route
- [x] correct the Resume primary-navigation destination
- [x] preserve every existing public route

Stop and verify:

- [x] Tina audits all 54 content documents and navigation references
- [x] strict TypeScript checking and `git diff --check` pass
- [x] the saved header hierarchy contains only the approved destinations
- [ ] Cloudflare deploys the revised schema and navigation successfully
- [ ] hosted Tina can reorder top-level and child links and select internal pages
- [ ] deployed desktop keyboard/pointer and mobile touch behavior pass owner review

## Decision gates

- [x] Before Sprint 2: use the six documented Flexible Page blocks and a
  rich-text YouTube embed for Content Entry bodies.
- [x] Before Sprint 3: keep Portfolio as the public name and `/portfolio/` as
  the canonical URL; do not introduce a Work section or `/work/` route.
- [x] Before Sprint 4: use Automotive, Projects, Field Notes, and Off-topic;
  Latest is navigation for the complete feed, not an entry section.
- [x] Before Sprint 5: use a controlled Tina Tags collection with Content Entry
  references, stable slugs, and optional previous-slug aliases.
- [x] Before Sprint 7: remove About from the primary navigation, preserve the
  page through Homepage/footer links, omit Writing Samples from the Portfolio
  hierarchy, and keep Journal section navigation on the Journal archive.

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
2. Publish representative Portfolio projects and Journal entries.
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
