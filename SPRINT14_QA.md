# Sprint 14 Migration and QA Record

Last updated: 2026-08-07
Branch: `gpt-handoff`
Baseline at Sprint 14 start: `a30437c2bf378b6aff2cf1c2e99bdfa5972c041c`
Status: **Complete / owner-accepted**

## Purpose

This document is the verification record for the final Phase 2 migration, QA, and documentation sprint. It distinguishes implemented/source evidence, owner-hosted verification, and formal checks that were not re-run during closeout.

## Migration outcomes

### Retired content and routes

Verified from the repository and migration work:

- retired Services proof pages are absent
- retired Portfolio category documents are absent
- `Test-content.mdx` is absent
- deprecated `Photography-Samples.mdx` was removed in Sprint 14 and its old archive URL is redirected to `/portfolio/photography/`
- durable Content Entry detail URLs remain under `/archive/[slug]/`
- intentional redirects remain for the retired Portfolio landing/categories, Services routes, and test content

### Journal model

Sprint 14 completed the simplification that earlier audits had only proposed.

Every Content Entry is now a Journal entry. Portfolio is built from dedicated Custom Pages and direct Journal destinations rather than a second placement state.

Removed from Journal authoring/runtime behavior:

- `placement`
- `entryType`
- `primaryTopic`
- `technologies`
- manual Repository/Demo/External entry links

The old project-specific metadata renderer and Placement editor were removed.

### Journal Sections

Hard-coded section options were replaced with Tina-managed Journal Section documents.

Sections support:

- public label
- stable slug
- description
- Active/Retired state
- previous-slug aliases

Retired or missing sections fall back to Latest rather than breaking the story. Previous slugs resolve to the current canonical section URL.

Owner-hosted verification confirmed the Journal editor and Journal Section controls load and function after TinaCloud reindex.

### Topics

The underlying `tags` collection and `/tags/[slug]/` public URLs were intentionally preserved, but the owner-facing concept is now **Topics**.

Topics support:

- Topic Name
- Description
- Active/Retired state
- optional Replacement Topic
- permanent slug
- previous-slug aliases

Direct Topic deletion is disabled in Tina. Retiring is the normal removal workflow. A retired Topic with a replacement can resolve old references/routes to the replacement. Distinct concepts remain distinct unless a replacement is deliberately configured; regression coverage explicitly protects the `Overlander` website topic from being conflated with the `Overlanding` subject topic.

Journal and Import selectors offer active Topics while preserving retired Topics already attached to existing stories.

### Related stories

Related-story ranking now favors shared Topics, with the same Journal Section used as a secondary signal. The previous `primaryTopic`/`entryType` scoring was removed.

### Markdown authoring

The Journal Markdown editor now provides controls for:

- bold
- italic
- strikethrough
- inline code
- bulleted lists
- numbered lists
- hyperlinks
- Media Manager image insertion
- external image insertion
- YouTube insertion

Underline was intentionally omitted because it is not standard Markdown and did not justify custom raw-HTML support.

Owner-hosted verification confirmed the updated Journal editor and Media Manager insertion workflow are present and usable.

### Import parity

Import now targets the same simplified Journal model as manual creation and always creates a Draft. It uses active Journal Sections and active Topics while preserving supported media/body metadata.

### Tina navigation/editor cleanup

Owner-facing navigation now uses:

- **Settings** — Site Settings, Topics, Publish Site
- **Pages** — Main Homepage, Journal Homepage, About, Contact, Resume, Custom Pages
- **Content** — Journal, Journal Sections, Import
- **Media** — Media Manager

The Journal Homepage dead Header Style control was removed. The unused Resume additional body field was also removed during a synchronized Tina schema/lock migration.

Owner-hosted review confirmed the updated sidebar and page/editor structure are working.

### Topic status clarity

The remaining cosmetic ambiguity in Tina's boolean Topic `Active` switch was addressed without another schema migration: Topic edit screens add the explicit legend **Off = Retired · On = Active**. This is an admin-UI clarification only and does not change stored data or GraphQL schema.

## Crawl/feed implementation

Sprint 14 added:

- `/robots.txt`
- `/sitemap.xml`
- `/rss.xml`
- RSS autodiscovery in the shared document head

The static generators use current published content and exclude drafts. Public entry links remain on durable `/archive/` URLs.

## Deliberate publishing

The protected **Publish Site** workflow is operational. It uses Cloudflare Access validation, a server-only deploy hook, KV duplicate-request protection, saved/live commit comparison, and `/deployment.json` status.

During Sprint 14 the owner disabled automatic Cloudflare production branch deployments. Production publishing is therefore deliberate rather than save-triggered.

A schema-lock mismatch encountered during the Journal migration was resolved by regenerating and committing `tina/tina-lock.json`, redeploying, and reindexing `gpt-handoff` in TinaCloud. A second Topics schema migration followed the same successful lock/reindex workflow.

## Hosted owner verification completed

- [x] TinaCloud reindex completed after Journal schema migration
- [x] Tina sidebar loads without GraphQL schema mismatch
- [x] Journal opens and deprecated fields are gone
- [x] Journal Status and dynamic Journal Section controls work
- [x] Markdown toolbar is present
- [x] Media Manager insertion works
- [x] Journal Sections are available and editable
- [x] Topics management is available in Settings
- [x] Journal Topic selection works
- [x] Import mirrors the simplified Journal model
- [x] automatic production branch deployments are disabled
- [x] deployed site remained functional after the migration/reindex cycles

## Source/build evidence

Cloudflare successfully deployed after the regenerated Tina lock was committed for the Journal migration. The owner subsequently regenerated and committed the Topics lock and reported the resulting editor state as working.

Sprint 12 authoring regression coverage was updated where the old Journal fields had intentionally been removed, and new Topic retirement/distinction regression coverage was added.

## Formal checks not re-run during closeout

The following were not independently exercised in this closeout session and are therefore **not represented as passed**:

- unauthenticated publish-endpoint rejection test
- wrong-identity publish-endpoint rejection test
- deliberate failed-build recovery drill
- exhaustive broken-link crawl
- current Chrome/Firefox/Safari-family matrix
- Lighthouse accessibility/SEO/performance/best-practices run

These are retained as maintenance hardening checks rather than blockers to owner acceptance of Phase 2. Any future routing, publishing-security, or major layout sprint should include the relevant subset.

## Phase 2 acceptance

Sprint 14 is accepted complete because the intended content model, owner-facing Tina workflow, deliberate publishing mode, schema/lock synchronization, and deployed editor behavior are now coherent and owner-verified. Remaining formal browser/security/performance exercises are explicitly documented above instead of being silently marked complete.
