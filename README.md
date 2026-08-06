# GTP_Port

Astro source for AngrySquirrel.org: a dark, editorial-first personal website
combining long-form publishing with a professional portfolio of software,
photography, video, writing, engineering, and case-study work.

## Current status

The site is operational and ready for real content. It includes:

- a static Astro site deployed through Cloudflare Pages
- Git-backed Markdown and MDX content
- authenticated TinaCloud editing at `/admin/`
- one unified Journal Entries collection with Portfolio and Journal placement
- neutral `/archive/[slug]/` detail pages shared by every entry type
- a label-only Portfolio menu with direct Video, Photography, Projects, Case
  Studies/Research, and Writing destinations
- two surviving Portfolio Flexible Pages for Video and Photography, with
  Journal-backed destinations for the other work types
- a compact Journal landing page with an explicit featured story, chronological
  feed, and four static section routes
- a controlled Tina tag registry with 29 static subject archives shared by
  Journal and Portfolio entries
- a compact Homepage with side-by-side Hero and Journal panels, editable About,
  capabilities, technology, and compact Portfolio destination links
- Tina-controlled Homepage visibility, section order, copy, links, Journal
  feature, recent-story count, and Portfolio destination ordering
- native media, video, lightboxes, and shared Immich galleries
- structured Resume content
- guarded Flexible Pages with top-level and nested static routes
- reorderable Flexible Page blocks for Markdown text, images, YouTube, Immich
  galleries, child-page tiles, and calls to action
- Tina-controlled nested primary navigation with accessible desktop disclosure,
  mobile expansion, internal page references, and custom/external URLs

Sprints 1 through 6 are deployed and owner-accepted. Sprints 7 through 9 are
implemented, and Sprint 10's Tina navigation/schema cleanup passes local
schema, TypeScript, admin-bundle, content, and route validation. Hosted Tina,
redirect, and interaction verification remain tracked in `BUILD_ORDER.md`.
Deliberate publishing, Markdown-first authoring, media URLs, and the separate
Resume rebuild follow.

See `DOCUMENTATION.md` for the documentation index, `BUILD_ORDER.md` for the
active work queue, `Roadmap.md` for the full sprint sequence, and
`SITE_MAINTENANCE_GUIDE.md` for owner-directed code and Tina changes.

## Source of truth

- Repository branch: `gpt-handoff`
- Content: Markdown and MDX under `src/content/`
- Layout and presentation: Astro under `src/pages/`, `src/layouts/`,
  `src/components/`, and `src/styles/`
- CMS schema: `tina/config.ts`
- Astro content validation: `src/content.config.ts`

TinaCloud is an editing interface. GitHub Markdown/MDX remains the durable
source of truth.

## Editing workflow

### Hosted editing

```text
Open https://angrysquirrel.org/admin/
-> edit content in TinaCloud
-> save the entry
-> Tina commits the content change to gpt-handoff
-> Cloudflare Pages rebuilds
-> review the deployed page
```

### Local code or schema work

```text
Pull gpt-handoff
-> copy .env.example to .env and add the TinaCloud read-only token
-> npm install
-> npm run dev
-> make and review changes
-> npm run build
-> commit and push in VS Code
-> Cloudflare Pages rebuilds
```

Cloudflare Pages must define `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`, and
`GITHUB_BRANCH`. The token is secret and must never be committed.

## Verification

With TinaCloud credentials available:

```bash
npm run build
git diff --check
git status --short
```

For an Astro-only local check without TinaCloud credentials:

```bash
npm run build:astro
```

## Unified content workflow

All published articles, projects, galleries, and case studies live under
`src/content/entries/`. The `placement` control in Tina determines whether an
entry appears in Portfolio, Journal, or both. **Archive to Journal** removes an
entry from Portfolio without moving its Markdown file or changing its detail
URL.

Homepage Portfolio ordering comes from an explicit Tina destination list that
links to existing content without owning it. Journal entries use one controlled primary section;
`/journal/` remains chronological and excludes its explicitly selected feature
from the remaining feed. Descriptive subjects come from referenced Tag
documents and publish separately at `/tags/[slug]/`.

The Homepage has a separate drag-order list for its five major blocks. Each
block has an explicit visibility switch. Its Journal feature is selected in
Tina and falls back to the newest published Journal entry when the selection is
missing, drafted, or no longer Journal-placed; that feature is always excluded
from the compact recent-story list.

## Content portability

Content Entry bodies remain semantic Markdown inside `.mdx` files. The only
approved custom body element is the constrained YouTube embed. Presentation
belongs in Astro components, while frontmatter should describe the content
rather than a specific visual layout.

See `CONTENT_PORTABILITY.md` for the short redesign and migration guide.
