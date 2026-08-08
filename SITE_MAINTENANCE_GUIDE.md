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
| `src/pages/deployment.json.ts` | saved/live deployment comparison manifest |
| `PUBLISHING_GUIDE.md` | deliberate publishing operation/security/recovery |

## Current content model

Every Content Entry is a Journal entry. There is no `placement` state and no project/article entry type split.

Journal entries contain:

- title
- description
- publication date
- Draft/Published status
- Journal Section
- Topics
- cover image
- optional Immich/structured media
- Markdown body

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

Journal bodies are Markdown-first. The custom editor provides Write/Split/Preview plus toolbar insertion for bold, italic, strikethrough, inline code, lists, hyperlinks, Media Manager images, external images, and YouTube.

Use standard Markdown wherever possible. The only approved custom inline body element is the self-closing YouTube element documented in `CONTENT_GUIDE.md`.

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

## Future work

No Sprint 15 is currently defined. Deferred candidates live in `Roadmap.md` and should become a new sprint only when there is a concrete need.
