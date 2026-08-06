# GTP_Port Build Order

Last updated: 2026-08-06
Working branch: `gpt-handoff`
Verified baseline: unified Content Entries architecture and TinaCloud editor

## Current phase

> Publishing-system simplification implementation

The site is operational and publishable. The next phase removes unnecessary
Portfolio indirection, simplifies Tina around real owner workflows, adds
Markdown-first authoring and deliberate deployment, and rebuilds Resume after
the content system is stable.

## Active sprint order

8. Tina and content-model audit
9. Public Portfolio and Homepage simplification
10. Tina navigation and schema cleanup
11. Deliberate publishing workflow
12. Markdown-first content authoring and external media
13. Resume rebuild
14. Migration, QA, and documentation

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
and hosted-editor edge-case checks will be completed during Sprint 14's final
schema reindex and QA pass rather than blocking navigation work.

## Verification checkpoint - Sprint 7

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

The `gpt-handoff` branch contains the Sprint 7 implementation, its corrected
Tina schema lock, and subsequent successful Tina content commits. Cloudflare
and interaction checks above remain explicit until owner verification is
recorded; they do not authorize removing compatibility routes or fields.

## Completed planning - Sprint 8 audit

### Chunk 8A - Inventory and consumer map

- [x] list every Tina collection in its current sidebar order
- [x] map every Tina field to stored content, Astro validation, and renderer or
  route consumers
- [x] mark each field keep, relabel, consolidate, migrate, compatibility hold,
  or remove
- [x] identify duplicate document entry points and misleading control text
- [x] inventory Portfolio, Homepage, Journal, Resume, media, and deploy fields

Stop and verify:

- [x] every visible Tina control has a documented disposition
- [x] every proposed removal has a migration or compatibility plan
- [x] no source, content, schema, or route change is included in the audit chunk

Chunk 8A is complete in `TINA_AUDIT.md`.

### Chunk 8B - Target models and implementation gates

- [x] approve the smallest practical Tina navigation
- [x] choose the exact Journal/tag destinations for Software/Ideation, Case
  Studies/Research, and Writing
- [x] choose true drag-and-drop Homepage section ordering
- [x] choose safe retirement for Services proof pages and `Test-content.mdx`
- [x] define redirect behavior for `/portfolio/` and retired category pages
- [x] prove the feasible Tina approach for raw Markdown plus live preview
- [x] choose a secure Tina/GitHub/Cloudflare publish-gating architecture
- [x] split implementation into schema-safe, independently deployable chunks

Stop and verify:

- [x] the target editor model contains no duplicate editing locations
- [x] the public navigation model has no dependency on a Portfolio landing page
- [x] browser-delivered code contains no GitHub or Cloudflare secret
- [x] accepted decisions are reflected in `Roadmap.md` before Sprint 9 begins

Technical findings are recorded in `TINA_FEASIBILITY.md`. Software/Ideation and
Case Studies/Research will use the existing Projects feed; Writing will use the
complete Journal feed. Homepage ordering will use a genuine drag-and-drop
control with keyboard controls. Retired Portfolio and proof routes will redirect
to the closest surviving destination, and the Test entry will be removed only
after reference checks. The approved Tina menu uses Settings, Pages, Content,
and Site groups; Content retains Journal Entries so authoring stays accessible.

## Completed implementation - Sprint 9 public simplification

- [x] make Portfolio a label-only navigation group
- [x] keep Video and Photography as direct Flexible Pages
- [x] route Software/Ideation and Case Studies/Research to Projects
- [x] route Writing to the complete Journal feed
- [x] replace Homepage bento cards with compact image-and-label links
- [x] add real drag-and-drop Homepage section ordering with keyboard controls
- [x] migrate the two case studies to Projects without changing detail URLs
- [x] retire legacy category, Services proof, and Test content after reference checks
- [x] add redirects for every retired public route
- [x] regenerate the Tina lock and pass local Tina-aware build validation

Stop and verify:

- [x] local output contains Video, Photography, Projects, and both case studies
- [x] local output omits the Portfolio landing, proof pages, and Test entry
- [x] no public navigation or Homepage link targets `/portfolio/`
- [ ] Cloudflare serves the retired-route redirects
- [ ] hosted Tina saves reordered Homepage sections and destination links
- [ ] deployed desktop/mobile navigation and compact tiles pass owner review

Sprint 9 implementation is locally complete. Its three hosted checks remain
part of the combined Sprint 9-10 deployment review.

## Active sprint - Sprint 10 Tina navigation and schema cleanup

- [x] implement grouped Settings, Pages, Content, and Site navigation
- [x] keep Site Settings and Tags under Settings
- [x] expose Main Homepage, Journal Homepage, About, Contact, Resume, and New
  Pages under Pages
- [x] retain Journal Entries under Content and Media Manager under Site
- [x] hide the redundant flat collection list
- [x] relabel collections around owner tasks and hide internal page-type fields
- [x] remove legacy Journal topics and unused Flexible Page navigation order
- [x] remove obsolete entry featured, Portfolio order, and tile-size fields
- [x] remove the legacy nonexistent-`post` Tina helper
- [x] regenerate the Tina lock and pass local schema/content validation
- [ ] reindex `gpt-handoff` in TinaCloud after deployment

Stop and verify:

- [x] TypeScript passes
- [x] Tina local indexing and admin compilation pass
- [x] the lock contains the new labels and none of the removed fields
- [x] the Astro validation build produces the expected 50 routes
- [ ] hosted Tina shows the grouped menu in the approved order
- [ ] every fixed-page shortcut opens and saves the intended document
- [ ] Tags, Journal Entries, New Pages creation, and Media Manager work

Sprint 10 is pushed. Hosted Tina verification remains grouped with the next
hosted checkpoint.

## Active sprint - Sprint 11 deliberate publishing workflow

- [x] add a Tina **Site → Publish Site** screen
- [x] compare the latest saved `gpt-handoff` commit with the live build commit
- [x] add no-pending, pending, publishing, success, and failure states
- [x] keep the Cloudflare deploy-hook URL in a server-only encrypted secret
- [x] validate Cloudflare Access JWTs and restrict publishing to one configured identity
- [x] add a KV-backed duplicate-publish lock
- [x] add a static deployment manifest with no-store cache behavior
- [x] document Cloudflare setup, cutoff sequence, and failed-build recovery
- [x] compile TypeScript, Tina admin, Astro routes, and the Pages Function locally
- [ ] deploy the Sprint 11 code while automatic production builds remain enabled
- [ ] configure the Access application, environment values, encrypted hook, and KV binding
- [ ] smoke-test the deploy hook before disabling automatic production builds
- [ ] confirm a Tina save creates no deployment after automatic builds are disabled
- [ ] publish one saved session through Tina and verify the live commit changes
- [ ] confirm a failed build leaves the current public deployment intact

Stop and verify:

- [x] no deploy-hook URL, GitHub credential, or reusable secret exists in the browser bundle or repository
- [x] local saved/live comparison identifies the no-pending state deterministically
- [x] concurrent publish attempts receive a useful already-publishing response
- [ ] the hosted endpoint rejects unauthenticated and wrong-identity requests
- [ ] the complete deliberate-publishing workflow passes from Tina save to live deployment

Do not disable automatic production builds until the deployed relay and branch-specific
deploy hook have successfully triggered a build. Full configuration is in
`PUBLISHING_GUIDE.md`.

## Active sprint - Sprint 12 Markdown-first authoring and external media

### Chunk 12A - Markdown editor proof

- [x] change the Journal Entry body from rich-text JSON to a raw string body
- [x] add Write, Split, and Preview editor modes
- [x] sanitize the rendered preview and block active or unsafe HTML
- [x] preserve the established `<YouTube />` MDX source and render valid URLs in a constrained preview player
- [x] warn visibly when an unsupported custom MDX component is present
- [x] add a representative draft fixture with Markdown, an absolute image, and YouTube
- [x] add Tina parse/serialize/reopen round-trip tests
- [x] regenerate the Tina lock and pass local schema/content validation
- [x] contain split panes and preview media within Tina's editor canvas
- [ ] verify the deployed Tina editor can save and reopen the draft fixture unchanged

Stop and verify:

- [x] authoring round-trip tests pass
- [x] strict TypeScript checking passes
- [x] Tina local indexing and custom admin compilation pass
- [x] Astro produces the existing 50 public routes and excludes the draft fixture
- [ ] hosted Tina displays the editor, sanitized preview, and responsive YouTube player
- [ ] a hosted no-op save does not rewrite or lose the fixture body

Chunk 12A is locally complete. The owner approved proceeding to 12B while the
hosted save/reopen checks remain grouped into the next deployed checkpoint.

### Chunk 12B - External image authoring

- [x] add one shared managed-upload/direct-HTTPS Tina image control
- [x] retain Media Manager selection and upload behavior
- [x] show contained previews for managed and external images
- [x] validate `/uploads/...` paths and credential-free HTTPS URLs in Tina
- [x] explicitly accept public Immich-hosted HTTPS asset URLs
- [x] reject HTTP, protocol-relative, data, traversal, and ambiguous sources
- [x] apply the control to cover, header, social, block, Hero, and destination images
- [x] guard Entry, Flexible Page, and image-block renderers
- [x] warn when the Markdown preview omits an unsafe inline-image source
- [x] add media-source tests and an external cover to the draft proof entry
- [x] pass Tina indexing/schema/admin, TypeScript, tests, and Astro production build
- [ ] verify managed selection/upload and external URL preview in hosted Tina
- [ ] save/reopen the external cover URL without rewriting it
- [ ] verify the external cover and inline image render on the deployed proof review

Chunk 12B is locally complete. Do not begin 12C until the hosted media checks pass.

### Remaining Sprint 12 chunks

- [ ] **12C Import workflow** — `.md`/`.mdx` parsing, metadata mapping,
  validation, missing-field completion, and canonical output
- [ ] **12D Rollout and documentation** — existing-content verification,
  Sprint 11 hosted-status reconciliation, owner rollout, and final guide updates

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
- [x] Before Sprint 8: remove the Portfolio landing page; retain direct Video
  and Photography pages; use Journal destinations for Software/Ideation, Case
  Studies/Research, and Writing; prioritize plain Markdown with live preview;
  place deliberate publishing inside Tina; and reserve Resume for its own sprint.
- [x] During Sprint 8: approve Journal destinations, retired-route behavior,
  true Homepage ordering, raw-Markdown direction, and secure publish-gating
  architecture.
- [x] Before Sprint 10: use Settings → Site Settings/Tags; Pages → Main
  Homepage/Journal Homepage/About/Contact/Resume/New Pages; preserve Journal
  Entries under Content and Media Manager under Site.

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
