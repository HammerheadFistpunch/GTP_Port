# AngrySquirrel.org Site Maintenance Guide

This guide describes the current post-Phase-2 AngrySquirrel.org repository and how to make small changes safely.

## The short version

| Change | Primary files | Minimum check |
| --- | --- | --- |
| Edit words, links, images, Topics, Sections, or Journal entries | TinaCMS / `src/content/` | deliberate Publish Site build + deployed review |
| Change colors, fonts, spacing, or component appearance | `src/styles/` or component `.astro` | `npm run build:astro` |
| Add/remove/change a Tina field | Tina schema + Astro schema + stored content + consumer + Tina lock | Tina indexing/reindex + production build |
| Change routes, collections, packages, or filenames | multiple connected files | full build + link/redirect review |

The most important rule remains:

> A Tina field is not complete until the editing schema, Astro validation, stored Markdown/MDX, rendered consumer, and generated Tina lock agree.

## Safe working routine

1. Pull the latest `gpt-handoff` branch.
2. Check for existing/unrelated Tina content commits before editing.
3. Start locally with `npm run dev` when Tina work is involved, or `npm run build:astro` for Astro-only visual work.
4. Make one focused change at a time.
5. Review changed files before committing.
6. Run the smallest relevant checks; use the full gate for schema/routing/dependency work.
7. Push to `gpt-handoff`.
8. For ordinary content changes, use **Settings → Publish Site** only when the editing session is ready for production.
9. Review the deployed result.

Automatic production branch deployments are disabled; a Tina save should not publish production by itself.

## Repository map

| Location | Responsibility |
| --- | --- |
| `src/content/entries/` | Journal MDX entries |
| `src/content/tags/` | Topic documents; owner-facing label is Topics, public routes remain `/tags/` |
| `src/content/journal-sections/` | dynamic Journal Section documents |
| `src/content/pages/` | fixed editable Homepage, Journal, About, Contact, Resume |
| `src/content/flexible-pages/` | Custom Pages with explicit public paths |
| `src/content/settings/site.md` | navigation/footer/site settings |
| `src/content.config.ts` | Astro validation |
| `tina/config.ts` | Tina collections and fields |
| `tina/components/` | custom Tina controls/editor behavior |
| `tina/tina-lock.json` | generated Tina schema lock; never hand-edit |
| `src/pages/` | public route/query behavior |
| `src/layouts/` | shared page/entry presentation |
| `src/components/` | reusable UI/content components |
| `src/styles/` | global visual system |
| `functions/admin/api/publish.js` | Access-validated deploy-hook relay |
| `functions/admin/api/media/` | Access-validated private Immich browse and R2 publish endpoints |
| `src/server/media-backend.js` | Immich request validation, response minimization, deterministic R2 publication |
| `src/pages/deployment.json.ts` | saved/live deployment comparison manifest |
| `PUBLISHING_GUIDE.md` | deliberate publishing operation/security/recovery |
| `MEDIA_BACKEND_GUIDE.md` | media backend activation, endpoint contract, security, and recovery |

## Current content model

Every Content Entry is a Journal entry. There is no `placement` state and no project/article entry type split.

Journal entries contain:

- title
- Markdown body
- Journal Section
- Topics
- Draft/Published status
- description
- publication date
- cover image
- optional Immich gallery

New Journal entries default to Draft and today's date. Additional Media has
been removed from Tina authoring; inline images and YouTube are the supported
new-entry workflow. The layout still reads legacy structured media.

Portfolio is composed from dedicated Custom Pages plus direct Journal destinations. Entry detail URLs remain durable under `/archive/[slug]/`.

## Journal Sections

Sections answer **where a story belongs**.

Manage them under **Content → Journal Sections**. Sections have a name, stable slug, description, Active/Retired state, and optional previous slugs.

- Rename the visible name freely.
- Treat the slug as durable.
- Retire rather than deleting a section that has historical use.
- Retired/missing sections fall back to Latest instead of breaking story routes.

## Topics

Topics answer **what a story is about** and drive subject archives/related-story relevance.

Manage them under **Settings → Topics**.

- Add Topics when they are reusable subjects.
- Rename Topic Name freely; keep the permanent slug stable.
- Retire a Topic instead of deleting it.
- Retired Topics disappear from normal new-entry selection but remain valid on old entries.
- Use Replacement Topic only for an intentional consolidation.
- Direct Topic deletion is disabled in Tina.
- Underlying public archives remain `/tags/[slug]/` for compatibility.

## Markdown authoring

Journal bodies are Markdown-first. The title and body lead the Journal form,
with classification/status and supporting metadata below. The custom editor
uses a compact icon toolbar for bold, italic, strikethrough, inline code, lists,
links, Immich/R2 images, Media Manager images, external images, and YouTube.
Write is the default; desktop adds Split while mobile keeps only Write/Preview.
Journal Section and Status use native selects; Topics uses a compact expandable
multi-select instead of an always-open checkbox wall.

Use standard Markdown wherever possible. The only approved custom inline body element is the self-closing YouTube element documented in `CONTENT_GUIDE.md`.

## Import maintenance

The Tina **Content → Import** screen accepts both canonical Markdown/MDX with YAML frontmatter and body-only Google Docs Markdown exports. Body-only input must remain entirely intact in the review body field; Tina owns final frontmatter serialization when the draft is created. Keep active Topics visible and selectable in review so importing never depends on remembering taxonomy labels. Import review reuses the ordinary Markdown editor and shared Immich picker.

Importer parsing, safety, filename/title inference, and Topic resolution coverage lives in `tests/sprint12c-import.test.mjs`. Run `npm run test:authoring` after importer or Journal schema changes.

## Custom Pages

Custom Pages use explicit `path` frontmatter for routing. Physical folders are editorial organization only.

Changing the page title does not change the URL. Changing `path` does. Add a redirect before moving an established URL.

Use Draft for reversible unpublishing. Page blocks are intentionally constrained; do not add unrestricted layout/style controls unless a later roadmap phase explicitly approves that direction.

## Resume

The Resume is one structured source under `src/content/pages/resume.md`, exposed through Tina. Do not create a second independently maintained Resume dataset for a PDF. If a generated PDF is added later, it should consume the same structured source.

## Visual changes

Global colors/spacing live primarily in `src/styles/variables.css`; typography lives in the shared typography styles. Component-local visual changes belong in the component's scoped styles.

Preserve the existing typography/color system unless a future redesign explicitly changes it.

## Tina schema changes

For any schema change:

1. update `tina/config.ts`
2. update `src/content.config.ts` if stored shape/validation changes
3. update stored Markdown/MDX as needed
4. update every renderer/query/consumer
5. run `npm run dev` so Tina regenerates `tina/tina-lock.json`
6. review and commit the lock with the schema change
7. deploy
8. reindex `gpt-handoff` in TinaCloud
9. open `/admin/` and verify the affected editor
10. run/confirm production build behavior

A TinaCloud reindex cannot repair a stale committed lock by itself.

## Full validation gate

Use for schema, route, dependency, or substantial rendering changes:

```bash
npm run test:authoring
npx tsc --noEmit
npm run build
git diff --check
git status --short
```

Then verify affected public routes, redirects, metadata, responsive behavior, and deliberate publishing.

## Publishing

Normal owner workflow:

1. save edits in Tina
2. keep unfinished work Draft
3. finish the session
4. open **Settings → Publish Site**
5. publish once when Saved and Live differ
6. review the deployed site

Do not re-enable automatic production branch deployments unless intentionally abandoning the deliberate publishing model.

## Page body editing

Journal entries, Standard Pages (About/Contact), and the legacy body region on Custom Pages use the shared Markdown Write/Split/Preview editor. These fields remain raw Markdown/MDX body content in Git; Astro renders them through the existing collection `render()` path.

Do not automatically apply the Markdown field to every textarea. Homepage section copy, Journal landing copy, Resume records, SEO descriptions, captions, and Custom Page block controls are intentionally separate structured/plain-text fields.

## Media backend maintenance

The Sprint 16 backend keeps Immich credentials and its private origin in server-only Cloudflare secrets. `/admin/api/media/*` is protected by the same Access JWT validation used for publishing plus an exact-owner identity check.

Do not put `IMMICH_BASE_URL`, `IMMICH_API_KEY`, or Access service-token values in Tina code, `PUBLIC_` variables, content frontmatter, or client-delivered JavaScript. R2 is accessed through the `MEDIA_BUCKET` binding; no S3 credential belongs in the application.

Published object keys are revisioned and immutable. Do not overwrite or automatically delete old revisions because existing Markdown may still reference them. See `MEDIA_BACKEND_GUIDE.md` before changing endpoints, bindings, retention, caching, or origin protection.

`ImmichImagePicker.tsx` is the shared owner-facing client. It calls only the
protected same-origin endpoints, shows protected thumbnails, then inserts the
returned `web` variant after publication/reuse succeeds. `ExternalImageField`
uses it for structured sources; `MarkdownBodyField` uses it for portable image
syntax; Import reuses both paths. The field/renderer inventory and deliberate
Sprint 18 exclusions are in `SPRINT17_MEDIA_INVENTORY.md`.

Albums are displayed as openable thumbnail cards rather than only a search
filter. On screens up to 640px the picker is a full-viewport dialog with stacked
filters, touch-sized controls, and a responsive two-column image grid (one
column below 360px). Preserve these constraints when changing picker layout.

## Active roadmap

Sprints 16 and 17 are complete, deployed, and owner-accepted. Gallery architecture/security remains planned as Sprint 18 and is intentionally paused. See `BUILD_ORDER.md`, `Roadmap.md`, `SPRINT17_MEDIA_INVENTORY.md`, and `MEDIA_BACKEND_GUIDE.md`.
