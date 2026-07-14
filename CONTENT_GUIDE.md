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

- `home.md` — hero, calls to action, section headings, preview limits, and About callout
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

## Published content

- `src/content/journal/*.md` — Journal entries
- `src/content/projects/*.md` — Portfolio projects

The homepage reads directly from these collections. Featured items appear
first, followed by the newest available content. There are no separate
hard-coded homepage article or project lists.

### Immich galleries

Journal Entries and Portfolio Projects include an optional **Immich Gallery**
group. Paste a non-password-protected public link from
`https://share.angrysquirrel.org`, then set the visible gallery title and a
short image-description prefix. Journal galleries appear after the article;
inline images remain available for narrative placement within the story.

The gallery reads the current public album when a visitor opens the page, so
adding or removing Immich photos does not require a site rebuild. If the share
server is unavailable, the project displays a direct link to the public album.
Revoking the Immich public link also removes the gallery's access.

## TinaCMS connection

When TinaCMS is installed, map its collections to:

- `src/content/settings`
- `src/content/pages`
- `src/content/journal`
- `src/content/projects`

Tina should edit these content files. Astro should continue to own files under
`src/pages`, `src/layouts`, `src/components`, and `src/styles`.
