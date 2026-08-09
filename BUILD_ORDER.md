# GTP_Port Build Order

Last updated: 2026-08-09
Working branch: `gpt-handoff`
Current phase: Phase 3 - unified authoring and Cloudflare media delivery

## Current baseline

Sprints 1-16 are complete. Phase 2 is closed and Phase 3 is underway.

The durable source of truth remains Git-backed Markdown/MDX on `gpt-handoff`. Use `STARTUP_PROMPT.md` for fresh-session GitHub safeguards and always verify the remote branch tip before editing.

## Current operating model

- Astro 6 static site on Cloudflare Pages
- TinaCloud editing at `/admin/`
- deliberate production publishing through **Publish Site**; automatic production branch deployments are disabled
- every Content Entry is a Journal entry
- Portfolio is composed from dedicated Custom Pages plus direct Journal destinations
- Journal Sections are Tina-managed documents
- owner-facing subject taxonomy is **Topics**; underlying collection and public `/tags/` routes remain stable
- Topics support Active/Retired state and optional replacement-topic migration
- Journal authoring is Markdown-first with formatting/link/media/YouTube insertion and Media Manager image selection
- Standard Page and Custom Page body fields use the same Markdown Write/Split/Preview editor; structured page fields remain unchanged
- Import creates the same simplified Journal model as manual authoring
- Resume is structured and maintained from one Tina-backed source
- robots, sitemap, RSS, redirects, and canonical metadata are part of the static build

## Active build sequence

### Sprint 16 - Immich-to-R2 media backend (complete)

The protected backend, private Immich origin, Cloudflare Access service
identity, R2 publication store, and public custom domain are operational.
Hosted acceptance passed status, browse, preview, first publish, public
delivery, duplicate reuse, offline-origin independence, and Tunnel recovery.

### Sprint 17 - site-wide Immich/R2 integration (active)

Connect all applicable image fields, Markdown insertion, and Import to the
verified shared browse/publish/reuse workflow.

Required planning gate:

- inventory every applicable Tina image field, Markdown insertion path, Import
  path, stored source shape, and public renderer
- define one owner-facing picker flow before changing schemas
- preserve existing repository-managed and external HTTPS image support
- keep Immich credentials/origin details server-only
- store only permanent R2 URLs in durable content

Implementation status:

- inventory and shared flow are recorded in `SPRINT17_MEDIA_INVENTORY.md`
- the reusable picker is connected to structured image fields, Journal/Page
  Markdown insertion, and Import review
- selecting an asset publishes/reuses first and inserts only the returned
  permanent `web` URL
- all 28 authoring tests and the local Tina admin build pass
- hosted deployment and owner acceptance are the remaining gate before Sprint
  17 closes and Sprint 18 becomes active

### Sprint 18 - gallery architecture and security

Revisit live and mirrored gallery delivery after the shared media pipeline is operational.

## Deferred feature candidates

Not scheduled:

- Pagefind search when content volume warrants it
- Giscus comments when public discussion is desired
- generated Resume PDF from the existing structured Resume source
- more advanced related-content ranking
- broader visual page-builder controls

## Required change gates

### Content-only changes

Use Tina, save to `gpt-handoff`, then deliberately publish when the editing session is ready.

### Tina schema changes

A schema change is incomplete until all of these agree:

- `tina/config.ts`
- `src/content.config.ts`
- stored Markdown/MDX
- renderers/consumers
- generated `tina/tina-lock.json`
- TinaCloud reindex/admin behavior
- production build

### Code/routing changes

Run the smallest relevant checks plus, when practical:

```bash
npm run test:authoring
npx tsc --noEmit
npm run build
git diff --check
git status --short
```

Then review affected public routes and deliberate publishing behavior.

## Locked constraints

- preserve existing typography and color choices unless a later redesign explicitly changes them
- preserve durable `/archive/[slug]/` content URLs
- preserve unrelated Tina/content commits; never force-push
- content remains portable Markdown/MDX rather than presentation-specific data
- no reusable GitHub or Cloudflare secret may be delivered to browser code
- prefer retirement/redirect/migration over destructive deletion of referenced taxonomy or established URLs

## Historical detail

Completed sprint scope belongs in `Roadmap.md` and `PROJECT_LOG.md`. Sprint 14 closeout evidence is in `SPRINT14_QA.md`.
