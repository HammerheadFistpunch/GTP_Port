Roadmap.md


# GTP_Port Roadmap

Last reconciled: 2026-07-10 against `master` commit `865e5fc`.

## Vision

Build AngrySquirrel.org as a fast, dark, editorial-first personal site that
combines long-form publishing with a professional corpus of software,
photography, video, writing, engineering, and case-study work.

The system remains:

- Static-first
- Git-backed
- Content-focused
- Photography-friendly
- Maintainable without routine code changes
- Designed in Astro, with any future CMS limited to editing content

## Status legend

- **Complete** — implemented and verified
- **Partial** — useful implementation exists, but the milestone is not complete
- **Placeholder** — file or route exists without a usable implementation
- **Not started** — no implementation exists

## Milestone 1 — Foundation

Status: **Complete**

- Astro project and dependency lockfile
- GitHub repository
- Cloudflare Pages deployment history
- Automatic deployment pipeline
- Static production build
- Top-level source organization

Exit evidence: Astro 7.0.7 production build succeeds from the locked dependency
set.

## Milestone 2 — Visual foundation

Status: **Partial**

Implemented:

- Dark charcoal/slate surfaces
- Steel-blue accent
- Lato UI and Newsreader editorial direction
- Basic spacing, radius, border, shadow, and width tokens
- Global typography and utility files
- BaseLayout, Navigation, Footer, Hero, Button, Container, SectionTitle
- JournalCard, FeaturedArticle, PortfolioCard

Remaining:

- Complete focus, active, hover, and reduced-motion states
- Deliberate mobile navigation
- Final responsive type and spacing scale
- Contrast audit
- Component-state consistency
- Performance decision for web font loading

Exit condition: the functional core is complete and every used component has
verified desktop, mobile, keyboard, and contrast behavior.

## Milestone 3 — Functional content core

Status: **Current milestone**

Required:

- Working Journal entry routes
- Working Portfolio project routes
- Rendered Markdown bodies
- Expanded content schemas
- Journal and Portfolio detail layouts
- Linked, designed archive pages
- Collection-driven homepage previews
- Valid local media or deliberate fallbacks
- Non-empty About, Resume, and Contact pages
- Complete per-page titles and descriptions
- Warning-free production build

Exit condition: a new Markdown journal entry or project automatically appears
on its archive, opens at a stable URL, renders through the correct layout, and
can be featured on the homepage without editing a separate data array.

## Milestone 4 — Page and component completion

Status: **Not started**

Journal:

- ArticleMeta
- Categories or filters with real destinations
- RelatedArticles
- Reading time
- Image and code treatment

Portfolio:

- ProjectMeta
- Project types and filters
- Gallery
- Lightbox
- Video embeds
- RelatedProjects

Supporting pages:

- Biography and current focus
- Resume timeline and print layout
- Contact methods

Media:

- Reusable image component
- Reusable video player/embed strategy
- Accessible captions and fallbacks

Exit condition: every component counted as complete contains a used, tested
implementation; unused placeholder files are removed or explicitly deferred.

## Milestone 5 — Design completion and Version 1.0 review

Status: **Not started**

- Homepage hierarchy and visual rhythm
- Editorial Journal archive presentation
- Curated Portfolio presentation
- Journal reading experience
- Project case-study experience
- Phone, tablet, laptop, and wide-screen review
- Keyboard and screen-reader review
- Color-contrast audit
- Broken-link and asset crawl
- Cross-browser smoke test

Exit condition: the site is visually complete with representative placeholder
content, and future content of the supported types does not require new layout
work.

## Milestone 6 — Real content

Status: **Not started**

- Replace all placeholder content
- Publish representative journal entries
- Publish software projects and case studies
- Publish photography collections
- Publish video and writing work
- Complete biography, resume, and contact information

Exit condition: every public section contains credible real content and no
placeholder copy or media remains.

## Milestone 7 — Launch quality

Status: **Not started**

- Metadata and canonical URLs
- Open Graph and social images
- Sitemap and robots.txt
- RSS
- Image optimization and lazy loading
- Accessibility QA
- Lighthouse and performance work
- Pagefind search
- Cloudflare Web Analytics
- Custom-domain launch checks

Exit condition: the site is accessible, discoverable, performant, measurable,
and ready for the AngrySquirrel.org production domain.

## Milestone 8 — Publishing workflow and integrations

Status: **Deferred**

- TinaCMS
- GitHub authentication for editing, if required by the selected Tina workflow
- Giscus comments
- Immich album integration
- Resume PDF generation from structured data
- Advanced related-content engine
- Series and reading progress

Exit condition: these tools improve publishing without taking ownership of the
Astro design, routing, layout, or component system.

## Immediate task source

`BUILD_ORDER.md` is the canonical ordered implementation list. `PROJECT_LOG.md`
records verified progress. `Audit.md` records the evidence behind the current
status. This roadmap defines milestones and should not be used as a substitute
for the concrete build order.