# Markdown Entry Import Guide

Use Tina's **Content → Import Entry** screen to turn a portable `.md` or
supported `.mdx` document into a canonical Journal Entry without recreating
the body by hand.

## Safe workflow

1. Open `/admin/` and choose **Content → Import Entry**.
2. Choose a `.md` or `.mdx` file smaller than 2 MB, or paste its complete
   source including frontmatter.
3. Choose **Review import**.
4. Review mapped metadata, warnings, and blocking errors.
5. Complete the filename, title, description, primary topic, and any other
   missing fields. Resolve tags against **Settings → Tags**.
6. Choose **Create imported draft**.
7. Tina creates a new `.mdx` document and opens the ordinary Journal Entry
   editor. Review the preview, cover, section, tags, date, and body there.
8. Clear **Draft** only after the imported entry is ready, save it, and use
   **Site → Publish Site** when the full editing session should go live.

The import action always creates a draft and never overwrites an existing
filename. A duplicate filename produces an error instead of replacing content.

## Frontmatter mapping

| Canonical field | Accepted import keys |
| --- | --- |
| Title | `title` |
| Description | `description`, `summary`, or `excerpt` |
| Publication date | `date`, `publishedDate`, or `published_at` |
| Updated date | `updatedDate` or `updated_at` |
| Entry type | `entryType` or `type` |
| Placement | `placement` |
| Primary topic | `primaryTopic`, `topic`, or `category` |
| Journal section | `journalSection` or `section` |
| Tags | YAML list, comma-separated string, or existing Tina tag references |
| Cover image | `coverImage`, `cover`, `image`, or `featured_image` |
| Technologies | `technologies` list or comma-separated string |
| Entry links | `links.repository`, `links.demo`, and `links.external` |

Missing entry type defaults to **Article** and missing placement defaults to
**Journal**. The importer reports unknown values and lists frontmatter keys it
will not copy. Unmapped values remain visible in the original source area so
they are not discarded silently.

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
- a credential-free public HTTPS URL, including public Immich assets; or
- a safe relative Markdown image such as `./images/example.webp`.

The importer blocks malformed frontmatter, empty bodies, unsafe image or link
destinations, credential-bearing URLs, executable MDX expressions,
`import`/`export` statements, unsupported custom components, and malformed
YouTube components. Fenced and inline code examples are excluded from MDX
execution checks.

## Canonical output

Tina—not the browser importer—serializes the reviewed data through the current
`EntriesMutation` schema. The resulting file is stored in
`src/content/entries/<filename>.mdx` with YAML frontmatter and the original
portable Markdown body. This keeps imported entries on the same save, review,
build, and publishing path as entries created normally.

After a Tina or GraphQL package update, verify one disposable draft import
locally before relying on hosted import. The parser and mutation tests live in
`tests/sprint12c-import.test.mjs`.
