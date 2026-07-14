# Content Portability and Redesign Guide

## Recommendation

Start publishing now. The current Markdown and YAML-frontmatter architecture
is suitable for redesigns and future migration as long as authored content
remains separate from presentation.

## Keep content portable

- Write Journal and Portfolio bodies in semantic Markdown.
- Use headings to describe the document structure, not its visual size.
- Store titles, descriptions, dates, tags, categories, links, and media
  references in frontmatter.
- Use stable, lowercase, kebab-case filenames.
- Use relative local media paths such as `/uploads/project-cover.jpg`.
- Avoid raw layout HTML, CSS classes, inline styles, and framework components in
  authored content.
- Avoid turning every article into a page-builder made from custom Tina blocks.

## Where blocks are appropriate

Structured or reorderable Tina blocks are reasonable for the small number of
landing pages, including the Homepage, Journal archive, and Portfolio archive.
A future redesign only needs to remap those few pages.

For articles and case studies, prefer ordinary Markdown plus a small set of
durable metadata fields. Add a custom content block only when standard Markdown
cannot represent the required material.

## Media policy

Keep each job-critical cover image and important narrative image in the
repository. Immich is appropriate for expanded galleries, but an Immich public
share should not be the only copy needed to understand a project.

Immich gallery links are portable metadata, but their availability depends on
the Immich server, proxy, domain, and public-share token.

## What a future redesign changes

A style redesign should primarily replace files under:

- `src/components/`
- `src/layouts/`
- `src/pages/`
- `src/styles/`

The Markdown under `src/content/` should normally remain unchanged.

## What a future migration requires

Another Markdown-based system can consume the content with a small schema
mapping. A database CMS or page-builder platform will require an import script,
but the source material remains readable and extractable without TinaCloud.

Tina is an editor for Git-backed files, not the durable content store. GitHub,
Markdown, YAML frontmatter, and owned media provide the exit path.
