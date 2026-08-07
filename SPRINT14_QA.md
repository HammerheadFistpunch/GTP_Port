# Sprint 14 Migration and QA Record

Last updated: 2026-08-07
Branch: `gpt-handoff`
Baseline at Sprint 14 start: `a30437c2bf378b6aff2cf1c2e99bdfa5972c041c`

## Purpose

This document is the verification record for the final Phase 2 migration, QA,
and documentation sprint. `BUILD_ORDER.md` is the executable checklist;
`SPRINT14_QA.md` records findings and evidence so hosted checks are not confused
with source inspection.

## Source audit findings

### Retired content and routes

Verified from the current repository tree:

- `src/content/flexible-pages/services*` proof pages are absent.
- old Portfolio category documents such as `software-projects.md`,
  `case-studies.md`, and `writing-samples.md` are absent.
- `Test-content.mdx` is absent.
- the surviving Portfolio Flexible Pages are Video and Photography.
- durable Content Entry detail URLs remain under `/archive/[slug]/`.

`public/_redirects` intentionally preserves the retired public URLs:

- `/portfolio/` -> `/`
- Software Projects and Case Studies -> `/journal/projects/`
- Writing Samples -> `/journal/`
- Services proof routes -> `/portfolio/video/`
- Test-content archive route -> `/journal/`

These redirects still require deployed HTTP verification.

### Public navigation/content references

Current Homepage destinations go directly to Video, Photography, Projects, and
Journal routes. Main navigation treats Portfolio as a label-only group with no
`/portfolio/` landing-page dependency.

The remaining `/portfolio/` string references found by repository search are
primarily historical documentation, intentional redirects, current Video and
Photography routes, or renderer logic for those surviving Flexible Pages. They
are not evidence that the retired Portfolio landing page still exists.

### Compatibility fields

#### `placement`

Keep. Repository search confirms active consumers in:

- Journal landing/section filtering
- tag archives
- Homepage entry filtering/selection logic
- entry layout/back-link behavior
- Tina placement editor
- Markdown import tooling
- authoring regression tests

Removing it in Sprint 14 would require a new visibility/publication model and is
not cleanup-only work.

#### Resume additional body

The Tina Resume `Additional Resume Content` body field is no longer rendered by
`/resume/`. It remains a compatibility hold because removing a Tina schema field
requires regenerating and validating `tina/tina-lock.json` in the same change.
Do not edit only `tina/config.ts` through a connector-only session.

## Crawl and feed gap

The Sprint 14 roadmap called for robots, sitemap, and RSS verification, but no
implementation existed at Sprint 14 start.

Added in Sprint 14A without new dependencies:

- `src/pages/robots.txt.ts`
- `src/pages/sitemap.xml.ts`
- `src/pages/rss.xml.ts`
- RSS autodiscovery link in `BaseLayout.astro`

Behavior:

- robots permits crawling and points to `/sitemap.xml`.
- sitemap includes fixed public pages, Journal sections, tag archives,
  non-draft Flexible Pages, and non-draft archive entries.
- sitemap uses entry updated/publication dates when available.
- RSS includes only dated, non-draft Journal/both-placement entries and links to
  their durable `/archive/` URLs.
- drafts and Portfolio-only entries are excluded from RSS.

Deployed endpoint verification is still required.

## Metadata source audit

`BaseLayout.astro` currently provides:

- page title
- description
- canonical URL
- favicon/manifest metadata
- Open Graph title, description, type, URL, and optional image
- Twitter/X card metadata
- RSS autodiscovery after Sprint 14A

Metadata behavior still requires generated/deployed sampling during the final QA
gate.

## Validation constraints in this session

The current agent shell has Git but cannot resolve `github.com`, and `gh` is not
installed. Therefore it cannot safely clone/pull the repository, install
packages, run the Tina-aware build, regenerate the Tina lock, or run the local
full QA gate.

Connector-backed changes create normal commits directly on `gpt-handoff`. No
local commit exists whose SHA needs preservation.

Do not record local TypeScript/Tina/Astro validation as passed from this session.
Cloudflare deployment success is useful evidence but does not replace the final
local Tina-aware gate.

## Hosted checks still required

### Routes and crawl/feed

- [ ] retired routes return expected 301 destinations
- [ ] `/robots.txt` returns crawl policy and sitemap URL
- [ ] `/sitemap.xml` is valid XML and contains only intended public routes
- [ ] `/rss.xml` is valid RSS and contains current Journal items

### Tina

- [ ] Journal section and featured-story edits save correctly
- [ ] tag create/select and alias behavior work
- [ ] Homepage reorder/hide/selections work
- [ ] navigation reorder/children work
- [ ] fixed-page shortcuts open/save the intended documents
- [ ] New Pages and Media Manager work
- [ ] Resume structured list editing/reordering works

### Deliberate publishing

- [ ] automatic Cloudflare production builds are disabled for ordinary saves
- [ ] Tina save alone does not deploy production
- [ ] Publish Site deploys pending saved changes
- [ ] unauthenticated request is rejected
- [ ] wrong identity is rejected
- [ ] failed-build recovery is exercised and documented

### Public QA

- [ ] keyboard/focus review
- [ ] phone/tablet/desktop responsive review
- [ ] Chrome/Firefox/Safari-family review
- [ ] internal-link crawl
- [ ] Lighthouse accessibility/SEO/performance/best-practices review

## Final local gate

Run from a networked checkout with Tina credentials:

```bash
npm run test:authoring
npx tsc --noEmit
npm run build
git diff --check
git status --short
```

If the Resume body field or any other Tina field is removed, regenerate the Tina
lock and reindex TinaCloud before closing Sprint 14.
