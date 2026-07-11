# GTP_Port Build Order

Last updated: 2026-07-10  
Working branch: `gpt-handoff`

## Current phase

> **TinaCMS Integration + Functional Verification**

The Astro content architecture is complete enough for CMS integration. TinaCMS now runs locally against the existing Git-backed Markdown structure while the public site remains static-first for Cloudflare Pages.

## Verified complete

- Static Astro site architecture
- Working Home, Journal, Portfolio, About, Resume, and Contact routes
- Working Journal and Portfolio detail routes
- Collection-driven homepage, archives, and detail pages
- Editable Markdown content under `src/content/`
- Site settings and page copy removed from Astro templates
- TinaCMS CLI installed and local development server running
- Tina admin available at `/admin/index.html`
- Tina successfully edits homepage Markdown and Astro reflects the change
- Static output preserved in `astro.config.mjs`
- Visual Studio `.vs` folder excluded from Vite file watching

## Current Tina collections

- Site Settings
- Homepage
- Archive Pages
- Standard Pages
- Journal Entries
- Portfolio Projects

## Immediate next tasks

### Task 1 — Verify the cleaned Tina schema

- Restart `npm run dev`
- Confirm the six Tina collections appear separately
- Open and save one item in each collection
- Confirm edits update the matching Markdown files
- Confirm the public routes reflect those edits

### Task 2 — Remove initializer leftovers

Review and remove any unused Tina demo content or routes, including:

- `content/posts/hello-world.md`
- `/tinacms-demo`
- unused `@astrojs/node` dependency
- other generated demo files not required by the real site

Do not remove:

- `tina/config.ts`
- `tina/__generated__/`
- `public/admin/`
- Tina-related package scripts

### Task 3 — Run full verification

Run:

```bash
npm run build
```

Verify:

- build completes without errors
- all expected routes generate
- no internal links break
- Tina-managed content still validates
- Cloudflare Pages remains configured for static output

### Task 4 — Connect TinaCloud and GitHub

- Create or connect the TinaCloud project
- add `TINA_PUBLIC_CLIENT_ID`
- add `TINA_TOKEN`
- confirm the production branch
- configure GitHub authentication
- test editing through the deployed `/admin/`

### Task 5 — Resume functional-core work

After Tina production access is confirmed:

- navigation accessibility
- current-page states
- mobile navigation
- focus and reduced-motion styles
- favicon and metadata cleanup
- final functional-core audit

## Deferred

- Pagefind
- Giscus
- Immich integration
- gallery and lightbox
- related content
- resume PDF generation
- final visual polish
