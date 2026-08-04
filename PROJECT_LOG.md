# GTP_Port Project Log

## 2026-08-04 - Sprint 5 controlled tags and subject archives implemented

Completed locally:

- Added a dedicated Tina **Tags** collection with stable slugs, editable public
  labels, optional archive descriptions, and previous-slug aliases.
- Migrated all 29 existing free-text tags into controlled tag documents and
  replaced seven tagged Content Entry lists with Tina references.
- Added 29 static `/tags/[slug]/` subject archives spanning published Journal,
  Portfolio, and dual-placement entries while excluding drafts.
- Added clickable tag chips to Journal cards, the featured story, and the
  bottom of Content Entry detail pages.
- Added canonical handling for alias routes and build-stopping validation for
  duplicate slugs, duplicate aliases, and references to missing tag documents.
- Kept Journal sections and descriptive tags as separate routing systems and
  preserved every existing `/archive/[slug]/` detail URL.
- Regenerated `tina/tina-lock.json` from Tina's generated schema artifacts.

Verified locally:

- Tina audits all 54 settings, page, Flexible Page, Tag, and Content Entry
  documents.
- Strict TypeScript checking and `git diff --check` pass.
- Astro builds 58 pages: the existing 29 routes plus all 29 tag archives.
- Generated Journal and entry HTML contains clickable tag URLs; Automotive
  and MBA archives contain their expected Journal and Portfolio entries.
- Duplicate canonical slugs, duplicate aliases, and orphaned tag references
  each produce an explicit validation failure.

Pending after push:

- Confirm Cloudflare deploys the 29 subject archives.
- Reindex TinaCloud and verify creating a tag, selecting it on an entry, and
  preserving an old slug through the alias field.

## 2026-08-04 - Sprint 4 Journal sections and landing page implemented

Completed locally:

- Implemented the approved compact editorial Journal design without changing
  the site's typography or color system.
- Added controlled Automotive, Projects, Field Notes, and Off-topic sections;
  Latest remains the complete landing feed rather than an assignable section.
- Added one conditionally required `journalSection` value to every published
  Journal entry and migrated all six current entries.
- Added static `/journal/[section]/` routes and replaced display-only topic
  chips with working section links.
- Added an explicit Tina reference for the featured Journal story. The selected
  feature is excluded from the remaining chronological landing feed.
- Preserved the legacy `primaryTopic`, `featured`, and archive-page `topics`
  values as documented compatibility fields during the staged migration.
- Preserved every existing `/archive/[slug]/` detail URL.
- Hid the browser scrollbar on the horizontal Journal section index while
  preserving touch, wheel, and trackpad scrolling on narrow screens.

Verified locally:

- Tina audits all 25 settings, page, Flexible Page, and Content Entry documents.
- Strict TypeScript checking passes.
- Astro generates 29 pages, including all four section routes and every
  existing archive detail URL.
- Generated Journal HTML includes every section link and includes the selected
  featured entry exactly once.
- The full TinaCloud build remains credential-gated as documented; no token was
  added to the repository.

Hosted verification:

- Cloudflare deployed the Journal landing and section routes; the owner
  accepted the layout and the scrollbar follow-up.
- Changing an entry section and featured-story selection in hosted Tina remains
  an owner verification item alongside the Sprint 5 schema reindex.

## 2026-08-04 - Sprint 3 Portfolio hierarchy and tile board implemented

Completed locally:

- Locked the public section name to **Portfolio** and retained `/portfolio/`
  as its canonical URL; navigation, footer, landing-page, Homepage, Tina, and
  planning labels no longer call the section Work.
- Added published Portfolio category pages for Video, Photography, Case
  Studies, Writing Samples, and Software Projects.
- Added ordered Tina tile lists to the Portfolio landing page and Homepage
  Featured Portfolio section. Each tile references an existing Content Entry
  or Flexible Page and may override size, emphasis, title, description, or
  image without changing the selected document.
- Added shared tile resolution that safely omits missing, drafted, or
  non-Portfolio sources. Removing a tile never deletes its source.
- Added Dense and Exact Order packing choices while retaining the existing
  bento sizing and numeric `portfolioOrder` fallback during migration.
- Regenerated `tina/tina-lock.json` from Tina's generated schema artifacts.

Verified locally:

- Tina audits all settings, page, Flexible Page, and Content Entry documents.
- Strict TypeScript checking passes.
- Astro generates 25 pages, including `/portfolio/`, all five Portfolio
  category routes, and every existing `/archive/[slug]/` URL.
- Generated Portfolio and Homepage HTML contain the explicit curated tiles.
- `git diff --check` passes.

Hosted verification:

- Cloudflare deployed all five Portfolio category routes successfully.
- The owner verified Tina tile removal and the public Portfolio tile layout.

## 2026-08-04 - Sprint 2B media and narrative video implemented

Completed locally:

- Added responsive, keyboard-accessible lightbox behavior to Flexible Page
  image blocks by sharing the existing narrative-image dialog.
- Hardened image, gallery, call-to-action, native-video, YouTube, and Vimeo
  values so incomplete or unsafe media does not break the route.
- Added an explicit Tina rich-text YouTube embed for Content Entries while
  keeping their bodies narrative-first rather than converting them to blocks.
- Migrated the nine Content Entry files from `.md` to Markdown-compatible
  `.mdx` without changing their existing narrative text or public slugs.
- Moved the Ferrari/IKEA proof video from end-of-entry media into the body as
  the first end-to-end rich-text embed example.
- Added the Astro 6-compatible `@astrojs/mdx` integration and regenerated the
  Tina schema lock.

Verified locally:

- Tina audits all 20 content documents, including all nine MDX entries.
- Strict TypeScript checking and `git diff --check` pass.
- Astro generates all 20 routes.
- The Ferrari/IKEA route renders a responsive privacy-enhanced
  `youtube-nocookie.com` iframe at the stored body position.
- Existing Content Entry filenames retain their stems, so every
  `/archive/[slug]/` URL remains unchanged.

Pending after push:

- Confirm Cloudflare and TinaCloud finish deploying the new MDX schema.
- Insert, move, edit, and remove a YouTube embed in hosted Tina.
- Verify image-block mouse, Enter/Space, Escape, and focus-return behavior on
  desktop and phone before closing Sprint 2.

## 2026-08-04 - Sprint 2A gallery density refined

- Limited the initial Immich gallery grid to four photos to keep page blocks
  compact.
- Added an accessible expand/collapse control that reveals the full grid and
  returns it to the four-photo preview.
- Preserved full-album lightbox navigation while the thumbnail grid is
  collapsed.
- Updated the content and maintenance guides with the shared gallery behavior.

## 2026-08-04 - Sprint 2A reorderable block foundation implemented

Completed locally:

- Added one ordered `blocks` list to Flexible Pages with Tina drag ordering.
- Added constrained templates for Markdown text, images, YouTube video, Immich
  galleries, selected child-page tiles, and calls to action.
- Added shared Astro validation and types in `src/lib/page-blocks.ts` plus a
  shared block renderer that resolves published Flexible Page tiles.
- Reused the existing responsive YouTube, Immich gallery, and button
  components while keeping block-specific presentation centralized.
- Preserved every existing Flexible Page Markdown body and rendered it after the
  ordered blocks; no content migration is required.
- Added all six block types to `/services/` as an end-to-end verification page.
- Recorded the decision to use a rich-text YouTube embed for Content Entries in
  Sprint 2B instead of converting entry bodies into page-builder blocks.
- Added `marked` as a direct dependency for portable Markdown text blocks and
  regenerated `tina/tina-lock.json`.

Verified locally:

- Tina indexes all six templates and regenerates its schema lock.
- Strict TypeScript checking and `git diff --check` pass.
- Astro generates all 20 current routes.
- The generated `/services/` HTML contains all six block types in stored order,
  followed by the original Markdown body.

Hosted verification completed before Sprint 2B:

- Cloudflare deployed the block schema and proof page.
- Hosted Tina add/remove/drag ordering and the refined four-image gallery
  preview were owner-verified.

## 2026-08-04 - Sprint 1B Flexible Page shell implemented

Completed locally:

- Added Flexible Page eyebrow, header image, header-image alt text,
  navigation label, and navigation order controls in Tina and Astro.
- Added safe defaults for new-page draft state, navigation order, missing
  optional presentation fields, and breadcrumb labels.
- Added generated breadcrumbs from published ancestor pages without changing
  the flat primary navigation.
- Finished the shared Flexible Page shell with responsive heading, spacing,
  body, and header-image behavior using the existing typography and colors.
- Added a custom static 404 page so missing, drafted, renamed, and deleted
  routes no longer fall back to the Homepage on Cloudflare.
- Regenerated `tina/tina-lock.json` and expanded the content and maintenance
  guides with create, nest, rename, draft, and delete workflows.

Verified locally:

- Tina local indexing and schema generation pass.
- Strict TypeScript checking passes.
- Astro generates 20 pages, including the 404 page and all four current
  Flexible Page routes.
- Existing About, Contact, Resume, Journal, Portfolio, and archive routes still
  generate.

Pending after push:

- Confirm the Cloudflare deployment and custom missing-page response.
- Reindex TinaCloud, then test create, rename, draft, and delete in the hosted
  editor before beginning Sprint 2.

## 2026-08-04 - Sprint 1A Flexible Page route proof implemented

Completed locally:

- Added a separate `flexiblePages` Astro collection and Tina **Flexible
  Pages** collection with document creation and deletion enabled.
- Added editable title, URL path, description, draft state, SEO title, SEO
  description, social image, and Markdown body fields.
- Added a guarded catch-all Astro route and minimal shared Flexible Page
  layout using the existing color, typography, width, and spacing system.
- Added build-time validation for invalid paths, reserved top-level routes,
  and duplicate published Flexible Page paths.
- Added published `/services/` and `/services/video-production/` proof pages.
- Regenerated the Tina schema lock.

Verified locally:

- Tina indexed the new collection successfully.
- Strict TypeScript checking passed.
- Astro built 17 static pages, including both proof URLs and all 15 baseline
  routes.
- The generated proof pages contain the expected canonical URLs and SEO
  metadata.
- `git diff --check` passed.

Pending:

- Push the implementation to `gpt-handoff` and confirm a successful
  Cloudflare preview before beginning Sprint 1B.

## 2026-08-03 - Documentation audit and cleanup completed

Completed:

- Consolidated active planning around `BUILD_ORDER.md` and `Roadmap.md`.
- Retired stale `NEXT_STEPS.md`, `Audit.md`, and `CHUNK_MANIFEST.md` files
  that duplicated or contradicted the current sprint plan.
- Refreshed the README, documentation index, maintenance guide, build order,
  roadmap, content guide, and repository agent instructions.
- Recorded documentation maintenance as part of every sprint's completion
  criteria.
- Corrected the local development instruction to use the Tina-aware
  `npm run dev` workflow.

Decisions:

- Preserve the site's existing typography and color choices during the
  redesign.
- Use the approved homepage mockup as the reference for layout, hierarchy,
  density, and spacing only.
- Sprint 1A remains the next application-code work; this cleanup changed
  documentation only.

## 2026-08-03 - Tina site-builder expansion roadmap approved

Planned:

- Expand Tina with creatable Flexible Pages and nested static URLs.
- Add a constrained, reorderable block system for text, images, YouTube,
  Immich galleries, child-page tiles, and calls to action.
- Replace numeric Portfolio ordering with a drag-reorderable Portfolio landing-page
  tile board that references permanent content without owning it.
- Add a required primary Journal section, working section routes, a selected
  featured story, and a compact editorial landing page.
- Add clickable tags and static tag archive pages while keeping sections and
  tags separate.
- Redesign the Homepage around a smaller hero, a side-by-side Journal preview,
  About Me, What I Do, Technology Stack, and selected Featured Portfolio.
- Add optional nested navigation after the dynamic page and archive routes are
  proven.
- Finish with migration, TinaCloud reindexing, route and accessibility QA, and
  owner documentation updates.

Decisions:

- The work is divided into eight independently verifiable sprints in
  `Roadmap.md`.
- Structured blocks are for flexible and landing pages; Journal and Portfolio entry
  bodies remain semantic and portable wherever possible.
- Permanent content stays separate from landing-page tile placement and
  presentation overrides.
- Existing public routes will be preserved or redirected before removal.
- No feature in this entry is marked complete; implementation begins with
  Sprint 1A in `BUILD_ORDER.md`.

## 2026-07-15 - Owner maintenance documentation added

Completed:

- Added `SITE_MAINTENANCE_GUIDE.md` as a repository-specific manual for making
  visual, component, page, Tina, content-schema, route, media, and dependency
  changes safely.
- Documented the required contract between Tina fields, Astro validation,
  Markdown frontmatter, renderers, and the generated Tina lock.
- Added safe recipes for optional fields, required fields, field removal,
  palette and typography changes, custom Tina controls, and package updates.
- Added verification guidance, common failure diagnosis, high-risk change
  warnings, and a final pre-push checklist.
- Linked the guide from the README and documentation index.

## 2026-07-15 - Architecture stabilization and Homepage editing refined

Completed:

- Confirmed the unified Content Entries migration, shared archive routes,
  Portfolio bento grid, Tina placement actions, and legacy cleanup in the
  deployed workflow.
- Fixed the custom Tina Placement field's hosted runtime error by importing the
  React runtime explicitly. Content Entries, including Photography Samples,
  can now be opened and edited in TinaCloud.
- Added editable **Section Title Link** fields to the Homepage Featured Portfolio and
  Journal Preview sections.
- Linked those Homepage headings to `/portfolio` and `/journal` by default
  while preserving direct links on the individual preview cards.
- Reviewed Journal topic navigation and documented that the current chips are
  display-only labels rather than functional filters.
- Identified static Astro topic routes derived from `primaryTopic` as the next
  recommended feature; no database backend is required.

Verified:

- Tina local schema indexing succeeds and regenerates `tina/tina-lock.json`.
- Strict TypeScript checking passes.
- Astro production build succeeds with 14 static pages.
- The Tina React runtime hotfix was verified in the hosted editor.

## 2026-07-15 - Unified Content Entries architecture completed

Completed:

- Replaced separate Journal and Portfolio storage schemas with one `entries`
  collection for articles, projects, galleries, and case studies.
- Added Tina placement actions for Portfolio only, Portfolio + Journal, and
  Archive to Journal; Journal placement clearly exposes the publication-date
  field used for chronological sorting.
- Moved all active content to `src/content/entries/`.
- Cut Homepage, Journal, and Portfolio queries over to the unified collection.
- Added stable neutral detail routes at `/archive/[slug]/` and one shared entry
  layout preserving inline lightboxes, media, video, Immich, links, and related
  content.
- Replaced the chronological Portfolio grid with a responsive bento layout
  controlled by manual order and tile size in Tina.
- Removed legacy collections, duplicate detail routes, layouts, related-content
  components, and duplicate Markdown files.

Verified:

- Astro production build succeeds with 14 static pages.
- `git diff --check` passes.
- Journal and Portfolio now present the same underlying entries differently
  without moving or converting content.

## 2026-07-14 - WordPress writing archive staged for review

Imported from the owner's WordPress.com content and media exports:

- Parsed 177 WordPress records, including 9 published posts and 128 media
  attachments.
- Converted all 9 published posts to portable Markdown drafts.
- Routed 5 editorial articles to Journal and 4 writing or strategy samples to
  Portfolio.
- Preserved original publication attribution, links, dates, headings, tables,
  captions, and article links where available.
- Copied the 65 WordPress-hosted media files referenced by the imported posts
  into `public/uploads/wordpress/`.
- Preserved externally hosted publisher images for review and documented every
  affected entry in `WORDPRESS_IMPORT_REVIEW.md`.
- Kept every imported entry at `draft: true` so nothing publishes before
  copyright, formatting, image, and collection-placement review.

Verified:

- Every referenced WordPress-hosted media file was found in the media export.
- Astro accepted all imported content and generated all 18 routes when the
  drafts were temporarily enabled in a test checkout.
- The delivered entries remain drafts.

## 2026-07-14 - Content publication phase opened

Decision:

- The site is ready to begin supporting a job search before every refinement
  milestone is complete.
- Real Resume, About, Contact, Portfolio, and Journal content is now the active
  priority.
- Remaining filters, print refinement, and design polish are non-blocking and
  should be driven by real published material.
- Journal and Portfolio bodies will remain semantic Markdown for redesign and
  migration safety.
- Structured or flexible Tina blocks should be concentrated on the small set
  of landing pages instead of becoming the default article format.
- Important cover and narrative images should remain locally owned; Immich is
  the expanded gallery layer rather than the only durable project media.

Documentation refreshed:

- README and active workflow
- next steps and build order
- roadmap and repository audit
- editable content guidance
- new content portability and redesign recommendations

## 2026-07-14 - Immich gallery presentation refined

Completed:

- Replaced low-resolution grid thumbnails with higher-quality Immich previews.
- Removed the forced 4:3 crop so images retain their original proportions.
- Replaced narrow auto-fit tiles with a balanced two-column layout and a
  single-column layout on narrow phones.
- Applied the shared component refinement to both Journal and Portfolio
  galleries.

Verified:

- Astro generated all nine static pages.
- `git diff --check` passed.

## 2026-07-14 - Immich galleries connected

Completed:

- Added an optional Immich Gallery group to Journal Entries and Portfolio
  Projects in Tina.
- Connected public `share.angrysquirrel.org` albums without an API key.
- Added a live client-side gallery so album changes appear without rebuilding
  the Astro site.
- Added lazy thumbnails, an accessible native dialog lightbox, previous/next
  controls, arrow-key navigation, Escape-to-close, and outside-click closing.
- Added loading, empty, no-JavaScript, and unavailable-service fallbacks.
- Connected the supplied 11-image public album to the placeholder Journal entry
  and Portfolio project for end-to-end verification.

Verified:

- Public share proxy responds successfully and exposes 11 image assets.
- Astro production build generates all nine pages.
- TinaCMS starts and regenerates the schema lock successfully.
- `git diff --check` passes.

## 2026-07-14 - TinaCloud connection completed

Completed:

- Added Cloudflare environment variables for the Tina client, token, and
  `gpt-handoff` branch.
- Made `gpt-handoff` the repository default branch so TinaCloud can load the
  existing schema.
- Reindexed the Tina schema and verified all seven collections.
- Verified authenticated production editing at `https://angrysquirrel.org/admin/`.

## 2026-07-14 - TinaCloud connection started

Changed:

- Reversed the earlier local-only Tina decision at the owner's request.
- Restored the production build to `tinacms build && astro build`.
- Added an Astro-only diagnostic build as `npm run build:astro`.
- Added a safe environment-variable template with the TinaCloud Client ID and
  `gpt-handoff` branch.
- Updated the active workflow documentation for a hosted `/admin/`.

Pending:

- Add `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`, and `GITHUB_BRANCH` to Cloudflare
  Pages for Preview and Production.
- Deploy and verify authenticated editing at `/admin/`.
- Connect a public Immich shared album to the native gallery/lightbox.

## 2026-07-11 - Milestone 5 accessibility and shared shell completed

Completed:

- Added a skip-to-content link and global visible keyboard-focus styles.
- Added current-page state to primary navigation, including detail routes.
- Added reduced-motion handling.
- Replaced wrapping mobile navigation with a compact accessible menu.
- Added Escape-to-close, outside-click handling, focus return, and 44px mobile targets.
- Preserved navigation access when JavaScript is unavailable.
- Explicitly linked the existing SVG and ICO favicons.
- Added the production site URL and canonical URLs.
- Added shared Open Graph and Twitter card metadata with optional content images.
- Verified descriptions flow through Homepage, archive, standard, Journal, and Portfolio layouts.
- Raised the steel-blue accent from `#4682B4` to `#4F91C7` so normal accent text passes on both primary and surface backgrounds.

Verified:

- User approved Chunks 4A and 4B and pushed both to `gpt-handoff`.
- Cloudflare Pages deployment succeeds from `gpt-handoff` without TinaCloud.
- Primary text contrast is 16.72:1 on the main background.
- Secondary text contrast is 8.41:1 on the main background.
- Updated accent contrast is 5.45:1 on the main background and 4.90:1 on charcoal surfaces.
- Production build generates nine static pages.
- `git diff --check` passes.

Next:

- Begin Milestone 6 page and component completion.

## 2026-07-11 - Functional component recovery completed

Completed:

- Restored portfolio Image, VideoPlayer, Gallery, Lightbox, and VideoEmbed components.
- Connected Tina project media to Portfolio detail pages.
- Added automatic lightbox behavior to images inserted inside project narrative content.
- Added automatic related Journal entries and Portfolio projects.
- Added a dedicated structured Resume collection with summary, competencies, experience, and education.
- Added responsive and print-aware Resume components.
- Removed the final unused zero-byte SearchBox and generic layout placeholders.
- Reconciled project documentation around the verified current state.

Verified:

- TinaCMS starts locally after all schema changes.
- Astro generates nine static pages.
- `git diff --check` passes.
- No zero-byte files remain under `src/`.

Deferred:

- Inline narrative video blocks
- Immich album integration
- Pagefind search
- Resume PDF generation

Next:

- Commit and push the approved checkpoint in VS Code.
- Confirm Cloudflare deployment.
- Begin accessibility Chunk 4A.

## 2026-07-10 — Subscription-free Tina workflow selected

Decision:

- TinaCloud will not be used.
- TinaCMS remains a local editing interface.
- Markdown remains the source of truth in GitHub.
- Cloudflare Pages will rebuild the static Astro site after repository pushes.
- The deployed site will not expose a hosted CMS editing interface.

Final editing workflow:

```text
Pull latest branch
→ run local Tina
→ edit Markdown through localhost/admin
→ run production build
→ commit and push
→ Cloudflare rebuilds
```

Multi-machine use:

- clone the same repository on each machine
- check out `gpt-handoff`
- pull before editing
- install dependencies
- run `npm run dev`
- commit and push through VS Code Source Control

Cloudflare diagnosis:

- Cloudflare correctly detects pushes to `gpt-handoff`.
- The deployment failure was reproduced locally.
- `npm run build` currently invokes `tinacms build && astro build`.
- `tinacms build` requires TinaCloud `clientId` and `token`.
- The production build must therefore be changed to `astro build` for the local-only Tina architecture.
- Cloudflare should use `NODE_VERSION=22.22.0`.

Next required repository changes:

- change the production build script to `astro build`
- raise the Node engine minimum to `22.22.0`
- remove unused `@astrojs/cloudflare`
- regenerate the lockfile
- clean Tina initializer demo files
- verify a complete local build
- push and confirm a successful Cloudflare deployment

## 2026-07-10 — TinaCMS local integration running

Changed:

- Initialized TinaCMS in the existing Astro project.
- Installed `tinacms`, `@tinacms/cli`, and `@tinacms/astro`.
- Moved the project from Astro 7 to Astro 6.4.6 because the current Tina Astro integration supports Astro 5 and 6.
- Preserved static Astro output instead of adopting the Node SSR configuration created by the Tina initializer.
- Removed the active `@astrojs/node` import and Node adapter from `astro.config.mjs`.
- Added Tina's Astro integration and local admin redirect.
- Added a Vite watcher exclusion for Visual Studio's `.vs` directory to prevent Windows `EBUSY` crashes.
- Added Node type definitions for the Tina TypeScript configuration.
- Created `tina/config.ts` and mapped the existing content structure into Tina.
- Split the broad page editor into separate CMS collections:
  - Homepage
  - Archive Pages
  - Standard Pages
- Retained separate collections for Site Settings, Journal Entries, and Portfolio Projects.

Verified:

- Tina's local GraphQL server starts successfully.
- Tina generates its local client and TypeScript files.
- The CMS loads at `/admin/index.html`.
- Editing the nested homepage hero eyebrow updates `src/content/pages/home.md`.
- Astro immediately renders the edited value on the homepage.

## 2026-07-10 — Site-wide content moved out of templates

Changed:

- Added a `settings` content collection and `src/content/settings/site.md`.
- Added managed page entries under `src/content/pages/`.
- Replaced hard-coded homepage preview data with collection queries.
- Added shared standard-page rendering for About, Resume, and Contact.
- Updated Navigation, Footer, BaseLayout, Hero, and FeaturedArticle to consume managed content.
- Added `CONTENT_GUIDE.md`.

Verified:

- All expected static routes generated.
- Page content and site settings are no longer embedded directly in Astro templates.
- Homepage, Journal, Portfolio, About, Resume, and Contact render from managed Markdown.
- Internal links and optional-image fallbacks were verified.

## 2026-07-10 — Functional content core completed

Completed:

- Journal and Portfolio detail routing
- Journal and Portfolio content schemas
- Journal and Portfolio detail layouts
- linked archive pages
- collection-driven homepage
- editable supporting page shells
- warning-free eight-page static build

The project then moved from functional content architecture into TinaCMS integration.
