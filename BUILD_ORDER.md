BUILD_ORDER.md


# GTP_Port Build Order

Last audited: 2026-07-10

Audited branch: `master`

Audited commit: `865e5fc` (`updated markdowns`)

## Current phase

> **Functional Core Completion**

The deployment foundation and initial visual language are established, but the
site is not yet in a pure polish phase. Several routes, page templates, and
named components are empty or disconnected. The next work must complete the
functional content path before broader design refinement.

## Status summary

| Area | Status | Evidence |
| --- | --- | --- |
| Repository and deployment foundation | Complete | Astro project, GitHub repository, Cloudflare Pages history, and static build pipeline exist. |
| Global visual foundation | Partial | Color, type, spacing, radius, and shadow tokens exist; accessibility and responsive rules are incomplete. |
| Shared shell | Partial | `BaseLayout`, navigation, footer, hero, container, buttons, and section titles render. Metadata and navigation states are incomplete. |
| Homepage | Partial | A styled shell renders, but its data is hard-coded, all referenced placeholder images are missing, and three portfolio links lead to routes that do not exist. |
| Journal archive | Minimal | Reads the collection and prints title/description only. Entries are not linked. |
| Journal article route | Broken | Uses an undefined `slug`, generates a route conflict, and renders no page markup. |
| Portfolio archive | Minimal | Reads the collection and prints title/description only. Entries are not linked. |
| Portfolio project route | Broken | Uses an undefined `slug`, generates a route conflict, and renders no page markup. |
| Supporting pages | Placeholder | About, Resume, and Contact are zero-byte files and build as empty HTML. |
| Component library | Skeleton | Several working primitives exist, but 11 claimed components are zero-byte placeholders. |
| Content model | Minimal | Journal and project collections load one placeholder entry each; schemas do not yet support the planned editorial and project metadata. |
| Search, CMS, comments, analytics, Immich, RSS | Not started | No implementation or dependency is present. |

## What is safe to build on

- Static Astro architecture and Git-backed content direction
- `src/content.config.ts` with Astro glob loaders
- `src/content/journal/` and `src/content/projects/`
- `BaseLayout.astro` as the shared shell
- Global CSS split into variables, typography, utilities, and global rules
- Existing UI primitives: Navigation, Footer, Hero, Button, Container, SectionTitle
- Existing content cards: JournalCard, FeaturedArticle, PortfolioCard
- `/journal` and `/portfolio` as the public archive routes
- `projects` as the internal collection name and `/portfolio` as its public URL

## Next implementation batch

Complete these tasks in order. Do not begin broad visual polish until Tasks 1–7
meet their acceptance criteria.

### Task 1 — Repair content entry routing

Status: **Complete — 2026-07-10**

Files:

- `src/pages/journal/[...slug].astro`
- `src/pages/portfolio/[...slug].astro`

Work:

- Build route params from the Astro 7 content entry identifier rather than the
  undefined `entry.slug` value.
- Render the Markdown body inside a complete page shell.
- Remove the `/journal` and `/portfolio` route-conflict warnings.

Acceptance criteria:

- `/journal/test-post/` is generated and displays its Markdown body.
- `/portfolio/test-project/` is generated and displays its Markdown body.
- `npm run build` completes without dynamic-route conflict warnings.

Verification:

- Astro generated eight pages, including both expected detail routes.
- Both generated detail documents contain their titles, descriptions, and
  rendered Markdown bodies.
- The production build completed without warnings.

### Task 2 — Expand the content schemas

Status: **Complete — 2026-07-10**

Files:

- `src/content.config.ts`
- `src/content/journal/test-post.md`
- `src/content/projects/test-project.md`

Work:

- Add the shared fields needed by the actual layouts: description, publish
  date, category/type, tags, hero or cover image, featured state, and draft
  state where appropriate.
- Add project-specific fields for technologies, project type, links, and media.
- Keep optional fields optional until real content requires them.
- Update placeholder frontmatter so it validates the expanded schemas.

Acceptance criteria:

- Both collections validate during a production build.
- Archive, detail, and homepage views can be driven from collection data rather
  than separate hard-coded object shapes.

Verification:

- Journal entries now support category, tags, cover image, featured/draft
  state, publish date, and optional update date.
- Projects now support project type, tags, cover image, featured/draft state,
  date, technologies, external links, and typed media items.
- Both placeholder entries validate and all eight static pages still build
  without warnings.

### Task 3 — Implement the journal and portfolio layouts

Status: **Complete — 2026-07-10**

Files:

- `src/layouts/BlogLayout.astro` (rename to `JournalLayout.astro` while unused)
- `src/layouts/PortfolioLayout.astro`
- `src/components/journal/ArticleMeta.astro`
- `src/components/portfolio/ProjectMeta.astro`

Work:

- Create distinct editorial and project detail layouts on top of `BaseLayout`.
- Include title, description, metadata, hero/media region, content slot, and
  back/archive navigation.
- Use the existing reading-width and container primitives.

Acceptance criteria:

- Journal and project entries have visibly distinct, complete detail pages.
- Page titles and descriptions reach the document head.
- Markdown content uses the intended Newsreader editorial typography.

Verification:

- The empty legacy `BlogLayout.astro` was replaced by `JournalLayout.astro`.
- Journal detail pages use `ArticleMeta` for category, dates, and tags.
- Portfolio detail pages use `ProjectMeta` for project type, date,
  technologies, and tags.
- Both layouts support optional cover images; Portfolio also supports external
  project links.
- Generated detail pages contain unique titles, meta descriptions, metadata,
  distinct layouts, and rendered Markdown.
- All eight static pages build without warnings.

### Task 4 — Complete both archive pages

Status: **Complete — 2026-07-10**

Files:

- `src/pages/journal/index.astro`
- `src/pages/portfolio/index.astro`
- `src/components/journal/CategoryNav.astro`
- `src/components/journal/JournalCard.astro`
- `src/components/portfolio/PortfolioCard.astro`

Work:

- Add page titles to `BaseLayout` calls and remove nested `<main>` elements.
- Sort entries deterministically.
- Link every entry to its generated detail page.
- Use the existing cards and containers instead of raw article elements.
- Do not expose category links until a matching category route or filter exists.

Acceptance criteria:

- Both archives have non-empty document titles.
- Every displayed entry opens a working detail page.
- No archive link points to an unimplemented route.

Verification:

- Journal entries are filtered for published content and sorted with featured
  items first, then newest date.
- Portfolio projects are filtered for published content and sorted with
  featured items first, then date/title.
- Both archives use their existing card components and link to generated detail
  pages.
- Cards use styled local fallbacks when no cover image is supplied, avoiding
  broken placeholder assets.
- Journal topics are displayed without dead category URLs until filtering or
  category routes are implemented.
- Archive titles, meta descriptions, and link destinations were verified in the
  generated HTML; all eight pages build without warnings.

### Task 5 — Connect the homepage to real collections

Files:

- `src/pages/index.astro`
- `public/images/` or a deliberate image fallback component

Work:

- Replace hard-coded article/project preview data with collection queries.
- Define how featured items are selected.
- Remove or replace missing `/images/*-placeholder.jpg` references.
- Replace `/portfolio/software`, `/portfolio/photography`, and
  `/portfolio/video` links unless matching routes are implemented in the same
  change.

Acceptance criteria:

- Homepage previews come from Markdown collection entries.
- No homepage image request returns 404.
- No homepage CTA or card points to a missing route.

### Task 6 — Build the supporting page shells

Files:

- `src/pages/about.astro`
- `src/pages/resume.astro`
- `src/pages/contact.astro`
- `src/components/resume/Timeline.astro`

Work:

- Give each route a real `BaseLayout`, title, introduction, and minimum useful
  content structure.
- Implement the timeline only if the resume page uses it in this batch.
- Use direct contact methods first; defer a form until its delivery path is
  selected.

Acceptance criteria:

- All three routes build to non-empty HTML.
- Navigation never lands on a blank page.
- Resume markup has a print-friendly foundation.

### Task 7 — Complete shared navigation and document accessibility

Files:

- `src/layouts/BaseLayout.astro`
- `src/components/ui/Navigation.astro`
- `src/components/ui/Footer.astro`
- `src/components/ui/Button.astro`
- `src/styles/global.css`

Work:

- Add description metadata, favicon links, and a consistent title pattern.
- Add a skip link, visible focus states, current-page navigation state, and
  reduced-motion handling.
- Replace the wrapping mobile navigation with a deliberate small-screen
  treatment.
- Ensure anchors styled as buttons remain semantically appropriate.

Acceptance criteria:

- Keyboard users can reach and identify every navigation item.
- Current page state is communicated visually and semantically.
- The document has one main landmark and a useful title on every route.

### Task 8 — Verify the functional core

Work:

- Run `npm run build`.
- Confirm all expected output routes exist.
- Crawl built HTML for missing internal links and local assets.
- Check desktop and mobile layouts for the homepage, both archives, both detail
  templates, About, Resume, and Contact.
- Record results in `PROJECT_LOG.md` before moving to design polish.

Acceptance criteria:

- Build completes without warnings.
- Expected HTML files are non-empty.
- No known internal 404s or missing local images remain.

## Following milestone — Design system completion

After the functional core passes verification:

- Consolidate duplicated container/card rules.
- Finalize the type scale and self-host or deliberately retain web fonts.
- Standardize spacing, borders, radii, shadows, transitions, hover states, and
  focus states.
- Audit Navigation, Hero, homepage rhythm, cards, archives, and detail pages in
  that order.
- Complete responsive behavior at phone, tablet, laptop, and wide-screen sizes.
- Perform color-contrast and keyboard audits.

## Deferred until a real page needs them

These files are currently empty and should not be counted as completed. Build
them when their consuming page is scheduled:

- `RelatedArticles.astro`
- `RelatedProjects.astro`
- `Gallery.astro`
- `Lightbox.astro`
- `VideoEmbed.astro`
- `Image.astro`
- `VideoPlayer.astro`
- `SearchBox.astro`

## Later milestones

1. Populate real journal, software, photography, video, writing, and case-study content.
2. Add SEO, sitemap, RSS, image optimization, accessibility QA, performance QA,
   Pagefind, and Cloudflare Web Analytics.
3. Add TinaCMS only after schemas and Markdown workflows are stable.
4. Add Giscus, Immich integration, resume PDF generation, and related-content
   features after the core publishing path is proven.
