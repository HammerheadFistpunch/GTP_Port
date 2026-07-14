# GTP_Port Project Log

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
