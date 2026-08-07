# GTP_Port Roadmap

Last updated: 2026-08-07
Working branch: `gpt-handoff`

## Vision

Build AngrySquirrel.org as a fast, dark, editorial-first personal site that combines long-form publishing with a professional portfolio. Astro owns static routing/rendering, TinaCMS owns controlled editing and curation, and Git-backed Markdown/MDX remains the portable source of truth.

## Architecture guardrails

- Keep Journal and Portfolio content semantic and portable.
- Use structured fields/blocks only where layout or repeatable metadata benefits from structure.
- Separate durable content from how a landing page presents it.
- Generate public routes statically; no application database is required.
- Add redirects before retiring established public URLs.
- Every Tina schema change must stay synchronized with Astro validation, content, renderers, and the generated Tina lock.
- Preserve the existing typography and color system unless a future redesign explicitly changes it.
- Never expose GitHub or Cloudflare publishing secrets to browser-delivered code.
- Finish each sprint with documentation and verification appropriate to the changes made.

## Phase 1 - Site and authoring foundation

### Sprint 1 - Flexible page foundation
**Status:** Complete and deployed.

Created Tina-manageable static and nested Flexible Pages with safe path validation, drafting, deletion, and shared rendering.

### Sprint 2 - Reorderable page blocks and media
**Status:** Complete and deployed.

Added constrained page-builder blocks for Markdown, images, YouTube, Immich galleries, child-page links, and CTAs, plus responsive media/lightbox behavior.

### Sprint 3 - Portfolio hierarchy and tile board
**Status:** Complete; later superseded by Sprint 9 simplification.

Built the original Tina-curated Portfolio landing/category model and reusable selection logic.

### Sprint 4 - Journal sections and landing page
**Status:** Complete and deployed.

Established Automotive, Projects, Field Notes, and Off-topic as primary Journal sections, with explicit featured-story selection and chronological feeds.

### Sprint 5 - Tags and subject archives
**Status:** Complete and deployed.

Added controlled tag documents, stable slugs/aliases, entry references, and static `/tags/[slug]/` archives.

### Sprint 6 - Homepage redesign
**Status:** Complete, deployed, and owner-accepted.

Created the compact Homepage with Hero, Journal preview, About, capabilities, technology, and curated Portfolio destinations with editable visibility/order/content.

### Sprint 7 - Navigation and information architecture
**Status:** Implemented and deployed; final interaction checks are carried into Sprint 14.

Added nested editable navigation, removed About from the primary header, and kept Journal section navigation local to the Journal experience.

## Phase 2 - Publishing-system simplification

### Sprint 8 - Tina/content-model audit
**Status:** Complete.

Produced the field/consumer migration map and feasibility decisions in `TINA_AUDIT.md` and `TINA_FEASIBILITY.md` before deleting compatibility data.

### Sprint 9 - Public Portfolio/Homepage simplification
**Status:** Implemented and deployed; redirect/interaction verification closes in Sprint 14.

Removed the Portfolio landing dependency, kept Video and Photography as direct Flexible Pages, routed Projects/Research/Writing into Journal-backed destinations, retired old proof/category content, and installed redirects.

### Sprint 10 - Tina navigation and schema cleanup
**Status:** Implemented; remaining hosted/editor checks close in Sprint 14.

Grouped Tina around owner tasks, removed dead/transitional fields proven safe to remove, and preserved active compatibility fields such as `placement`.

### Sprint 11 - Deliberate publishing workflow
**Status:** Partially complete operationally.

The protected Tina **Publish Site** action, Access validation, server-only Cloudflare deploy hook, deployment-state UI, and duplicate-publish protection work. Automatic Cloudflare production builds remain enabled, so deliberate-only publishing is not complete until Sprint 14 verifies the cutoff, negative authorization cases, and recovery behavior.

### Sprint 12 - Markdown-first authoring and external media
**Status:** Complete, deployed, and owner-verified.

Added the Markdown-first editor with sanitized live preview, external HTTPS/Immich image support, safe Markdown/MDX import, and whole-collection round-trip/body-policy regression tests.

### Sprint 13 - Resume rebuild
**Status:** Complete, deployed, and owner-verified.

Rebuilt `/resume/` as an editorial professional-background page backed by structured Tina fields for profile, capabilities, experience/highlights, education, and public links. The superseded renderers were removed. `RESUME_DESIGN.md` defines the source model and records the deliberate decision not to create a second PDF dataset.

The Tina `Additional Resume Content` body field remains a compatibility hold only because deleting it requires a synchronized Tina schema/lock validation pass.

### Sprint 14 - Migration, QA, and documentation
**Status:** Active.

**Goal:** finish Phase 2 as a reliable publishing system rather than a collection of partially verified migrations.

#### Scope

- verify retired-route redirects and remaining public references
- identify and remove only compatibility fields/components proven to have no active consumer
- run the complete Tina/schema/content/build gate after any schema cleanup
- finish the hosted Tina checks intentionally deferred from earlier sprints
- finish the Sprint 11 deliberate-publishing cutoff, authorization-negative, and failed-build recovery checks
- verify canonical metadata, internal links, redirects, accessibility, responsive behavior, and current major browsers
- verify robots/sitemap/RSS behavior
- perform Lighthouse accessibility, SEO, performance, and best-practices review
- reconcile owner and maintenance documentation with the deployed site

#### Sprint 14A implementation

Source audit confirmed that Services proof pages, old Portfolio category pages, and `Test-content.mdx` are gone while their intentional redirects remain. Homepage and primary navigation no longer depend on a Portfolio landing page.

The crawl/feed gap identified by the roadmap is now implemented without new dependencies:

- `/robots.txt`
- `/sitemap.xml`
- `/rss.xml`
- RSS autodiscovery in the shared document head

`SPRINT14_QA.md` records exact evidence and separates source inspection from checks that still require a hosted or networked environment.

#### Acceptance

Sprint 14 is complete only when:

- all intended published content is reachable through the approved hierarchy
- retired URLs redirect to their documented targets
- no transitional field remains without a documented active purpose or compatibility reason
- Tina create/edit/reorder/save behavior works for retained content models
- ordinary Tina saves no longer trigger production builds and Publish Site remains the deliberate deployment action
- negative publishing authorization tests and failed-build recovery are recorded
- TypeScript, authoring tests, Tina indexing/admin compilation, Astro production build, and diff checks pass
- metadata, internal links, robots, sitemap, RSS, keyboard behavior, responsive layouts, browser sampling, and Lighthouse review pass or have explicitly documented exceptions
- `README.md`, `BUILD_ORDER.md`, `Roadmap.md`, `PROJECT_LOG.md`, `SITE_MAINTENANCE_GUIDE.md`, and affected feature guides match the deployed system

Depends on: Sprints 8-13

## Deferred integrations

These are intentionally outside Phase 2 unless a future need justifies them:

- Pagefind until content volume warrants search
- Giscus until comments are desired
- generated Resume PDF until it can use the same structured Resume source without parallel maintenance
- advanced related-content ranking
- unrestricted visual page-builder controls

## Document roles

- `BUILD_ORDER.md` - only the current executable queue
- `Roadmap.md` - milestones, dependencies, and acceptance criteria
- `PROJECT_LOG.md` - chronological implementation and verification history
- `SPRINT14_QA.md` - current Phase 2 closeout evidence
- feature/owner guides - operating and maintenance instructions

This separation is intentional so completed sprint checklists do not drift across multiple status documents.
