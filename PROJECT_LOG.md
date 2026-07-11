# GTP_Port Project Log

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

- `npx tinacms --version` returns `2.5.3`.
- Tina's local GraphQL server starts successfully.
- Tina generates its local client and TypeScript files.
- The CMS loads at `/admin/index.html`.
- Editing the nested homepage hero eyebrow updates `src/content/pages/home.md`.
- Astro immediately renders the edited value on the homepage.
- The local content editing path is working:

```text
Tina editor
→ Markdown file
→ Astro content collection
→ rendered static page
```

Current limitation:

- TinaCloud credentials and GitHub authentication are not configured yet.
- Production editing through the deployed `/admin/` has not been tested.
- Demo files created by the initializer may still need cleanup.
- The cleaned six-collection Tina schema still needs one complete save-and-render verification pass.

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
