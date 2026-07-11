# GTP_Port Project Log

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
