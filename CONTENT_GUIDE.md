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

## TinaCMS connection

When TinaCMS is installed, map its collections to:

- `src/content/settings`
- `src/content/pages`
- `src/content/journal`
- `src/content/projects`

Tina should edit these content files. Astro should continue to own files under
`src/pages`, `src/layouts`, `src/components`, and `src/styles`.
