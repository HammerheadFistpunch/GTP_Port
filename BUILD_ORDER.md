# GTP_Port Build Order

Last updated: 2026-08-07
Working branch: `gpt-handoff`
Current phase: Sprint 14 - Migration, QA, and documentation

## Current baseline

Sprints 1-13 are implemented. Sprint 13 rebuilt `/resume/` as a structured
professional-background page and the deployed result is owner-approved.
`RESUME_DESIGN.md` is the Resume-specific source/design record.

The durable source of truth remains Git-backed Markdown/MDX on `gpt-handoff`.
Use `STARTUP_PROMPT.md` for fresh-session GitHub CLI safeguards and always verify
the remote branch tip before editing.

## Sprint 14 objective

Finish Phase 2 as a reliable publishing system: remove only proven compatibility
leftovers, verify the public route/content model, close crawl/feed gaps, complete
hosted-editor and publishing checks, and reconcile owner documentation with the
deployed site.

## 14A - Route, migration, and crawl audit

Status: in progress.

Completed:

- [x] verify retired Services proof pages are absent from source
- [x] verify retired Portfolio category pages are absent from source
- [x] verify `Test-content.mdx` is absent from source
- [x] verify intentional redirects remain for retired public URLs
- [x] verify no public Homepage or primary navigation destination depends on the
  retired `/portfolio/` landing page
- [x] add dependency-free `/robots.txt`
- [x] add dependency-free `/sitemap.xml` from published content collections
- [x] add dependency-free `/rss.xml` for dated published Journal entries
- [x] add RSS autodiscovery metadata to the shared page head

Still verify after deployment:

- [ ] `/portfolio/` redirects to `/`
- [ ] retired Portfolio category URLs redirect to their approved Journal targets
- [ ] retired Services URLs redirect to `/portfolio/video/`
- [ ] retired Test entry URL redirects to `/journal/`
- [ ] `/robots.txt`, `/sitemap.xml`, and `/rss.xml` return the expected content
- [ ] sitemap excludes drafts and retired routes
- [ ] RSS excludes drafts and Portfolio-only entries

## 14B - Compatibility and schema audit

Do not remove a Tina field unless `tina/config.ts`, the generated Tina lock,
Astro validation, and hosted-editor behavior can be validated together.

Known holds:

- [ ] Resume `Additional Resume Content` body field: no longer rendered; remove
  only with a Tina lock regeneration/validation pass
- [ ] entry `placement`: still actively consumed by Journal filtering, entry
  layout/back-links, tag archives, Homepage logic, import tooling, and tests;
  **not currently removable**

Required checks:

- [ ] search for other fields/components that have no live consumer
- [ ] regenerate Tina lock for any approved schema cleanup
- [ ] run Tina local indexing/admin compilation after schema cleanup
- [ ] reindex `gpt-handoff` in TinaCloud after schema changes

## 14C - Hosted Tina QA

Carry forward the hosted checks intentionally deferred from earlier sprints:

- [ ] Journal: change an entry section and select a different featured story
- [ ] Tags: create/select a tag and verify an alias preserves an old tag URL
- [ ] Homepage: reorder/hide/edit sections and change Journal/Portfolio selections
- [ ] Navigation: reorder top-level/child links and verify desktop/mobile behavior
- [ ] fixed page shortcuts open and save the intended documents
- [ ] New Pages creation and Media Manager work
- [ ] Resume experience/capability/education lists edit, reorder, and save cleanly

## 14D - Deliberate publishing follow-up

Sprint 11's protected **Publish Site** action works, but deliberate-only
publishing is not complete while automatic Cloudflare production builds remain
enabled.

- [ ] disable automatic production builds for ordinary Tina saves
- [ ] prove a Tina save causes no production deployment
- [ ] prove Publish Site deploys the complete saved session
- [ ] verify unauthenticated publishing is rejected
- [ ] verify the wrong identity is rejected
- [ ] exercise and document failed-build recovery

Do not mark this section complete from configuration inspection alone; record the
hosted behavior.

## 14E - Full validation gate

From a workspace with repository/network/Tina credentials available:

```bash
npm run test:authoring
npx tsc --noEmit
npm run build
git diff --check
git status --short
```

Then verify:

- [ ] generated route count and expected route set
- [ ] broken internal links
- [ ] redirects
- [ ] canonical/description/Open Graph metadata
- [ ] robots, sitemap, and RSS
- [ ] keyboard navigation and focus behavior
- [ ] phone, tablet, and desktop layouts
- [ ] current Chrome, Firefox, and Safari-family rendering
- [ ] Lighthouse accessibility, SEO, performance, and best-practices review

## 14F - Documentation closeout

Required before Phase 2 close:

- [ ] reconcile `Roadmap.md` status with Sprints 1-14
- [ ] append Sprint 13/14 implementation and verification to `PROJECT_LOG.md`
- [ ] reconcile `SITE_MAINTENANCE_GUIDE.md` with the current Resume, sitemap/RSS,
  navigation, Tina, and publishing architecture
- [ ] update content/import/publishing guides only where behavior changed
- [x] keep `README.md`, `DOCUMENTATION.md`, `RESUME_DESIGN.md`, and
  `STARTUP_PROMPT.md` aligned with the current source
- [ ] update `STARTUP_PROMPT.md` to the post-Phase-2 maintenance state

## Locked constraints

- preserve existing typography and color choices
- preserve durable `/archive/[slug]/` content URLs
- preserve unrelated Tina/content commits; never force-push
- content remains portable Markdown/MDX rather than presentation-specific data
- no reusable GitHub or Cloudflare secret may be delivered to browser code
- no compatibility field is removed without proving its replacement

## Sprint completion rule

Sprint 14 is complete only when the relevant local build/type/Tina checks pass,
the hosted editor and publishing checks are recorded, deployed route/crawl/feed
behavior is verified, and the owner documentation matches the live system.

Historical sprint detail belongs in `Roadmap.md` and `PROJECT_LOG.md`; this file
is intentionally limited to the current executable queue.
