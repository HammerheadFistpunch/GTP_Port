# GTP_Port — Chunk 4

## Purpose

Finish the unified Content Entries migration by adding the Tina placement
action control, removing the legacy schemas and duplicate routes, refreshing
the schema lock and project documentation, and validating the final build.

## Add new files

- `tina/components/PlacementField.tsx`

## Replace existing files

- `tina/config.ts`
- `tina/tina-lock.json`
- `src/content.config.ts`
- `package.json`
- `package-lock.json`
- `README.md`
- `NEXT_STEPS.md`
- `BUILD_ORDER.md`
- `Roadmap.md`
- `Audit.md`
- `CONTENT_GUIDE.md`
- `DOCUMENTATION.md`
- `PROJECT_LOG.md`

## Delete legacy files

See `DELETE_THESE_FILES.txt`. ZIP extraction cannot remove existing files, so
delete every listed path in VS Code after extracting this package.

The deleted Markdown files are duplicate legacy copies. Their active migrated
versions remain under `src/content/entries/`.

## Installation

1. Install and push Chunks 1 through 3 first.
2. Extract this ZIP into the root of `GTP_Port` and replace existing files.
3. Delete every path listed in `DELETE_THESE_FILES.txt`.
4. Run `npm install` to install the declared TypeScript definitions.
5. Run `npm run build` with TinaCloud credentials, or `npm run build:astro`
   without them.
6. Confirm the change list does not include an unrelated `CLAUDE.md` change.

## Tina workflow

Content Entries now show three explicit placement actions:

- **Portfolio only**
- **Portfolio + Journal**
- **Archive to Journal**

Archive to Journal removes the entry from the curated Portfolio while keeping
the same Markdown file and `/archive/[slug]/` detail URL. A publication date is
required for meaningful chronological placement in Journal.

## Verification

- TypeScript strict check passes.
- Tina local schema indexing succeeds with six collections.
- Astro production build succeeds with 14 static pages.
- Legacy Journal and Portfolio content schemas are absent.
- Duplicate `/journal/[slug]/` and `/portfolio/[slug]/` routes are absent.
- No zero-byte files remain under `src/`.
- `git diff --check` passes.

