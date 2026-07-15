# GTP_Port

Astro source for AngrySquirrel.org: a dark, editorial-first personal website
combining long-form publishing with a professional portfolio of software,
photography, video, writing, engineering, and case-study work.

## Current status

The site is operational and ready for real content. It includes:

- a static Astro site deployed through Cloudflare Pages
- Git-backed Markdown content
- authenticated TinaCloud editing at `/admin/`
- one unified Content Entries collection with Portfolio and Journal placement
- neutral `/archive/[slug]/` detail pages shared by every entry type
- a curated, Tina-controlled Portfolio bento grid
- editable Homepage preview headings that link to Portfolio and Journal
- native media, video, lightboxes, and shared Immich galleries
- structured Resume content
- responsive navigation, accessibility, and social metadata foundations

Real portfolio projects, Journal entries, biography, resume, and contact content
are now the active priority. Journal topic chips are currently display-only;
functional topic routes remain planned. Filters, print refinement, design
polish, and launch tooling are improvements rather than publishing blockers.

See `DOCUMENTATION.md` for the documentation index, `NEXT_STEPS.md` for the
active work queue, `Roadmap.md` for the broader sequence, and
`SITE_MAINTENANCE_GUIDE.md` for owner-directed code and Tina changes.

## Source of truth

- Repository branch: `gpt-handoff`
- Content: Markdown under `src/content/`
- Layout and presentation: Astro under `src/pages/`, `src/layouts/`,
  `src/components/`, and `src/styles/`
- CMS schema: `tina/config.ts`
- Astro content validation: `src/content.config.ts`

TinaCloud is an editing interface. GitHub Markdown remains the durable source
of truth.

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

Content Entry bodies should remain semantic Markdown. Presentation
belongs in Astro components, while frontmatter should describe the content
rather than a specific visual layout.

See `CONTENT_PORTABILITY.md` for the short redesign and migration guide.
