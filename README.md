# GTP_Port

Astro source for AngrySquirrel.org: a dark, editorial-first personal website
combining long-form publishing with a professional portfolio of software,
photography, video, writing, engineering, and case-study work.

## Current status

The site is operational and ready for real content. It includes:

- a static Astro site deployed through Cloudflare Pages
- Git-backed Markdown and MDX content
- authenticated TinaCloud editing at `/admin/`
- one unified Content Entries collection with Portfolio and Journal placement
- neutral `/archive/[slug]/` detail pages shared by every entry type
- a curated, drag-reorderable Tina Portfolio tile board
- five Portfolio category routes for Video, Photography, Case Studies,
  Writing Samples, and Software Projects
- a compact Journal landing page with an explicit featured story, chronological
  feed, and four static section routes
- a controlled Tina tag registry with 29 static subject archives shared by
  Journal and Portfolio entries
- explicit Homepage Portfolio selections plus linked Portfolio and Journal headings
- native media, video, lightboxes, and shared Immich galleries
- structured Resume content
- guarded Flexible Pages with top-level and nested static routes
- reorderable Flexible Page blocks for Markdown text, images, YouTube, Immich
  galleries, child-page tiles, and calls to action
- responsive navigation, accessibility, and social metadata foundations

Sprints 1 through 4 are deployed and owner-verified visually. Sprint 5 adds the
controlled tag registry and subject archives; its local checks pass and its
Cloudflare/TinaCloud workflow awaits verification after push. Content
publishing can continue in parallel.

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

Portfolio and Homepage ordering now come from explicit Tina tile lists that
reference existing content without owning it. Numeric `portfolioOrder` remains
a migration fallback. Journal entries use one controlled primary section;
`/journal/` remains chronological and excludes its explicitly selected feature
from the remaining feed. Descriptive subjects come from referenced Tag
documents and publish separately at `/tags/[slug]/`.

## Content portability

Content Entry bodies remain semantic Markdown inside `.mdx` files. The only
approved custom body element is the constrained YouTube embed. Presentation
belongs in Astro components, while frontmatter should describe the content
rather than a specific visual layout.

See `CONTENT_PORTABILITY.md` for the short redesign and migration guide.
