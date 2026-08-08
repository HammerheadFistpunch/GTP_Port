# GTP_Port Build Order

Last updated: 2026-08-07
Working branch: `gpt-handoff`
Current phase: Maintenance / content growth

## Current baseline

Sprints 1-14 are complete. Phase 2 is closed and the deployed site is owner-accepted.

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
- Import creates the same simplified Journal model as manual authoring
- Resume is structured and maintained from one Tina-backed source
- robots, sitemap, RSS, redirects, and canonical metadata are part of the static build

## Maintenance priorities

There is no active numbered sprint. Only start a new sprint when a concrete feature, defect, or maintenance need warrants it.

Routine work should favor:

1. content creation and curation
2. small Tina/editor usability fixes
3. dependency/security maintenance
4. accessibility/link/metadata checks after meaningful layout or routing changes
5. documentation updates whenever owner workflow changes

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
