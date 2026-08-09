# GTP_Port

Astro source for AngrySquirrel.org: a dark, editorial-first personal website combining long-form publishing with a professional portfolio of software, photography, video, writing, engineering, and case-study work.

## Current status

Sprints 1-17 are complete. Phase 2 is closed and Phase 3 is underway. The Immich-to-R2 backend, private origin, public media delivery, and site-wide Tina integration are deployed and owner-accepted. Sprint 18 gallery architecture/security is planned and intentionally paused.

The site currently includes:

- Astro 6 static rendering on Cloudflare Pages
- Git-backed Markdown/MDX as the durable content source
- TinaCloud editing at `/admin/`
- deliberate production publishing through **Settings → Publish Site**
- automatic Cloudflare production branch deployments disabled
- one unified Journal content model; every Content Entry is a Journal entry
- durable `/archive/[slug]/` detail URLs
- Portfolio composed from dedicated Custom Pages plus direct Journal destinations
- Tina-managed Journal Sections with stable slugs, aliases, and Active/Retired state
- owner-facing **Topics** taxonomy with stable `/tags/[slug]/` archives, Active/Retired state, aliases, and optional replacement-topic migration
- related-story ranking based primarily on shared Topics, then same Journal Section
- Markdown-first Journal authoring with Write/Split/Preview, formatting controls, inline code, links, Immich/R2 selection, Media Manager image insertion, external images, and YouTube insertion
- the same Markdown editor on Standard Page and Custom Page body fields, without changing their structured metadata or page-block controls
- safe Markdown/MDX Import that accepts body-only Google Docs exports, fills the body during review, lists selectable active Topics, and creates the same simplified Journal model as manual authoring
- a compact structured Homepage
- Tina-managed navigation/footer settings
- guarded Custom Pages with reorderable content blocks
- a structured professional-background Resume maintained from one Tina-backed source
- shared media/lightbox and Immich gallery support
- an Access-protected Immich browse/search/preview service with duplicate-safe R2 publishing
- one shared Tina Immich picker across structured image fields, Markdown insertion, and Import review
- dependency-free `/robots.txt`, `/sitemap.xml`, and `/rss.xml`
- canonical/Open Graph/Twitter metadata in the shared layout

## Source of truth

- Repository branch: `gpt-handoff`
- Content: `src/content/`
- Layout/presentation: `src/pages/`, `src/layouts/`, `src/components/`, `src/styles/`
- Tina schema: `tina/config.ts`
- Astro validation: `src/content.config.ts`
- Generated Tina lock: `tina/tina-lock.json`

TinaCloud is the editing interface; GitHub Markdown/MDX remains the durable source of truth.

## Owner editing workflow

```text
Open /admin/
→ edit and save content in TinaCloud
→ Tina commits to gpt-handoff
→ continue editing without a production rebuild
→ open Settings > Publish Site when the session is ready
→ publish once
→ review the deployed site
```

Draft content remains stored in Git/Tina but does not receive a public route.

## Journal model

Current Journal fields:

- Title
- Description
- Publication Date
- Status (Draft/Published)
- Journal Section
- Topics
- Cover Image
- optional Immich Gallery
- optional structured media
- Markdown body

Deprecated placement/type/project metadata was removed during Sprint 14.

## Topics and Sections

**Journal Section = where the story belongs.**

**Topics = what the story is about.**

Sections are managed under **Content → Journal Sections**. Topics are managed under **Settings → Topics**.

Topics are normally retired rather than deleted. Direct Topic deletion is disabled in Tina. A retired Topic may optionally point to a replacement when two subjects are deliberately consolidated.

The underlying collection remains named `tags` and public subject routes remain `/tags/[slug]/` for compatibility.

## Markdown authoring

Journal bodies are semantic Markdown/MDX. The editor toolbar supports:

- bold
- italic
- strikethrough
- inline code
- bulleted and numbered lists
- hyperlinks
- Media Manager image insertion
- Immich/R2 image selection
- external HTTPS images
- YouTube insertion

Underline is intentionally unsupported. The only approved custom body element is the constrained self-closing `<YouTube ... />` element documented in `CONTENT_GUIDE.md`.

## Local development

```bash
npm install
npm run dev
```

For a full Tina-aware validation with credentials available:

```bash
npm run test:authoring
npx tsc --noEmit
npm run build
git diff --check
git status --short
```

For Astro-only validation without TinaCloud credentials:

```bash
npm run build:astro
```

## Tina schema rule

A schema change is incomplete until all of these agree:

- `tina/config.ts`
- `src/content.config.ts`
- stored Markdown/MDX
- every route/layout/component consumer
- generated `tina/tina-lock.json`
- TinaCloud reindex/admin behavior
- production build

Do not hand-edit `tina/tina-lock.json`.

## Documentation

- `DOCUMENTATION.md` — documentation index
- `BUILD_ORDER.md` — current maintenance/future-work queue
- `Roadmap.md` — completed milestones and active/planned Phase 3 work
- `SPRINT17_MEDIA_INVENTORY.md` — image-field, Markdown, Import, storage, and renderer integration map
- `SPRINT14_QA.md` — Phase 2 closeout evidence and explicitly un-run formal checks
- `SITE_MAINTENANCE_GUIDE.md` — owner code/CMS maintenance guide
- `CONTENT_GUIDE.md` — content and taxonomy workflow
- `PUBLISHING_GUIDE.md` — deliberate publishing/security/recovery
- `MEDIA_BACKEND_GUIDE.md` — Immich/Tunnel/Access/R2 setup, API contract, and verification
- `IMPORT_GUIDE.md` — import behavior
- `RESUME_DESIGN.md` — Resume source/design rules

## Next work

Sprint 17 is closed. Sprint 18 will revisit gallery delivery and security when work resumes; it is planned but not active. Deferred candidates such as Pagefind, Giscus, and generated Resume PDF remain outside Phase 3. See `Roadmap.md`.
