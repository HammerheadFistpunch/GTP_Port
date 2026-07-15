# Editable Content Guide

The site separates editable information from Astro layout and behavior.

## Global settings

`src/content/settings/site.md`

Controls:

- Site name and logo text
- Default site description
- Primary navigation labels and destinations
- Footer title and description
- Footer navigation
- Copyright name

## Landing and supporting pages

`src/content/pages/`

- `home.md` — hero, calls to action, linked section headings, preview limits,
  and About callout
- `journal.md` — Journal archive header, topics, section title, and empty state
- `portfolio.md` — Corpus archive header, section title, and empty state
- `about.md` — About header and Markdown body
- `resume.md` — Resume header, links, and Markdown body
- `contact.md` — Contact header, links, and Markdown body

Page headers support two predefined styles:

- `compact`
- `featured`

The CMS may select a variant, but Astro owns the actual typography, spacing,
responsiveness, and component structure.

### Homepage preview links

The Homepage **Featured Work Section** and **Journal Preview Section** each
include a **Section Title Link** field in Tina. The current destinations are
`/portfolio` and `/journal`. These fields control the linked section headings;
individual preview cards continue to link directly to their Content Entries.

The topic list in `journal.md` currently controls visible topic chips only.
Those chips are not yet filters or links. The planned topic-route work should
derive navigation from published Content Entry `primaryTopic` values to avoid
maintaining two conflicting topic lists.

## Published content

`src/content/entries/*.md` is the single source for articles, projects,
galleries, case studies, and other published work.

The Tina **Placement** control determines where an entry appears:

- **Portfolio only** — persistent curated work
- **Portfolio + Journal** — visible in both presentations
- **Archive to Journal** — removed from Portfolio and retained chronologically

Archiving changes metadata rather than moving or converting the Markdown file.
Every entry keeps the same `/archive/[slug]/` detail URL.

Portfolio order is controlled by `portfolioOrder`, and `tileSize` accepts
Standard, Wide, Tall, or Large. Journal order uses `date`.

### Publishing conventions

- Use lowercase, kebab-case filenames and avoid renaming published entries
  without adding a redirect.
- Keep article and project narratives in semantic Markdown.
- Use frontmatter for facts about the entry, not for font, color, spacing, or
  other presentation instructions.
- Use relative local paths such as `/uploads/example.jpg`; never publish a
  `localhost` media URL.
- Give meaningful images useful alt text.
- Keep critical cover and narrative images in the repository even when an
  expanded Immich gallery is also present.
- Use `draft: true` until the deployed entry has been reviewed.

### Immich galleries

Content Entries include an optional **Immich Gallery**
group. Paste a non-password-protected public link from
`https://share.angrysquirrel.org`, then set the visible gallery title and a
short image-description prefix. Journal galleries appear after the article;
inline images remain available for narrative placement within the story.

The gallery reads the current public album when a visitor opens the page, so
adding or removing Immich photos does not require a site rebuild. If the share
server is unavailable, the project displays a direct link to the public album.
Revoking the Immich public link also removes the gallery's access.

## TinaCMS connection

TinaCMS and TinaCloud map their collections to:

- `src/content/settings`
- `src/content/pages`
- `src/content/entries`

Tina should edit these content files. Astro should continue to own files under
`src/pages`, `src/layouts`, `src/components`, and `src/styles`.

Schema changes must remain aligned across:

- `tina/config.ts` - fields exposed in Tina
- `src/content.config.ts` - fields accepted and validated by Astro
- the relevant Markdown frontmatter - stored values
- the page, layout, or component that renders the values

Regenerate `tina/tina-lock.json` after Tina schema changes; do not edit the
lock file manually.

## Redesign and migration safety

Use structured editable sections for the small number of landing pages. Keep
Journal and Portfolio bodies as ordinary Markdown and introduce custom body
blocks only when Markdown cannot express the content.

This preserves the ability to restyle the site by replacing Astro components
and to migrate the content to another Markdown-capable system without rewriting
each entry. See `CONTENT_PORTABILITY.md` for the concise policy.
