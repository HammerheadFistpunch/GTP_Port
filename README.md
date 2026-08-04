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
- a curated, Tina-controlled Portfolio bento grid
- editable Homepage preview headings that link to Portfolio and Journal
- native media, video, lightboxes, and shared Immich galleries
- structured Resume content
- guarded Flexible Pages with top-level and nested static routes
- reorderable Flexible Page blocks for Markdown text, images, YouTube, Immich
  galleries, child-page tiles, and calls to action
- responsive navigation, accessibility, and social metadata foundations

Sprint 1 and Sprint 2A are deployed and verified. Sprint 2B completes the
responsive media layer, adds keyboard-accessible Flexible Page image
lightboxes and resilient media fallbacks, and lets editors insert YouTube
videos directly inside Content Entry narratives. Content publishing can
continue in parallel while the hosted 2B workflow is reviewed.

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

Portfolio order and tile size are presentation metadata. Journal order remains
chronological by publication date.

## Content portability

Content Entry bodies remain semantic Markdown inside `.mdx` files. The only
approved custom body element is the constrained YouTube embed. Presentation
belongs in Astro components, while frontmatter should describe the content
rather than a specific visual layout.

See `CONTENT_PORTABILITY.md` for the short redesign and migration guide.
