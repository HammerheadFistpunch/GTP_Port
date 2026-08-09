# Editable Content Guide

The site separates editable information from Astro layout and behavior. Git-backed Markdown/MDX remains the source of truth; Tina is the owner-facing editor.

## Tina navigation

- **Settings** → Site Settings, Topics, Publish Site
- **Pages** → Main Homepage, Journal Homepage, About, Contact, Resume, Custom Pages
- **Content** → Journal, Journal Sections, Import
- **Media** → Media Manager

## Global settings

`src/content/settings/site.md` controls the site name, logo text, default description, primary navigation, footer links/text, and copyright name.

## Pages

`src/content/pages/` contains the fixed editable pages:

- `home.md` — Homepage sections, ordering, visibility, Journal feature, and Portfolio destinations
- `journal.md` — Journal landing copy and featured story
- `about.md` — About page
- `contact.md` — Contact page
- `resume.md` — structured Resume profile, capabilities, experience, education, and links

Custom standalone/nested pages live under `src/content/flexible-pages/` and use their explicit `path` field for public routing. Physical folders are editorial organization only; do not use folders as publication state or Journal taxonomy.

## Journal entries

Every file in `src/content/entries/*.mdx` is a Journal entry. There is no separate Portfolio placement state.

Current Journal model:

- Title
- Description
- Publication Date
- Status (Draft/Published)
- Journal Section
- Topics
- Cover Image
- optional Immich Gallery
- optional structured media
- Markdown body

Portfolio uses dedicated Custom Pages and direct Journal destinations. Durable entry URLs remain `/archive/[slug]/`.

### Status

Use **Draft** while editing. Draft entries remain in Git/Tina but do not receive a public article route. Change to **Published** when ready for the next deliberate site publish.

### Journal Sections

Journal Section answers **where the story belongs**. Sections are Tina-managed documents under **Content → Journal Sections**.

A section has:

- Section Name
- permanent slug
- description
- Active/Retired state
- previous slugs

Changing the visible name is safe. Retiring a section removes it from normal section navigation/selection while stories remain reachable through Latest. Previous slugs preserve intentional section URL migrations.

### Topics

Topics answer **what the story is about** and power related-story relevance plus `/tags/[slug]/` subject archives.

The underlying collection remains `tags` and public URLs remain `/tags/.../` for compatibility, but Tina labels the owner-facing concept **Topics**.

A Topic has:

- Topic Name
- Description
- Active/Retired state
- optional Replacement Topic
- permanent URL slug
- previous URL slugs

Safe Topic management:

1. Add Topics freely when they represent reusable subjects.
2. Rename the Topic Name freely; leave the permanent slug alone unless intentionally migrating the URL.
3. Retire a Topic instead of deleting it. Retired Topics disappear from normal new-entry selection but remain valid on existing stories.
4. Use Replacement Topic only when two Topics are deliberately being consolidated.
5. Direct Topic deletion is disabled in Tina.

Distinct concepts should remain distinct. A name similarity is not a reason to merge Topics.

## Markdown body editor

Journal, Standard Page, and Custom Page body fields store portable Markdown/MDX source and provide Write/Split/Preview modes plus toolbar insertion for:

- bold
- italic
- strikethrough
- inline code
- bulleted lists
- numbered lists
- hyperlinks
- Media Manager images
- Immich/R2 images
- external HTTPS images
- YouTube

Underline is intentionally unsupported.

Use standard Markdown wherever possible. The approved inline video source element is:

```mdx
<YouTube url="https://www.youtube.com/watch?v=VIDEO_ID" title="Descriptive video title" caption="Optional caption" />
```

The preview is sanitized and does not execute arbitrary MDX/scripts.

This applies only to body fields. Structured Homepage, Journal landing, Resume, metadata, and Custom Page block fields keep their purpose-specific controls.

## Images and media

Use **Immich image** to browse the private Immich library and select an image.
Selection publishes or reuses permanent `thumbnail` and `web` copies in R2;
the editor inserts only the public `web` URL. Use **Media image** for a
repository-managed upload, or **Image URL** for a credential-free external
HTTPS source.

The same **Choose from Immich** control is available on structured image
fields such as Journal covers, Homepage images, Custom Page headers/social
images, image blocks, and image-type Additional Media. Existing `/uploads/...`
and HTTPS values remain valid.

Immich galleries use public `share.angrysquirrel.org` links and remain live-backed; changes to the public album do not require rewriting the Journal body.

## Import

Use **Content → Import** to upload or paste Markdown/MDX. Body-only Google Docs exports do not need YAML frontmatter: Review Import fills the complete body, derives an editable title and filename from the source filename, and Tina generates canonical frontmatter when the draft is created. Existing frontmatter is mapped when present.

The review screen lists every active Topic as a selectable choice and also accepts Topic labels/slugs typed as a comma-separated list. Its Cover Image field and Markdown body use the same Immich/R2 controls as ordinary Journal authoring. Import maps into the same current Journal model, validates supported body syntax/media, resolves active Topics and Journal Sections, and always creates a Draft. It never overwrites an existing entry and never publishes immediately.

See `IMPORT_GUIDE.md` for detailed mapping and validation behavior.

## Custom Pages

Custom Pages live under `src/content/flexible-pages/` and use an explicit **URL Path**. New pages default to Draft.

Approved blocks include:

- Rich Text
- Image
- YouTube Video
- Immich Gallery
- Child Page Tiles
- Call to Action

Changing a Custom Page title does not change its URL. Changing `path` does. Add a redirect before moving an established public path.

## Homepage

The Homepage remains a structured landing page. Use Tina to edit section content, visibility, ordering, Journal feature/recent count, and compact Portfolio destinations. The reorder control is editorial presentation only and does not delete section data.

## Publishing

Automatic Cloudflare production branch deployments are disabled.

Normal workflow:

1. Edit/save content in Tina.
2. Keep unfinished content Draft.
3. Finish the editing session.
4. Open **Settings → Publish Site**.
5. Publish once when Saved and Live differ.
6. Review the deployed pages after the saved commit is reported live.

See `PUBLISHING_GUIDE.md` for the security model and recovery workflow.

## Schema safety

A Tina field change is incomplete until all of these agree:

- `tina/config.ts`
- `src/content.config.ts`
- stored Markdown/MDX
- route/layout/component consumers
- generated `tina/tina-lock.json`
- TinaCloud reindex/admin behavior
- production build

Never hand-edit `tina/tina-lock.json`.
