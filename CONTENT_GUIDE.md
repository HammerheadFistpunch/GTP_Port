# Editable Content Guide

The site separates editable information from Astro layout and behavior.

## Global settings

`src/content/settings/site.md`

Controls:

- Site name and logo text
- Default site description
- Primary navigation labels and destinations
- Optional primary-navigation child links and their order
- Footer title and description
- Footer navigation
- Copyright name

## Landing and supporting pages

`src/content/pages/`

- `home.md` — Homepage section order; Hero; Journal feature and recent count;
  About Me; What I Do; Technology Stack; and Portfolio destination links
- `journal.md` — Journal archive header, explicit featured story, section title,
  and empty state
- `about.md` — About header and Markdown body
- `resume.md` — Resume header, links, and Markdown body
- `contact.md` — Contact header, links, and Markdown body

Page headers support two predefined styles:

- `compact`
- `featured`

The CMS may select a variant, but Astro owns the actual typography, spacing,
responsiveness, and component structure.

### Homepage sections and selections

The Tina **Main Homepage** page contains one drag-reorderable **Homepage
Section Order** list. Use each option once. Removing or duplicating an option
does not delete content; Astro normalizes the list and restores omitted blocks.
Use each section's **Show** switch to hide it intentionally.

The **Hero + Journal** item is one responsive top block. Hero and Journal have
independent visibility controls; when both are visible they sit side by side on
desktop and stack Hero-first on mobile. The Journal feature is an explicit
Journal Entry reference. A missing, drafted, or non-Journal selection falls
back to the newest published Journal entry, and the feature is excluded from
the configured recent-story count.

The Homepage **Portfolio Links Section** contains compact direct links for
Video, Photography, Software/Ideation, Case Studies/Research, and Writing.
Each item stores a label, URL, and optional image. Drag the list to reorder it;
removing a Homepage item never deletes its destination.

Section titles, descriptions, links, capability items, technology items,
visibility, Portfolio destinations, and Journal selections are editable in Tina.
The expanded `/about/` page remains separate and is linked from the Homepage
and footer rather than the primary header.

Journal navigation uses the controlled Automotive, Projects, Field Notes, and
Off-topic section registry. Latest links to the complete `/journal/` feed and
is not assignable to an entry.

## Tina navigation

- **Settings** → Site Settings and Tags
- **Pages** → Main Homepage, Journal Homepage, About, Contact, Resume, and New
  Pages
- **Content** → Journal Entries
- **Site** → Media Manager

The grouped links are the only owner-facing entry points. Tina's underlying
collection names remain stable so existing references and generated queries do
not need a content migration.

## Flexible Pages

`src/content/flexible-pages/` stores pages that do not need a hand-authored
Astro route. The Tina **New Pages** collection can create and delete these
documents. A page's explicit **URL Path** controls its static URL:

```text
path: resources
-> /resources/

path: resources/video-production
-> /resources/video-production/
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
- **Draft** removes the route at the next deployment while retaining the file.
- The SEO fields override the title, description, and social image only when
  populated.

### Flexible Page blocks

The **Page Blocks** list is the modular page-builder area. Add a block with the
plus control, open it to edit its fields, and drag the list handle to change
the public order. Existing **Legacy Page Content** remains supported and always
renders after the ordered blocks.

Available blocks:

| Block | Stored content |
| --- | --- |
| Rich Text | Optional heading plus portable Markdown text |
| Image | Optional heading, repository image path, alt text, and caption |
| YouTube Video | Optional heading, YouTube URL, accessible title, and caption |
| Immich Gallery | Heading, public share URL, and image-alt prefix |
| Child Page Tiles | Heading, introduction, and an ordered list of Flexible Page paths |
| Call to Action | Heading, supporting text, button label/link, and button style |

Child-page paths use the same format as the page's **URL Path**, without a
leading slash. Drafted, deleted, missing, or mistyped page paths are omitted
from the public tile list. The paths inside the block determine tile order
independently of the explicit primary-navigation order in Site Settings.

Image blocks open in the shared keyboard-accessible lightbox. Missing or invalid
image, gallery, video, tile, and link values are skipped or replaced with a
readable fallback rather than breaking the page.

Published nested pages automatically show breadcrumbs for each published
Flexible Page ancestor. If an ancestor path has no corresponding published
page, the child route still works and the missing ancestor is omitted from the
breadcrumb.

### Create and publish

1. Open **Pages → New Pages** in Tina and choose **Create New**.
2. Enter the title, description, and a lowercase URL path without leading or
   trailing slashes.
3. Keep **Draft** enabled while editing. New pages default to draft.
4. Add optional presentation, navigation, and SEO fields, then save.
5. Clear **Draft** and save when ready to publish.
6. Wait for Cloudflare to deploy, then open the exact public path and refresh
   it directly.

For a nested page, use the complete path. For example,
`resources/audio-production` publishes at `/resources/audio-production/`.
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

`src/content/entries/*.mdx` is the single source for articles, projects,
galleries, case studies, and other published material.

The Tina **Placement** control determines where an entry appears:

- **Portfolio only** — persistent curated projects
- **Portfolio + Journal** — visible in both presentations
- **Archive to Journal** — removed from Portfolio and retained chronologically

Archiving changes metadata rather than moving or converting the Markdown file.
Every entry keeps the same `/archive/[slug]/` detail URL.

Portfolio has no landing page. Video and Photography remain direct New Pages;
the other work types use Journal destinations. The Homepage uses a small
ordered link list rather than copying Journal Entries or storing bento layout
metadata. Journal order uses `date`.

### Journal sections and featured story

Every published entry whose Placement includes Journal must select one
**Primary Journal Section** in Tina:

- Automotive
- Projects
- Field Notes
- Off-topic

Changing a section changes only where the entry appears in the Journal index;
its `/archive/[slug]/` URL does not change. Use **Pages → Journal Homepage →
Featured Journal Story** to choose the landing-page feature. Tina stores a
reference to the existing Journal Entry, not a copy. A draft or non-Journal
selection is skipped safely, and the selected feature is omitted from the
remaining chronological feed.

The static section routes are `/journal/automotive/`, `/journal/projects/`,
`/journal/field-notes/`, and `/journal/off-topic/`. The legacy `primaryTopic`
field remains available as a broad descriptive label and is separate from the
controlled section used for routing.

### Tags and subject archives

Tags are controlled references, not free-text labels. In Tina, open **Settings
→ Tags**
to create a reusable subject, then select it from the **Tags** list on any
Journal Entry. Published Journal and Portfolio entries are collected together
at `/tags/[slug]/`; drafts never appear.

Each Tag document has:

- **Public Label** — visible text; safe to revise without changing the URL
- **Permanent URL Slug** — lowercase kebab-case routing key
- **Archive Description** — optional introduction on the subject page
- **Previous URL Slugs** — old slugs that must continue resolving

For a new tag, keep the Tina document filename aligned with its slug. To rename
only the visible text, change **Public Label** and leave the slug alone. To
intentionally change a published slug, add the old slug to **Previous URL
Slugs** in the same save. Duplicate slugs or aliases stop the build. Deleting a
tag still referenced by an entry also stops the build with the affected entry
name, so remove or replace every reference first.

An unused Tag document still publishes a readable empty archive. This makes a
new subject safe to create before its first entry is ready.

Portfolio links resolve directly as follows:

- `/portfolio/video/`
- `/portfolio/photography/`
- Software/Ideation → `/journal/projects/`
- Case Studies/Research → `/journal/projects/`
- Writing → `/journal/`

`/portfolio/` and the retired category/proof paths redirect through
`public/_redirects`. Do not recreate those retired paths as Flexible Pages.

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

### Inline YouTube video

Content Entry files use MDX, which preserves ordinary Markdown and adds one
approved rich-text element for inline YouTube video. In Tina:

1. Open **Content Entries** and place the cursor where the video belongs.
2. Use the rich-text **Embed** control and choose **YouTube Video**.
3. Paste a `youtube.com`, `youtu.be`, or YouTube embed URL.
4. Add a descriptive **Accessible Video Title** and optional caption.
5. Save, wait for deployment, and verify the video at desktop and phone width.

The stored source is a readable `<YouTube ... />` element surrounded by normal
Markdown. A valid URL renders through YouTube's privacy-enhanced
`youtube-nocookie.com` domain. An invalid or incomplete URL shows a safe text
fallback instead of breaking the entry. Do not add arbitrary React or Astro
components to entry bodies.

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

To keep long albums compact, the gallery initially displays four photos. A
visitor can expand the complete grid and collapse it back to four. The
lightbox always includes the full album, even while the grid is collapsed.

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
- the relevant Markdown or MDX frontmatter - stored values
- the page, layout, or component that renders the values

Regenerate `tina/tina-lock.json` after Tina schema changes; do not edit the
lock file manually.

## Redesign and migration safety

Use structured editable sections for the small number of landing pages. Keep
Journal and Portfolio bodies as ordinary Markdown inside MDX and limit custom
body elements to the approved YouTube embed. Use structured page blocks only
when narrative Markdown cannot express the content.

This preserves the ability to restyle the site by replacing Astro components
and to migrate the content to another Markdown-capable system without rewriting
each entry. See `CONTENT_PORTABILITY.md` for the concise policy.
