# GTP_Port Roadmap

Last updated: 2026-08-09
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

Established Journal sections and an explicit featured-story workflow. Sprint 14 later moved those sections from a hard-coded enum to Tina-managed Journal Section documents.

### Sprint 5 - Tags and subject archives
**Status:** Complete and deployed; refined in Sprint 14.

Added controlled subject documents, stable slugs/aliases, entry references, and static `/tags/[slug]/` archives. Sprint 14 renamed the owner-facing concept to **Topics** and added Active/Retired and replacement-topic management without changing the durable `/tags/` public URLs.

### Sprint 6 - Homepage redesign
**Status:** Complete, deployed, and owner-accepted.

Created the compact Homepage with Hero, Journal preview, About, capabilities, technology, and curated Portfolio destinations with editable visibility/order/content.

### Sprint 7 - Navigation and information architecture
**Status:** Complete and deployed.

Added nested editable navigation, removed About from the primary header, and kept Journal section navigation local to the Journal experience.

## Phase 2 - Publishing-system simplification

### Sprint 8 - Tina/content-model audit
**Status:** Complete.

Produced the field/consumer migration map and feasibility decisions in `TINA_AUDIT.md` and `TINA_FEASIBILITY.md` before deleting compatibility data.

### Sprint 9 - Public Portfolio/Homepage simplification
**Status:** Complete and deployed.

Removed the Portfolio landing dependency, kept Video and Photography as direct Custom Pages, routed Projects/Research/Writing into Journal-backed destinations, retired old proof/category content, and installed redirects.

### Sprint 10 - Tina navigation and schema cleanup
**Status:** Complete; final cleanup superseded by Sprint 14.

Grouped Tina around owner tasks and removed dead/transitional fields proven safe to remove.

### Sprint 11 - Deliberate publishing workflow
**Status:** Complete and operational.

The protected Tina **Publish Site** action, Access validation, server-only Cloudflare deploy hook, deployment-state UI, duplicate-publish protection, and deployment manifest are operational. Automatic production branch deployments have been disabled so ordinary Tina saves no longer publish the site automatically.

### Sprint 12 - Markdown-first authoring and external media
**Status:** Complete, deployed, and owner-verified.

Added the Markdown-first editor with sanitized live preview, external HTTPS/Immich image support, safe Markdown/MDX import, and whole-collection round-trip/body-policy regression tests.

### Sprint 13 - Resume rebuild
**Status:** Complete, deployed, and owner-verified.

Rebuilt `/resume/` as an editorial professional-background page backed by structured Tina fields for profile, capabilities, experience/highlights, education, and public links. The superseded renderers were removed. `RESUME_DESIGN.md` defines the source model and records the decision not to maintain a second PDF dataset.

### Sprint 14 - Migration, QA, and documentation
**Status:** Complete and owner-accepted.

Sprint 14 closed Phase 2 by reconciling the public architecture, Tina editor, Journal model, publishing workflow, and documentation.

Key outcomes:

- removed deprecated `placement`, `entryType`, `primaryTopic`, `technologies`, and manual entry-link metadata from Journal authoring/runtime behavior
- deleted deprecated `Photography-Samples.mdx` and preserved its old public route with a redirect
- standardized every Content Entry as a Journal entry; Portfolio is now composed from dedicated Custom Pages and direct Journal destinations
- replaced hard-coded Journal Section options with Tina-managed section documents supporting stable slugs, aliases, and Active/Retired state
- renamed owner-facing Tags to **Topics** while preserving underlying references and `/tags/` routes
- added safe Topic retirement and optional replacement-topic behavior; direct Topic deletion is disabled in Tina
- updated related-story ranking to favor shared Topics with same Journal Section as a secondary signal
- upgraded the Markdown editor toolbar with bold, italic, strikethrough, inline code, lists, links, Media Manager image insertion, external-image insertion, and YouTube insertion
- mirrored the simplified Journal model and active Topic/Section registries in Import
- simplified Tina navigation to Settings, Pages, Content, and Media owner workflows
- removed the unused Resume body field during a synchronized Tina schema/lock migration
- added `/robots.txt`, `/sitemap.xml`, `/rss.xml`, and RSS autodiscovery
- disabled Cloudflare automatic production deployments and retained **Publish Site** as the deliberate production trigger
- completed hosted Tina review of the new Journal, Journal Sections, Topics, Import, Media, Resume, and page-editor structure

`SPRINT14_QA.md` records source evidence, owner verification, and any formal checks intentionally left as maintenance hardening rather than blockers to Phase 2 acceptance.

## Phase 3 - unified authoring and Cloudflare media delivery

### Sprint 15 - unified page-body Markdown editing
**Status:** Complete; TinaCloud reindex and hosted editor verification remain deployment follow-up.

Replaced only the Standard Page and Custom Page body controls with the same Markdown Write/Split/Preview editor used by Journal entries. Existing body files and Astro Markdown rendering remain unchanged. Homepage section fields, Journal landing fields, Resume structured fields, SEO descriptions, and Custom Page block fields remain structured or plain-text controls.

### Sprint 16 - Immich-to-R2 media backend
**Status:** Complete, deployed, and owner-accepted.

Implemented the Access-protected Cloudflare service for server-side Immich
browsing, private previews, deterministic publication of Immich-generated
`thumbnail` and `web` variants to R2, duplicate-safe reuse, private
credentials, and public delivery through `media.angrysquirrel.org`.

The least-privilege Immich API key, Cloudflare Tunnel/Access service identity,
R2 bucket/custom domain, Pages binding, and production variables/secrets are
configured. Hosted acceptance confirmed authenticated status/browse/preview,
first publication, public delivery without an admin session, repeat
`reused: true` behavior, continued uncached R2 delivery while the Immich
Tunnel was stopped, and successful Immich browsing after Tunnel recovery.

### Sprint 17 - site-wide Immich/R2 integration
**Status:** Complete, deployed, and owner-accepted.

Inventoried applicable image fields, Markdown insertion, Import, stored source
shapes, and public renderers. Added one reusable Tina picker that privately
browses/searches Immich, publishes or reuses the selected asset, and inserts
only its permanent R2 `web` URL. Structured image fields, Journal/Page
Markdown, and Import review share this flow while existing `/uploads/...` and
external HTTPS sources remain supported.

Hosted owner acceptance confirmed the deployed connector and editor flow are
working across a structured image field, Markdown insertion, and Import review.
Saved content uses permanent `media.angrysquirrel.org` URLs and renders
publicly through R2.

**Open maintenance follow-up:** The Immich picker needs additional fixes on
mobile devices. Desktop acceptance does not close mobile UX acceptance. Capture
the exact device/browser reproduction steps and affected interactions during the
next mobile test pass, then address them before treating the picker as fully
polished across form factors.

### Sprint 18 - gallery architecture and security
**Status:** Planned; paused until the owner returns to gallery work.

Revisit R2-mirrored galleries, a restricted live-gallery Worker facade, or a deliberate hybrid after the shared asset pipeline is operating. No share token should remain in page content and no gallery route should reveal the home origin.

## Deferred / future candidates

These are intentionally outside the completed Phase 2 roadmap:

- **Pagefind search** — add when Journal/content volume makes search materially useful
- **Giscus comments** — add when public discussion is desired
- **generated Resume PDF** — only if it can consume the same structured Resume source without parallel maintenance
- **advanced related-content ranking** — current shared-Topic/Section scoring is intentionally simple and predictable
- **expanded visual page-builder controls** — only if the constrained Custom Page blocks become limiting

## Document roles

- `BUILD_ORDER.md` - current Phase 3 sequence and implementation gates
- `Roadmap.md` - completed milestones and future candidates
- `PROJECT_LOG.md` - chronological implementation and verification history
- `SPRINT14_QA.md` - Phase 2 closeout evidence
- feature/owner guides - operating and maintenance instructions
