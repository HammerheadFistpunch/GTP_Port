PROJECT_LOG.md


# GTP_Port Project Log

## 2026-07-10 — Site-wide content moved out of templates

Changed:

- Added a `settings` content collection and
  `src/content/settings/site.md` for site identity, navigation, footer copy,
  footer links, and default metadata.
- Expanded the `pages` collection with explicit Home, archive, and standard
  page models.
- Moved Home, Journal, Corpus, About, Resume, and Contact copy into managed
  Markdown entries under `src/content/pages/`.
- Replaced hard-coded homepage project and Journal arrays with live collection
  queries.
- Added featured-first sorting, managed preview limits, managed empty states,
  and safe optional-image fallbacks.
- Added `StandardPageLayout.astro` so supporting pages share Astro-owned layout
  while their headers, links, and body copy remain editable.
- Updated Navigation, Footer, BaseLayout, Hero, and FeaturedArticle to consume
  managed data instead of embedding site copy.
- Added `CONTENT_GUIDE.md` to document the future TinaCMS collection mapping and
  the boundary between editable content and application code.

Verified:

- All content schemas synchronized successfully.
- `npm run build` generated all eight expected pages without warnings.
- Home, About, Resume, Contact, Journal, and Corpus output files are non-empty.
- Every generated internal page link resolves to a generated destination.
- The homepage contains no missing placeholder-image references.
- Site identity and major page copy no longer appear as hard-coded strings in
  Astro templates.

Content now managed outside Astro templates:

- Site name, logo, default description, navigation, footer, and copyright
- Homepage hero, calls to action, section copy, preview limits, and About callout
- Journal and Corpus archive headers, section labels, topics, and empty states
- About, Resume, and Contact headers, links, and Markdown bodies
- Journal entries and Portfolio projects

Astro still owns:

- Routes and content queries
- Layout and responsive behavior
- Components and interaction patterns
- Typography, spacing, colors, and visual variants

TinaCMS status:

- The content is organized and schema-validated for Tina collection mapping.
- Tina installation, editing UI, and GitHub authentication remain a separate
  integration step.

## 2026-07-10 — Journal archive header moved to managed content

Changed:

- Added a `pages` content collection for editable landing-page copy and simple
  presentation choices.
- Added `src/content/pages/journal.md` as the source of truth for the Journal
  page title, eyebrow, headline, description, header style, and topic list.
- Updated the Journal archive to load this content instead of hardcoding it in
  the Astro page.
- Added `compact` and `featured` header variants while keeping layout and
  responsive styling under Astro's control.
- Set the Journal archive to the compact variant by default.
- Updated `CategoryNav.astro` to accept the managed topic list as a prop.

Result:

- TinaCMS can manage the Journal landing-page fields after its collection is
  connected to `src/content/pages/*.md`.
- Editors can choose a compact or featured header without directly editing
  Astro or CSS.
- The layout, spacing, typography, and responsive behavior remain reusable
  application code rather than CMS-owned markup.

## 2026-07-10 — Task 4: collection archives completed

Changed:

- Rebuilt the Journal archive as an editorial landing page with a useful title,
  description, topic list, and linked Journal cards.
- Rebuilt the Corpus archive as a portfolio landing page with a useful title,
  description, responsive project grid, and linked Portfolio cards.
- Added deterministic published-content sorting to both collections.
- Updated JournalCard and PortfolioCard to support optional images and styled
  no-image fallbacks.
- Replaced the unimplemented Journal category links with non-clickable topic
  labels until a real filter or category route exists.
- Removed nested main landmarks from both archive pages.

Verified:

- Journal output has the title `Journal | AngrySquirrel.org` and links to
  `/journal/test-post/`.
- Portfolio output has the title `Corpus | AngrySquirrel.org` and links to
  `/portfolio/test-project/`.
- Both destination HTML files exist and are non-empty.
- Neither archive references missing placeholder images.
- The Journal archive contains no `/journal/category/` links.
- `npm run build` generated all eight expected pages without warnings.

Next:

- Task 5 — replace the homepage's hard-coded preview arrays and missing image
  references with featured collection entries and verified destinations.

## 2026-07-10 — Task 3: detail layouts implemented

Changed:

- Replaced the empty legacy `BlogLayout.astro` with the correctly named
  `JournalLayout.astro`.
- Implemented `JournalLayout.astro` with article metadata, editorial header,
  optional cover image, reading-width content, and Journal return navigation.
- Implemented `PortfolioLayout.astro` with project metadata, a visually distinct
  project header, optional cover image, external project links, and content.
- Implemented `ArticleMeta.astro` for category, published/updated dates, and
  tags.
- Implemented `ProjectMeta.astro` for project type, year, technologies, and
  tags.
- Added optional description metadata support to `BaseLayout.astro`.
- Simplified both dynamic route files so they load/render content and delegate
  presentation to the reusable layouts.

Verified:

- Journal and Portfolio detail pages have separate visual treatments.
- Both generated documents contain unique titles and meta descriptions.
- Journal metadata renders the Projects category, publication date, Astro tag,
  and Build Log tag.
- Portfolio metadata renders the Software project type and Astro technology.
- Both Markdown bodies still render correctly.
- `npm run build` generated all eight expected pages without warnings.

Next:

- Task 4 — turn the minimal Journal and Portfolio archives into complete,
  collection-driven card layouts that link to the verified detail routes.

## 2026-07-10 — Task 2: content schemas expanded

Changed:

- Moved the Zod import to the Astro 7 `astro/zod` entrypoint.
- Added shared title, description, tags, cover image, featured, and draft fields.
- Added Journal publish date, optional update date, and controlled category
  fields.
- Added Portfolio project type, optional date, technologies, link fields, and
  typed image/video media entries.
- Updated both placeholder Markdown files with valid representative
  frontmatter.

Verified:

- Content synchronization detected and rebuilt the updated schemas.
- Both placeholder entries passed schema validation.
- `npm run build` completed successfully without warnings.
- All eight expected static pages, including the Journal and Portfolio detail
  pages, were generated.

Next:

- Task 3 — implement dedicated Journal and Portfolio layouts plus their
  metadata components, then move the temporary detail-page presentation into
  those reusable layouts.

## 2026-07-10 — Task 1: content detail routing repaired

Changed:

- Updated `src/pages/journal/[...slug].astro` to build routes from the Astro 7
  content entry `id`.
- Updated `src/pages/portfolio/[...slug].astro` to build routes from the Astro 7
  content entry `id`.
- Replaced the removed entry instance rendering API with
  `render(entry)` from `astro:content`.
- Added complete `BaseLayout` page shells for both detail routes.
- Added page titles, headings, descriptions, Journal date metadata, archive
  return links, and rendered Markdown content.

Verified:

- `npm run build` completed successfully without warnings.
- Astro generated eight pages instead of six.
- `/journal/test-post/` generated as non-empty HTML and contains the Journal
  title, date, description, and Markdown body.
- `/portfolio/test-project/` generated as non-empty HTML and contains the
  project title, description, and Markdown body.
- The previous `/journal` and `/portfolio` route-conflict warnings are resolved.

Next:

- Task 2 — expand the Journal and Projects content schemas and update the two
  placeholder entries to validate the new frontmatter model.

## 2026-07-10 — Repository audit and plan correction

Audit scope:

- Repository: `HammerheadFistpunch/GTP_Port`
- Branch: `master`
- Commit: `865e5fc` (`updated markdowns`)
- Compared the repository against `BUILD_ORDER.md`, `Roadmap.md`,
  `PROJECT_LOG.md`, `README.md`, and `Audit.md`.
- Inspected every tracked source, component, layout, page, style, content, and
  configuration file.
- Installed locked dependencies in an isolated workspace and ran the Astro
  production build.
- No application code, styles, content, configuration, or dependencies were
  changed during this audit.

### Verified working

- Astro 7.0.7 installs from the committed lockfile.
- Static output mode is active.
- Production build completes successfully.
- Six top-level pages are emitted: Home, Journal, Portfolio, About, Resume, and
  Contact.
- Journal and project collections load one Markdown placeholder each.
- The homepage renders a styled hero, featured-work section, journal preview,
  about callout, navigation, and footer.
- The shared dark palette, Lato/Newsreader type direction, spacing tokens,
  container primitives, cards, and basic responsive grids are present.

### Build result

Command:

```text
npm run build
```

Result:

- Build succeeded.
- Astro emitted warnings because the journal and project detail routes both
  resolve their placeholder entry to the parent archive path.
- Six pages were generated; no journal article or portfolio project detail page
  was generated.
- About, Resume, and Contact built as zero-byte HTML files.
- Journal and Portfolio archive pages built with empty `<title>` elements.

### Corrected implementation status

#### Complete

- Git repository and default branch
- Astro project foundation
- Static build configuration
- Cloudflare Pages deployment history and automatic deployment workflow
- Root content configuration using Astro glob loaders
- Global stylesheet organization
- Base color and typography direction

#### Implemented but incomplete

- `BaseLayout.astro`
- Navigation and footer
- Hero, Button, Container, and SectionTitle
- JournalCard and FeaturedArticle
- PortfolioCard
- Homepage shell
- Journal and Portfolio archive shells
- Journal and Projects collection schemas

#### Broken or disconnected

- Dynamic journal route
- Dynamic portfolio route
- Markdown body rendering on detail pages
- Archive-to-detail links
- Homepage-to-collection data flow
- Homepage placeholder image assets
- Homepage category portfolio routes
- Category navigation routes

#### Empty placeholders

Seventeen tracked source files contain no implementation:

- 11 components: ArticleMeta, RelatedArticles, Image, VideoPlayer, Gallery,
  Lightbox, ProjectMeta, RelatedProjects, VideoEmbed, Timeline, SearchBox
- 3 layouts: BlogLayout, PortfolioLayout, `layouts/[...slug].astro`
- 3 pages: About, Resume, Contact

### Planning discrepancies found

- The previous documents described the architecture as structurally complete;
  detail routing and rendering are not operational.
- The previous documents described the component library as mostly complete or
  mature; nearly half of the named components are empty files.
- The previous documents marked archive and project/article pages complete;
  archives are minimal unlinked lists and detail pages are not generated.
- The previous documents placed the project in a polish-only phase; functional
  page and content work remains.
- `README.md`, `BUILD_ORDER.md`, `Roadmap.md`, and `Audit.md` used conflicting
  phase definitions and completion claims.

### Current focus

The project is now correctly classified as **Functional Core Completion**.

The next implementation cycle is defined in `BUILD_ORDER.md` and begins with:

1. Repair content detail routing and Markdown rendering.
2. Expand the Journal and Projects schemas.
3. Implement Journal and Portfolio detail layouts.
4. Complete and link both archive pages.
5. Connect the homepage to collection data and valid assets/routes.
6. Build non-empty About, Resume, and Contact pages.
7. Complete shared document and navigation accessibility.
8. Verify the full static route set before design polish.

### Decision log

- Keep Astro static-first.
- Keep Git-backed Markdown content.
- Keep `journal` and `projects` as the collection names.
- Keep `/journal` and `/portfolio` as the public route names.
- Keep the current source folder organization.
- Keep CMS concerns out of layout and component architecture.
- Defer TinaCMS, Giscus, Immich, Pagefind, and advanced features until the core
  Markdown publishing path works end to end.
- Do not count an empty file as an implemented component, layout, or page.

### Next milestone exit condition

The project may move into design-system completion when:

- Journal and project detail pages generate and render Markdown.
- Both archives link to working detail pages.
- Homepage previews are collection-driven and contain no broken local assets or
  links.
- About, Resume, and Contact are non-empty.
- The production build completes without warnings.
