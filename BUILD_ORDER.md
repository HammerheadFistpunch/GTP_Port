# GTP_Port Build Order

Last updated: 2026-08-08
Working branch: `gpt-handoff`
Current phase: Phase 3 - unified authoring and Cloudflare media delivery

## Current baseline

Sprints 1-15 are complete. Phase 2 is closed and Phase 3 is underway.

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

### Sprint 16 - Immich-to-R2 media backend (next)

Build the protected Cloudflare publishing layer that lets Tina browse private Immich assets and publish durable optimized copies to R2 without exposing credentials or the home origin.

Required outcomes:

- R2 bucket and `media.angrysquirrel.org`
- authenticated Worker/API endpoints
- server-side Immich browse/search/preview
- deterministic object keys, source metadata, and duplicate-safe publishing
- optimized public variants stored in R2
- no Immich API key, R2 credential, share secret, or home origin in browser-delivered code/content
- independent verification that a published R2 asset works while Immich is unavailable

### Sprint 17 - site-wide Immich/R2 integration

Connect all applicable image fields, Markdown insertion, and Import to the shared publish/reuse workflow.

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
