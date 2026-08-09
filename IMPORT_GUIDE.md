# Markdown Entry Import Guide

Use Tina's **Content → Import Entry** screen to turn a portable `.md` or
supported `.mdx` document into a canonical Journal Entry without recreating
the body by hand.

## Safe workflow

1. Open `/admin/` and choose **Content → Import Entry**.
2. Choose a `.md` or `.mdx` file smaller than 2 MB, or paste its complete
   source. YAML frontmatter is optional; body-only Google Docs Markdown exports
   are supported directly.
3. Choose **Review import**.
4. Review mapped metadata, warnings, and blocking errors.
5. Complete the filename, title, description, Topics, and any other missing
   fields. Active Topics are listed as selectable choices in the review screen;
   they can also be entered by label or slug. Use **Choose from Immich** for a
   cover and **Immich image** in the body toolbar when an imported document
   needs a permanent R2 website copy.
6. Choose **Create imported draft**.
7. Tina creates a new `.mdx` document and opens the ordinary Journal Entry
   editor. Review the preview, cover, section, tags, date, and body there.
8. Clear **Draft** only after the imported entry is ready, save it, and use
   **Site → Publish Site** when the full editing session should go live.

The import action always creates a draft and never overwrites an existing
filename. A duplicate filename produces an error instead of replacing content.

## Frontmatter mapping

If the source has no frontmatter, **Review Import** places the entire document
in the body, derives a safe filename and editable title from the source
filename, and leaves the remaining metadata fields for review. Tina generates
canonical YAML frontmatter when it creates the draft. If frontmatter is
present, the importer maps the supported keys below.

| Canonical field | Accepted import keys |
| --- | --- |
| Title | `title` |
| Description | `description`, `summary`, or `excerpt` |
| Publication date | `date`, `publishedDate`, or `published_at` |
| Journal section | `journalSection` or `section` |
| Tags | YAML list, comma-separated string, or existing Tina tag references |
| Cover image | `coverImage`, `cover`, `image`, or `featured_image` |

Deprecated entry type, placement, primary topic, technology, and manual-link
fields are accepted only so older exports can be reviewed; they are discarded
from the current unified Journal model with a warning. The importer reports
unknown values and lists frontmatter keys it will not copy. Unmapped values
remain visible in the original source area so they are not discarded silently.

Tags must already exist in the controlled Tags collection. The importer
matches a tag's public label, permanent slug, previous-slug alias, or full
`src/content/tags/...md` reference. Add a missing tag under **Settings → Tags**
before creating the draft.

## Supported body content

The importer preserves ordinary Markdown headings, paragraphs, emphasis,
lists, blockquotes, tables, fenced code, links, and images. It also preserves
the site's established self-closing YouTube form:

```mdx
<YouTube url="https://www.youtube.com/watch?v=VIDEO_ID" title="Video title" />
```

Imported image sources may be:

- a managed `/uploads/...` path;
- a credential-free public HTTPS URL, including permanent R2 website assets; or
- a safe relative Markdown image such as `./images/example.webp`.

The importer blocks malformed frontmatter, empty bodies, unsafe image or link
destinations, credential-bearing URLs, executable MDX expressions,
`import`/`export` statements, unsupported custom components, and malformed
YouTube components. Fenced and inline code examples are excluded from MDX
execution checks.

During Review Import, the shared picker can browse private Immich previews and
publish/reuse an asset. Only the returned permanent R2 `web` URL is placed in
the cover or Markdown body; private preview URLs and Immich credentials are
never stored.

## Canonical output

Tina—not the browser importer—serializes the reviewed data through the current
`EntriesMutation` schema. The resulting file is stored in
`src/content/entries/<filename>.mdx` with YAML frontmatter and the original
portable Markdown body. This keeps imported entries on the same save, review,
build, and publishing path as entries created normally.

After a Tina or GraphQL package update, verify one disposable draft import
locally before relying on hosted import. The parser and mutation tests live in
`tests/sprint12c-import.test.mjs`.

The initial hosted rollout is verified. Its draft is retained as
`src/content/entries/imported-entry.mdx` so the whole-collection Sprint 12D
tests can confirm future Tina changes still preserve imported content. Keep it
drafted; it is verification content, not a public Journal article.
