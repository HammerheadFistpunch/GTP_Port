# TinaCMS Field and Content-Model Audit

Last updated: 2026-08-06
Branch reviewed: `gpt-handoff`
Scope: Sprint 8A inventory only; no schema, content, or route changes

## Executive findings

The current editor has eight collections in this order:

1. Tags
2. Site Settings
3. Homepage
4. Archive Pages
5. Standard Pages
6. Resume
7. Flexible Pages
8. Content Entries

Media Manager is supplied by Tina rather than declared as a collection.

The editor is functional, but it exposes implementation history instead of the
smallest set of owner tasks. The largest sources of friction are:

- `Archive Pages` combines Journal settings with a Portfolio landing page that
  is scheduled for retirement.
- `Standard Pages` combines About and Contact even though they are distinct
  owner tasks.
- `Content Entries` exposes Portfolio placement and tile controls that will no
  longer be needed after Portfolio becomes a navigation group.
- Homepage Portfolio selection duplicates source title, description, image,
  emphasis, and tile sizing even though the requested replacement is a compact
  destination tile.
- `Homepage Section Order` is a string list with predefined options. Tina does
  not present it as the promised drag-and-drop block editor, so its description
  is misleading.
- Flexible Pages retain an unused future-menu order field and support both
  legacy body content and modular blocks, producing two authoring locations.
- Content Entries combine editorial metadata, legacy Portfolio metadata,
  galleries, media lists, links, and rich-text body editing in one long form.

No field should be deleted until the migration gate named below is complete.

## Disposition terms

| Disposition | Meaning |
| --- | --- |
| Keep | Active, understandable, and required by a current renderer or route. |
| Relabel | Active but described in implementation language or unclear owner language. |
| Consolidate | Active, but should move into a smaller grouped control or one editing location. |
| Migrate | Stored data must be copied or routes/references changed before removal. |
| Compatibility hold | Currently redundant but temporarily required to preserve a fallback or route. |
| Remove | No active consumer or approved future purpose remains. |
| Redesign | Retained goal, but the current model does not fit the approved workflow. |

## Collection-level target

| Current collection | Current documents | Finding | Target disposition |
| --- | --- | --- | --- |
| Tags | `src/content/tags/*.md` | Controlled references and stable tag URLs are active. Creating a tag in a separate collection before selecting it is clunky but protects routes. | Keep; relabel as `Journal Tags` and improve selection/creation during authoring work. |
| Site Settings | `src/content/settings/site.md` | All global identity, primary navigation, and footer values are rendered. | Keep as one fixed document; group identity, navigation, and footer. |
| Homepage | `src/content/pages/home.md` | Active, but Portfolio and ordering controls reflect the retiring design. | Keep as one fixed document; redesign ordering and Portfolio destinations. |
| Archive Pages | `journal.md`, `portfolio.md` | Journal fields are active. Portfolio fields and route exist only for the landing page being retired. | Split the owner-facing Journal settings from the temporary Portfolio compatibility document. |
| Standard Pages | `about.md`, `contact.md` | Both documents render, but the combined collection adds an unnecessary choice layer. | Expose About and Contact as separate fixed documents if Tina supports the desired sidebar cleanly; otherwise relabel `About & Contact`. |
| Resume | `resume.md` | Active and intentionally reserved for Sprint 13. | Keep isolated; make no structural changes before the Resume review. |
| Flexible Pages | `src/content/flexible-pages/**/*.md` | Required for Video, Photography, and owner-created pages. Several old Portfolio category and test pages remain. | Keep; migrate/retire Case Studies, Writing, and Software category pages after their Journal destinations exist. Review test Services pages with the owner. |
| Content Entries | `src/content/entries/*.mdx` | Canonical body content and `/archive/` routes are active. Form is overlong and Portfolio-centric fields are transitional. | Keep as `Journal Content`; simplify metadata and replace rich-text body with the approved Markdown-first workflow after feasibility proof. |

## Site Settings field map

| Tina control | Stored field | Active consumer | Disposition |
| --- | --- | --- | --- |
| Site Name | `siteName` | `BaseLayout` metadata/title fallback | Keep. |
| Logo Text | `logoText` | `Navigation` brand label | Keep. |
| Site Description | `siteDescription` | Global metadata fallback | Keep. |
| Footer Title | `footerTitle` | `Footer` | Keep. |
| Footer Description | `footerDescription` | `Footer` | Keep. |
| Copyright Name | `copyrightName` | `Footer` | Keep. |
| Main Navigation | `navigation[]` | `Navigation`; supports internal references, direct URLs, and child links | Keep; relabel internal/custom destination choices and migrate Portfolio parent away from `/portfolio/`. |
| Navigation label | `navigation[].label` | Visible menu text | Keep. |
| Internal Page | `navigation[].page` and child equivalent | Navigation destination resolver | Keep. |
| Custom or External URL | `navigation[].href` and child equivalent | Navigation destination resolver | Keep; relabel `Route or external URL`. |
| Child Links | `navigation[].children[]` | Desktop and mobile submenu | Keep; this is the future Portfolio destination group. |
| Footer Links | `footerLinks[]` | `Footer` | Keep; migrate the Portfolio URL before route retirement. |

## Homepage field map

| Tina control | Active consumer | Disposition and gate |
| --- | --- | --- |
| Page Type | Astro discriminated schema only | Hide or remove from the editor after fixed-document loading is proven without it; compatibility hold. |
| SEO Description | Homepage `BaseLayout` description | Keep; relabel `Search description`. |
| Homepage Section Order | `index.astro` section sequence | Redesign. Current option-list control does not fulfill the drag instruction. Use a true ordered object list/custom control, or approve fixed order and remove the control. |
| Hero: visible, eyebrow, headline, description, image | Homepage intro | Keep; image needs the shared upload-or-URL model in Sprint 12. |
| Hero primary/secondary button label and link | Homepage buttons | Keep; relabel links as routes/URLs. Migrate `/portfolio/` primary CTA. |
| Featured Portfolio: visible | Homepage Portfolio section | Compatibility hold while currently hidden; replace with `Portfolio destinations` visibility if the compact section remains. |
| Featured Portfolio: title, title link, subtitle | Homepage Portfolio heading | Redesign for compact destinations; migrate the title link away from `/portfolio/`. |
| Featured Portfolio: legacy limit, empty message | Automatic fallback when no curated tiles exist | Remove after the fallback and old section are retired. |
| Portfolio Tiles: source | `resolvePortfolioTiles` | Migrate selected destinations into the compact destination model. |
| Portfolio Tiles: size, emphasis, title/description/image overrides | Homepage bento rendering | Remove after compact destination tiles ship; these are the main cause of information-heavy cards. |
| Journal Preview: visible, title, title link, subtitle | Homepage Journal panel | Keep. |
| Journal Preview: featured story | Chooses the large story | Keep. |
| Journal Preview: recent count, empty message | Recent list and empty state | Keep; place under an `Advanced display` group if supported. |
| About Me: visible, eyebrow, title, description, link | Homepage About section | Keep. |
| What I Do: visible, eyebrow, title, description, capabilities, link | Homepage capabilities section | Keep; migrate the current Portfolio section link. |
| Capability item: title, description, optional link | Capability cards | Keep. |
| Technology Stack: visible, eyebrow, title, description, tools, link | Homepage technology section | Keep; migrate the current Software Flexible Page link. |

## Journal and retired Portfolio archive field map

The shared `Archive Pages` schema makes controls visible for both documents even
when only one document uses them. This is a primary source of weird fields.

| Tina control | Journal consumer | Portfolio consumer | Disposition |
| --- | --- | --- | --- |
| Page Type | Astro schema | Astro schema | Compatibility hold; hide if possible. |
| Page title, eyebrow, headline, description, header style | Journal landing | Portfolio landing | Keep for Journal; remove with `portfolio.md` after route retirement. |
| Content Section Title, empty-state message | Journal landing | Portfolio landing | Keep for Journal; remove Portfolio copy with its route. |
| Legacy Topic List | None; controlled sections come from `journal-sections.ts` | None | Remove in Sprint 10 after confirming no Tina content dependency. |
| Featured Journal Story | Journal landing | Stored but not rendered on Portfolio | Keep only on Journal; remove from Portfolio document during migration. |
| Portfolio Tile Packing | None | Portfolio grid flow | Compatibility hold through Sprint 9, then remove. |
| Portfolio Tiles and all nested overrides | None | Portfolio bento grid | Migrate direct destinations first, then remove with landing route. |

## About, Contact, and Resume field map

| Area | Tina controls | Active consumer | Disposition |
| --- | --- | --- | --- |
| About | Page Type | Astro schema | Compatibility hold; hide if possible. |
| About | title, eyebrow, headline, description, header style | `StandardPageLayout` | Keep. |
| About | page links | `StandardPageLayout` | Keep. |
| About | page content/body | Rendered Markdown body | Keep until the Markdown-first editor decision is applied consistently. |
| Contact | Page Type | Astro schema | Compatibility hold; hide if possible. |
| Contact | title, eyebrow, headline, description, header style | `StandardPageLayout` | Keep. |
| Contact | page links | `ContactMethods`; deliberately removed from generic layout to avoid duplicates | Keep; relabel `Contact methods`. |
| Contact | page content/body | Rendered below contact methods | Keep. |
| Resume | title, eyebrow, headline, description, header style, links | Resume page/layout | Keep pending Sprint 13. |
| Resume | professional summary, competencies, experience, education, additional body | Resume components and body renderer | Redesign only in Sprint 13; no Sprint 10 removal. |

## Flexible Pages field map

| Tina control | Active consumer | Disposition |
| --- | --- | --- |
| Page title, URL path, description | Dynamic route and page layout | Keep. Path changes need redirect guidance. |
| Eyebrow | Page layout | Keep. |
| Header image and alt text | Page layout | Keep; convert image to upload-or-URL model. |
| Navigation label | Breadcrumbs and child-page tiles | Keep; relabel `Short navigation title`. |
| Navigation order | No current renderer sorts on this field | Remove unless Sprint 8B approves auto-generated menus. |
| Draft | Route generation | Keep. |
| SEO title, description, sharing image | Page metadata | Keep; group under `Search and sharing`; sharing image needs upload-or-URL model. |
| Page Blocks | Block renderer | Keep for Video, Photography, and new flexible pages. |
| Legacy Page Content/body | Renders after Page Blocks | Consolidate. Preserve existing body content, but choose one clearly labeled primary authoring path for new pages. |

### Flexible Page block controls

| Block | Visible controls | Disposition |
| --- | --- | --- |
| Rich Text | optional heading, Markdown textarea | Keep; candidate for the common Markdown editor/preview control. |
| Image | optional heading, image, alt, caption | Keep; convert image to upload-or-direct-URL. |
| YouTube | optional heading, URL, accessible title, caption | Keep. |
| Immich Gallery | heading, public share URL, alt prefix | Keep; this embeds an album, not an individual image URL. |
| Child Page Tiles | heading, introduction, page paths | Keep only if owner-created hierarchies remain valuable; replace raw path entry with references if feasible. |
| Call to Action | heading, text, button label/link/style | Keep. |

### Flexible Page documents requiring a decision

| Document/path | Current role | Proposed action |
| --- | --- | --- |
| `portfolio/video.md` | Approved direct Portfolio destination | Keep. |
| `portfolio/photography.md` | Approved direct Portfolio destination | Keep. |
| `portfolio/software-projects.md` | Old category destination | Migrate links to an approved Journal section/tag archive, then retire with redirect. |
| `portfolio/case-studies.md` | Old category destination | Migrate links to an approved Journal section/tag archive, then retire with redirect. |
| `portfolio/writing-samples.md` | Old category destination | Migrate links to an approved Journal feed/tag archive, then retire with redirect. |
| `services.md`, `services/video-production.md` and nested test pages | Foundation proof content, not part of the approved public IA | Retire after reference checks, redirecting to the closest surviving destination. |

## Content Entries field map

| Tina control | Active consumer | Disposition |
| --- | --- | --- |
| Title, description | Cards, metadata, entry layout, related content | Keep. |
| Entry Type | Entry layout styling/meta and related scoring | Keep; relabel `Content type`. |
| Placement | Journal/Portfolio filtering and back links | Redesign. After Portfolio landing removal, use a simpler publish/visibility model and derive Portfolio destinations from taxonomy. Compatibility hold through Sprint 9. |
| Publication Date | Journal chronology and entry metadata | Keep; require for published Journal content after migration. |
| Updated Date | Entry metadata | Keep; group as optional. |
| Primary Topic | Entry metadata and related-content score | Consolidate with the taxonomy model; free text overlaps Journal section and tags. Do not remove until a replacement for display/related scoring is chosen. |
| Primary Journal Section | Journal section routes and labels | Keep. |
| Tags | Tag archives, entry links, related scoring | Keep; redesign selector to reduce friction. |
| Cover Image | Cards, homepage, entry hero, metadata | Keep; convert to upload-or-direct-URL. |
| Featured Entry | Homepage/Portfolio automatic fallback sorting | Compatibility hold. Remove or redefine after old Portfolio fallback is gone and featured Journal selection remains explicit. |
| Draft | All public collection and route filters | Keep. |
| Portfolio Order, Portfolio Tile Size | Portfolio/Homepage automatic fallbacks | Remove after Sprint 9 eliminates those fallbacks. |
| Technologies | Project metadata | Keep for Project/Case Study content; conditionally show if Tina supports it cleanly. |
| Entry Links | Entry layout calls to action | Keep; group as optional links. |
| Immich Gallery | Entry live gallery | Keep. This is separate from direct image URL support. |
| Entry Media | Post-body image gallery and video list | Keep for existing content; reassess after Markdown inline media and preview work. `src` already accepts direct URLs because it is a string field. |
| Entry Content/body | Canonical MDX body and inline YouTube template | Redesign as plain Markdown with live preview; preserve MDX compatibility and the YouTube template as an optional follow-up. |

## Stored-data findings

- Ten unified entries exist: seven Journal articles, two Portfolio case studies,
  and one Portfolio gallery.
- The Portfolio case studies have no Journal section because they are currently
  `portfolio` placement. Migrate them to the existing Projects section without
  changing their `/archive/` detail URLs.
- The Photography gallery entry duplicates the purpose of the approved
  Photography Flexible Page. It should not be deleted until the public page and
  desired gallery presentation are compared.
- `Test-content.mdx` is published because omitted `draft` defaults to `false`.
  Retire it after checking for inbound repository references.
- Homepage Featured Portfolio is currently hidden, but its four curated tiles
  and `/portfolio/` links remain stored.
- Homepage Hero, What I Do, Technology Stack, main navigation, and footer all
  still link to Portfolio routes scheduled for migration.
- Journal `topics` are stored but ignored; the visible Journal sections are
  hard-coded in `src/lib/journal-sections.ts`.
- Flexible Page `navigationOrder` is stored but ignored by current navigation,
  breadcrumbs, and child-page blocks.
- The Tina-generated client helper in `src/lib/tina/data.ts` still queries a
  legacy `post` collection that is not present in the active schema and has no
  imports. Remove it with generated-code cleanup after confirming Tina does not
  regenerate or require it.

## Required migration gates

1. Use the existing Projects section for Software/Ideation and Case
   Studies/Research. Use the complete Journal feed for Writing; do not create
   new tags solely for Portfolio navigation.
2. Decide whether Portfolio should remain a non-clicking top-level navigation
   label or link to its first child. The approved requirement is no landing page.
3. Define redirect targets for `/portfolio/`, `/portfolio/software-projects/`,
   `/portfolio/case-studies/`, and `/portfolio/writing-samples/`.
4. Retire Services proof pages and the published Test entry after reference and
   redirect checks.
5. Implement a true drag-and-drop Homepage ordering control with keyboard move
   controls.
6. Prove the Markdown editor/preview approach without corrupting existing MDX.
7. Prove the authenticated publish architecture without embedding a GitHub or
   Cloudflare secret in the browser.

## Approved Sprint 8B decision set

- Use the existing Projects section for Software/Ideation and Case
  Studies/Research, and the complete Journal feed for Writing.
- Keep Portfolio as a submenu label with no clickable landing destination if
  the navigation component can do so accessibly; otherwise use Video as the
  parent fallback.
- Redirect `/portfolio/` to `/` or the first Portfolio child; redirect retired
  category pages to their new tag archives.
- Keep Homepage ordering editable through real drag-and-drop plus accessible
  keyboard move controls.
- Keep the Media Manager for repository uploads and add a shared image-source
  control for either a managed image or a validated public URL.

These owner decisions, together with `TINA_FEASIBILITY.md`, close Sprint 8 and
authorize the schema-safe Sprint 9 implementation chunks.
