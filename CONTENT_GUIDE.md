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
- `portfolio.md` — Portfolio archive header, section title, and empty state
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

## Flexible Pages

`src/content/flexible-pages/` stores pages that do not need a hand-authored
Astro route. The Tina **Flexible Pages** collection can create and delete these
documents. A page's explicit **URL Path** controls its static URL:

```text
path: services
-> /services/

path: services/video-production
-> /services/video-production/
```

Use lowercase, kebab-case path segments without a leading slash. Draft pages
remain in Git but do not receive a public route. The build rejects malformed,
duplicate, and reserved paths before deployment.

### Flexible Page fields

- **Page Title** is the public heading and the fallback browser/SEO title.
- **URL Path** is the public route and may contain nested segments.
- **Page Description** is the visible introduction and fallback SEO
  description.
- **Eyebrow** is an optional short label above the page title.
- **Header Image** is an optional responsive image between the header and body.
- **Header Image Alt Text** describes a meaningful image; leave it blank only
  when the image is decorative.
- **Navigation Label** is an optional shorter breadcrumb label. The page title
  is the fallback.
- **Navigation Order** records sibling order for later generated menus. Lower
  numbers come first; the current flat primary navigation is unchanged.
- **Draft** removes the route at the next deployment while retaining the file.
- The SEO fields override the title, description, and social image only when
  populated.

Published nested pages automatically show breadcrumbs for each published
Flexible Page ancestor. If an ancestor path has no corresponding published
page, the child route still works and the missing ancestor is omitted from the
breadcrumb.

### Create and publish

1. Open **Flexible Pages** in Tina and choose **Create New**.
2. Enter the title, description, and a lowercase URL path without leading or
   trailing slashes.
3. Keep **Draft** enabled while editing. New pages default to draft.
4. Add optional presentation, navigation, and SEO fields, then save.
5. Clear **Draft** and save when ready to publish.
6. Wait for Cloudflare to deploy, then open the exact public path and refresh
   it directly.

For a nested page, use the complete path. For example,
`services/audio-production` publishes at `/services/audio-production/`.
Creating a nested page does not require a matching parent, but creating and
publishing the parent gives visitors a complete breadcrumb trail.

### Rename or move

Changing **Page Title** changes the heading but does not change the URL.
Changing **URL Path** renames or moves the public route on the next deployment.
Before saving a new path:

1. Check that it is not reserved and does not duplicate another Flexible Page.
2. Update links in parent pages, navigation settings, and other content.
3. Add a redirect before changing an established public URL; otherwise the old
   address will show the 404 page.
4. Keep the Markdown filename/folder aligned with the route when practical,
   but remember that `path`—not the filename—is the routing contract.

### Unpublish or delete

Enable **Draft** to temporarily remove a route while keeping its content.
Use Tina's document menu to delete a page permanently. Deleting a parent does
not delete its children; review and separately move, draft, or delete every
descendant. After the deployment, the removed route should show the site's 404
page rather than the Homepage.

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
- `src/content/flexible-pages`
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
