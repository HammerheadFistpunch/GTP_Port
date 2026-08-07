# GTP_Port Roadmap

Last updated: 2026-08-06
Working branch: `gpt-handoff`

## Vision

Build AngrySquirrel.org as a fast, dark, editorial-first personal site that
combines long-form publishing with a professional portfolio. Astro remains
responsible for routing and rendering, TinaCMS manages content and curated
page structure, and Markdown remains the portable source of truth.

The completed redesign expanded Tina from a content editor into a controlled
site builder. The next phase simplifies that system around the way the site is
actually being used: Journal-first publishing, direct Portfolio destinations,
plain-Markdown authoring, externally hosted media, deliberate deployment, and
a separately rebuilt Resume.

## Completed foundation

- Astro 6 static site deployed through GitHub and Cloudflare Pages
- TinaCloud editing at `/admin/`
- unified Content Entries for Journal and Portfolio placement
- shared `/archive/[slug]/` detail routes
- Portfolio bento grid with manual numeric ordering and tile sizing
- Markdown bodies, narrative images, lightboxes, video, and Immich galleries
- structured Resume and managed standard pages
- editable site settings and flat primary navigation
- responsive, accessible shared shell and social metadata foundation

## Architecture guardrails

- Keep Journal and Portfolio entry bodies semantic and portable.
- Use structured blocks for landing pages and flexible pages where layout is
  part of the content.
- Separate permanent content from its presentation on a landing page.
- Generate routes statically at build time; no database backend is required.
- Add redirects before changing established public URLs.
- Every schema change must be reflected in Tina, Astro validation, example
  content, renderers, and the generated Tina lock.
- Each sprint must build and deploy independently before the next begins.
- Preserve the site's existing typography and color system throughout the
  redesign.
- Use the approved homepage mockup as the reference for layout, hierarchy,
  density, and spacing—not as a replacement visual system.
- Finish every sprint with a documentation pass covering status, next work,
  owner maintenance instructions, and any affected feature guide.

## Sprint 1 - Flexible page foundation

Status: Complete and deployed. The hosted Tina create, nest, rename, draft,
publish, delete, and missing-page workflows are verified.

Goal: allow a normal page or nested subpage to be created and deleted in Tina
and receive a working static URL.

Scope:

- add a Flexible Pages Tina collection separate from the fixed Homepage,
  Archive, Resume, and settings documents
- allow document creation, deletion, and nested folders
- add page title, slug/path, eyebrow, description, header image, SEO fields,
  publication state, and navigation metadata
- add a catch-all Astro route for nested pages
- add a shared flexible-page layout with safe missing-field fallbacks
- detect reserved paths and duplicate routes during build validation
- provide example parent and child pages for verification

Acceptance:

- Tina can create `/services/` and `/services/video-production/`
- both URLs build, render, and can be removed without editing an Astro route
- existing About, Contact, Resume, Journal, Portfolio, and archive routes are
  unchanged
- Tina indexing, strict type checking, and the production build pass

Depends on: completed foundation

## Sprint 2 - Reorderable page blocks and media

Status: Complete and deployed at commit `f2c2c7c`. Responsive media, graceful
fallbacks, image-lightbox behavior, and the Content Entry rich-text YouTube
workflow are owner-verified.

Goal: let an editor assemble a flexible page from a constrained set of
reusable blocks and rearrange them in Tina.

Scope:

- add an ordered block list to Flexible Pages
- initial blocks: rich text, image, YouTube video, Immich gallery, child-page
  tiles, and call-to-action/link
- add a shared block renderer and reuse existing media/lightbox components
- support captions, accessible labels, optional headings, and responsive media
- add YouTube as an explicit Tina rich-text or structured block for Content
  Entry bodies where practical
- document which blocks are portable Markdown and which are Tina structures

Acceptance:

- blocks can be added, removed, and drag-reordered in Tina
- YouTube and Immich blocks render responsively
- gallery images retain existing lightbox and keyboard behavior
- invalid or incomplete blocks fail gracefully without breaking the page
- existing Content Entry Markdown remains valid

Depends on: Sprint 1

Implementation split:

- **2A — schema and renderer foundation:** ordered Flexible Page block list,
  six Tina templates, shared Astro schema/types/renderer, portable Markdown
  text, legacy-body compatibility, and a complete `/services/` proof page.
- **2B — presentation and narrative video:** responsive refinement, image
  lightbox behavior, incomplete-block fallbacks, Content Entry rich-text
  YouTube embeds, and final owner/accessibility verification.

Decision: Content Entries remain narrative-first. YouTube will be inserted as
an explicit rich-text embed rather than converting Journal and Portfolio
bodies into structured page-builder blocks.

## Sprint 3 - Portfolio hierarchy and tile board

Status: Complete, deployed, and owner-verified.

Goal: turn the current Portfolio into a glanceable, Tina-curated section
with reorderable category and featured-project tiles.

Scope:

- keep Portfolio as the public name and `/portfolio/` as the canonical URL
- create primary category pages for Video, Photography, Case Studies, Writing
  Samples, and Software Projects using Flexible Pages
- replace numeric `portfolioOrder` as the primary landing-page control with an
  ordered tile list stored on the Portfolio landing document
- let each tile select an existing Content Entry or Flexible Page
- support tile size plus optional title, image, description, and emphasis
  overrides without changing the selected source document
- preserve intelligent dense packing or add an explicit exact-order mode
- align Homepage Featured Portfolio selection with the same source model
- keep numeric Portfolio ordering as a compatibility fallback during migration

Acceptance:

- tiles can be added, removed, resized, and drag-reordered in Tina
- removing a tile does not delete its underlying project or page
- every primary Portfolio category has a valid landing page and may have children
- no existing archive detail URL is broken

Depends on: Sprints 1-2

## Sprint 4 - Journal sections and landing page

Status: Complete, deployed, and owner-verified visually. Hosted Tina
section/feature editing remains grouped with the next schema reindex check.

Goal: create a compact editorial landing page with a deliberate featured
story, chronological feed, and working section navigation.

Scope:

- add one required primary Journal section to Content Entries placed in the
  Journal
- initial assignable sections: Automotive, Projects, Field Notes, and Off-topic;
  Latest is the complete feed
- add static filtered section routes
- replace display-only topic chips with real links
- add a Tina-selected featured story and a chronological story list
- add the approved horizontal section index on desktop and allow it to scroll
  cleanly on mobile
- define migration defaults for existing Journal entries

Acceptance:

- every published Journal entry has one valid primary section
- section links open filtered static archive pages
- the featured story is explicitly selected rather than inferred from sort
  order
- the remaining feed stays chronological and does not duplicate the feature

Depends on: completed foundation; may run after Sprint 2 without Sprint 3

## Sprint 5 - Tags and subject archives

Status: Complete, deployed, and owner-accepted. Hosted Tina create/select and
alias-editing checks remain grouped with the final schema QA sprint.

Goal: make descriptive tags useful while keeping them separate from the one
primary editorial section.

Scope:

- normalize tag slugs and labels
- make tags clickable on cards and at the bottom of entries
- generate static tag archive routes
- list all matching published entries on each tag page
- use a controlled Tina Tags collection with references from Content Entries
- add empty, renamed, and orphaned-tag handling

Acceptance:

- clicking a tag opens a valid archive containing all matching entries
- section and tag URLs are distinct and clearly labeled
- drafts do not appear in public archives
- tag changes cannot silently create broken links

Depends on: Sprint 4 taxonomy conventions

## Sprint 6 - Homepage redesign

Status: Complete, deployed, and owner-accepted. Full cross-device, keyboard,
and hosted Tina editing edge-case checks remain grouped with Sprint 14's final
schema reindex and QA pass.

Goal: make the homepage a compact overview of Patrick's positioning, recent
writing, capabilities, tools, and selected portfolio projects.

Scope:

- reduce hero height and overall footprint
- place the hero and Journal preview side by side on desktop and stack them on
  mobile
- give the Journal preview one selected feature plus a compact recent list
- add About Me, What I Do, Technology Stack, and Featured Portfolio sections
- expose section copy, visibility, links, order, and featured selections in
  Tina
- represent Video, Photography, Case Studies, Writing Samples, and Software
  Projects in Featured Portfolio
- preserve an expanded About page until the homepage version is proven

Acceptance:

- the hero and Journal panel align cleanly at common desktop widths
- homepage selections are deliberate and editable in Tina
- mobile reading order is logical and keyboard navigation remains intact
- the homepage contains useful fallbacks when featured content is unpublished

Depends on: Sprints 3-4

## Sprint 7 - Navigation and information-architecture cleanup

Status: Implemented locally and awaiting Cloudflare, hosted Tina, and owner
interaction verification. About is removed from the primary header but remains
published and linked from the Homepage and footer. Portfolio exposes Video,
Photography, Case Studies, and Software Projects; Journal owns its section
navigation. The former Writing Samples page remains as an unlinked compatibility
route while writing is surfaced through the Journal and tags.

Goal: make Tina-created pages discoverable and remove obsolete navigation only
after replacement routes are proven.

Scope:

- convert flat navigation items into an ordered list with optional children
- allow internal page selection while preserving explicit external URLs
- add accessible desktop submenus and a clear mobile nested-navigation pattern
- connect Portfolio and its four selected Flexible Page categories while
  keeping Journal section navigation local to the Journal archive
- remove About from the primary header while preserving the standalone page
- remove or redirect obsolete routes only after link and analytics review

Acceptance:

- top-level and child links can be drag-reordered in Tina
- keyboard, pointer, touch, Escape, focus return, and no-JavaScript behavior are
  verified
- no navigation item points to a missing or draft page
- old public URLs redirect or remain available

Depends on: Sprints 1, 3, 4, and 6

## Phase 2 - Publishing-system simplification

The August 6 owner review replaces the former single Sprint 8 cleanup pass
with the staged work below. Removing fields, collections, or routes before the
audit and migration steps is explicitly out of scope.

Locked decisions:

- remove the public Portfolio landing page
- keep Video and Photography as direct Flexible Page destinations
- surface Software/Ideation, Case Studies/Research, and Writing through Journal
  feeds or controlled tag archives rather than parallel Portfolio pages
- use the existing Projects section for Software/Ideation and Case
  Studies/Research; use the complete Journal feed for Writing
- replace the misleading Homepage ordering field with real drag-and-drop plus
  keyboard move controls
- retire the Services proof pages and published Test entry only after reference
  checks and redirects to the closest surviving destinations
- make plain Markdown with live preview the primary Content Entry authoring
  experience
- provide a deliberate **Publish Site** action inside Tina
- rebuild Resume in its own sprint

### Sprint 8 - Tina and content-model audit

Status: Complete. Chunk 8A inventory and Chunk 8B decisions/feasibility are
recorded in `TINA_AUDIT.md` and `TINA_FEASIBILITY.md`.

Goal: produce a field-by-field migration map before simplifying the editor or
deleting compatibility data.

Scope:

- inventory every Tina collection, field, label, custom control, reference,
  and list-ordering instruction
- trace every stored field through Astro validation, renderers, routes, and
  existing content
- classify each item as keep, relabel, consolidate, migrate, compatibility
  hold, or remove
- identify misleading controls, including Homepage section ordering that is
  presented as drag-reorderable but currently behaves like a choice list
- define the smallest practical Tina sidebar for Site Settings, Homepage,
  Journal settings, Content, fixed pages, Flexible Pages, taxonomy, and media
- record the exact redirect or compatibility behavior required for retired
  Portfolio routes

Acceptance:

- every active Tina field has a documented consumer and disposition
- no deletion is proposed without a content migration or compatibility plan
- the target Tina navigation has no duplicate path to the same document
- unresolved Tina platform limitations are isolated as implementation spikes

Depends on: Sprint 7 source and hosted-editor checkpoint

### Sprint 9 - Public Portfolio and Homepage simplification

Status: Implemented locally; awaiting Cloudflare redirect and hosted Tina
interaction verification.

Goal: remove the redundant Portfolio landing experience and make Portfolio a
small set of direct destinations.

Scope:

- change the Portfolio header item into a navigation group without a landing
  page dependency
- link Video and Photography directly to their Flexible Pages
- link Software/Ideation and Case Studies/Research to the existing Projects
  Journal section, and Writing to the complete Journal feed
- remove the Portfolio landing route only after navigation, Homepage, footer,
  metadata, and redirect behavior are migrated
- replace information-heavy Homepage Portfolio cards with compact image-and-
  label destination tiles
- retire redundant category Flexible Pages only after their replacements are
  verified

Acceptance:

- no public navigation or Homepage control points to `/portfolio/`
- every Portfolio submenu item reaches published content without an
  intermediate landing page
- compact Homepage destination tiles do not repeat category, title, and
  description copy
- established detail URLs under `/archive/` remain unchanged

Depends on: Sprint 8 migration map and approved Journal-backed destinations

### Sprint 10 - Tina navigation and schema cleanup

Goal: make Tina understandable enough for routine editing without exposing
dead, redundant, or transitional controls.

Scope:

- implement the approved collection/sidebar organization
- relabel collections and fields around user tasks rather than implementation
  terms
- replace misleading ordering controls with true ordered lists or explicit
  move controls
- migrate and remove obsolete Portfolio, Homepage, topic, placement, tile, and
  page fields identified by Sprint 8
- preserve only documented compatibility fields
- regenerate the Tina lock and reindex TinaCloud after each schema chunk

Acceptance:

- each document type has one obvious editing location
- every visible control changes a currently rendered or documented value
- all required reference, route, and content migrations pass before legacy
  fields are removed
- hosted Tina can create, edit, reorder, and save the retained content models

Depends on: Sprints 8-9

Implementation status: locally complete on 2026-08-06. The grouped admin menu,
task-facing labels, hidden internal controls, dead-field migrations, generated
lock, and local validation are complete. `placement` remains temporarily
because active Journal filters and the Portfolio-only Photography entry consume
it. Hosted Tina navigation/save/create checks and TinaCloud reindexing remain.

### Sprint 11 - Deliberate publishing workflow

Status: Implemented locally on 2026-08-06; awaiting Cloudflare bindings,
Access policy, deploy-hook smoke test, automatic-build cutoff, and hosted
end-to-end verification.

Goal: let multiple Tina saves accumulate without rebuilding the public site
until the editor chooses **Publish Site**.

Scope:

- select a secure staging-branch or build-gating architecture compatible with
  TinaCloud, GitHub, and Cloudflare Pages
- keep credentials and deploy-hook secrets out of browser-delivered code and
  repository content
- add a clear Publish Site action inside the authenticated Tina experience
- show success, failure, already-publishing, and no-pending-change states
- document recovery when a publish build fails

Acceptance:

- ordinary Tina saves do not create a public deployment
- one deliberate action publishes the complete saved session
- a failed build leaves the current public site intact and reports a useful
  recovery path
- the workflow is verifiably authenticated and exposes no reusable secret

Depends on: Sprint 8 feasibility findings; may be implemented alongside Sprint
10 if schema changes remain isolated

### Sprint 12 - Markdown-first content authoring and external media

Status: Chunks 12A and 12B are deployed and owner-verified. Chunk 12C is
implemented locally on 2026-08-06 with a dedicated Import Entry screen,
frontmatter mapping, missing-field completion, controlled-tag resolution,
portable-body validation, safe draft creation, canonical Tina serialization,
and nine passing authoring/media/import tests. Hosted import verification is
required before 12D begins.

Goal: replace the clunky Content Entry workflow with a focused Markdown editor
and a safe import path.

Scope:

- add a plain-Markdown editor with live rendered preview as the primary body
  editor
- retain the minimum structured publishing fields required for title, summary,
  date, section, tags, draft state, and metadata
- accept local uploads or direct image URLs for cover, header, block, and inline
  content where each renderer supports them
- explicitly support public Immich-hosted image URLs
- add a Markdown/MDX import workflow that parses frontmatter, identifies
  missing required fields, validates links and images, and preserves portable
  body content
- allow imported standard Markdown links and images to render without manual
  conversion; keep structured inline YouTube insertion as an optional follow-up

Acceptance:

- a new entry can be written, previewed, saved, and reopened without body loss
- an exported `.md` file can be imported, completed, and published without
  manually recreating its body
- working absolute image and link URLs remain working in the final `.mdx`
- invalid frontmatter, unsafe paths, and unsupported MDX produce actionable
  validation instead of a broken build

Depends on: Sprint 8 field audit and a Tina editor feasibility proof; publish
gating from Sprint 11 is preferred before owner rollout

### Sprint 13 - Resume rebuild

Goal: replace the current Resume implementation with an intentionally designed,
maintainable source model and public page.

Scope and acceptance will be defined from a separate Resume content and design
review. Resume PDF generation remains optional until that review chooses a
single-source export strategy.

Depends on: Tina cleanup conventions from Sprint 10

### Sprint 14 - Migration, QA, and documentation

Goal: finish Phase 2 as a reliable publishing system rather than a set of
partially migrated features.

Scope:

- complete remaining content, route, taxonomy, and reference migrations
- remove transitional fields only after their replacements are verified
- run strict type, production build, diff, route, broken-link, accessibility,
  responsive, cross-browser, and Lighthouse checks
- verify redirects, metadata, RSS, sitemap, and robots behavior
- verify Tina authoring and deliberate Cloudflare deployment end to end
- update owner maintenance, content, portability, import, publishing, and
  troubleshooting documentation

Acceptance:

- all published content is reachable through the intended hierarchy
- no transitional field remains without a documented compatibility purpose
- Tina editing and deliberate deployment work end to end
- repository documentation matches the deployed site

Depends on: Sprints 8-13

## Deferred integrations

- Pagefind until published content volume warrants search
- Giscus until a comment workflow is desired
- Resume PDF generation until Sprint 13 chooses a source strategy
- advanced related-content ranking
- unrestricted visual page-builder controls

## Sprint completion rule

Only one sprint is active at a time. If a sprint becomes too large for one
review cycle, split it at a schema/rendering boundary, such as `2A block
schema` and `2B block presentation`, and require a successful Cloudflare
preview between them.

A sprint is not complete until its relevant checks pass and its documentation
matches the repository. Every sprint must review and update, as applicable:

- `PROJECT_LOG.md`
- `BUILD_ORDER.md`
- `Roadmap.md`
- `SITE_MAINTENANCE_GUIDE.md`
- `README.md`, `CONTENT_GUIDE.md`, `CONTENT_PORTABILITY.md`, or another
  feature-specific guide when its subject changed

See `CONTENT_PORTABILITY.md` and `SITE_MAINTENANCE_GUIDE.md` before changing
content schemas or adding new block types.
