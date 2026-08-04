# AngrySquirrel.org Site Maintenance Guide

This guide explains how to make small code and CMS changes safely without
depending on a separate development chunk. It describes the current
AngrySquirrel.org repository rather than Astro or TinaCMS in general.

## The short version

Most changes fall into one of four categories:

| Change | Primary files | Required check |
| --- | --- | --- |
| Edit words, links, images, or entries | TinaCMS or `src/content/` | Review Cloudflare deployment |
| Change colors, fonts, spacing, or component appearance | `src/styles/` or the component's `.astro` file | `npm run build:astro` |
| Add or remove a Tina field | Tina schema, Astro schema, Markdown, renderer, Tina lock | Tina indexing and production build |
| Change routes, collections, packages, or filenames | Several connected files | Full build and careful link review |

The most important rule is:

> A Tina field is not complete until the editing schema, Astro validation,
> stored Markdown, and rendered page all agree about it.

The current redesign also has a locked visual constraint: preserve the existing
typography and color system. The approved homepage mockup guides layout,
hierarchy, density, and spacing only.

## Safe working routine

Use this routine for code changes:

1. Open GitHub Desktop and pull the latest `gpt-handoff` branch.
2. Open the repository in VS Code.
3. Check GitHub Desktop's **Changes** tab before editing. Know which changes
   were already present so you do not overwrite unrelated work.
4. Start the local site with `Start-AngrySquirrel-Editor.bat` or:

   ```bash
   npm run dev
   ```

5. Make one focused kind of change at a time.
6. Review the site in the browser at the local URL shown in the terminal.
7. Run the appropriate verification command.
8. Review every changed file in GitHub Desktop.
9. Commit with a specific description and push.
10. Confirm the Cloudflare Pages build and deployed page.

If local Tina credentials are unavailable, visual and Astro changes can still
be checked with:

```bash
npm run build:astro
```

The full command below requires the TinaCloud environment variables in `.env`
locally or in Cloudflare:

```bash
npm run build
```

Never commit `.env` or a real `TINA_TOKEN`.

## Repository map

| Location | Responsibility |
| --- | --- |
| `src/content/entries/` | Markdown bodies and metadata for every article, project, case study, and gallery |
| `src/content/pages/` | Editable Homepage, archive-page, About, Contact, and Resume content |
| `src/content/flexible-pages/` | Tina-created standalone and nested pages with explicit URL paths |
| `src/content/settings/site.md` | Navigation, footer, site name, and shared descriptions |
| `src/content.config.ts` | Astro's validation rules for all stored content |
| `tina/config.ts` | Fields and controls visible in TinaCMS |
| `tina/components/` | Custom Tina editor controls, including Placement actions |
| `tina/tina-lock.json` | Generated Tina schema lock; regenerate it, never hand-edit it |
| `src/pages/` | Route behavior, collection queries, sorting, and page composition |
| `src/layouts/` | Shared page shells and Content Entry rendering |
| `src/components/` | Reusable visual and interactive pieces |
| `src/components/flexible/PageBlockRenderer.astro` | Ordered Flexible Page block rendering and block-level styles |
| `src/lib/page-blocks.ts` | Astro validation and TypeScript contract for Flexible Page blocks |
| `src/styles/` | Global colors, typography, spacing, utilities, and base behavior |
| `public/uploads/` | Repository-owned images and media available at `/uploads/...` |
| `astro.config.mjs` | Site URL, static-output mode, and Tina/Astro integration |
| `package.json` | Commands, Node requirement, and package dependencies |
| `package-lock.json` | Exact dependency versions installed by Cloudflare and `npm install` |

Do not manually edit `node_modules/`, `dist/`, `.astro/`, or
`tina/__generated__/`. They are generated outputs.

## How a page is assembled

The site separates content from presentation:

```text
Tina editor
  -> Markdown in src/content
  -> validation in src/content.config.ts
  -> query and route in src/pages
  -> shared layout
  -> visual components and CSS
```

The main routes are:

| URL | Route source | Primary presentation |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Hero, Portfolio cards, Journal cards, About callout |
| `/portfolio/` | `src/pages/portfolio/index.astro` | `PortfolioBentoCard.astro` |
| `/journal/` | `src/pages/journal/index.astro` | `CategoryNav.astro` and `JournalCard.astro` |
| `/archive/[slug]/` | `src/pages/archive/[...slug].astro` | `EntryLayout.astro` |
| `/about/` | `src/pages/about.astro` | `StandardPageLayout.astro` |
| `/contact/` | `src/pages/contact.astro` | `StandardPageLayout.astro` and `ContactMethods.astro` |
| `/resume/` | `src/pages/resume.astro` | `StandardPageLayout.astro`, Resume Overview, and Timeline |
| Flexible paths such as `/services/video-production/` | `src/pages/[...path].astro` | `FlexiblePageLayout.astro` |

`BaseLayout.astro` wraps every page with metadata, navigation, footer, global
styles, and the accessibility skip link.

## Flexible Page route safety

Flexible Pages use an explicit `path` field rather than deriving the public URL
from the Markdown filename. `src/lib/flexible-pages.ts` normalizes and validates
that field, while `src/pages/[...path].astro` rejects duplicate published paths
during the build.

Path segments must use lowercase letters, numbers, and single hyphens. The
following top-level paths are reserved because the application or public asset
tree already owns them:

```text
_astro, about, admin, archive, contact, journal, portfolio, resume, uploads
```

Do not remove a reserved value merely to make a Flexible Page build. Confirm
the existing route or asset tree is intentionally being migrated first.

Tina document filenames may contain folders, but the `path` frontmatter is the
public routing contract. Keep the nested filename and URL path aligned where
practical so repository browsing remains understandable.

Flexible Pages now use the following optional editorial controls:

| Field | Behavior |
| --- | --- |
| `eyebrow` | Short accent label above the page title |
| `headerImage` | Wide responsive image above the Markdown body |
| `headerImageAlt` | Accessible description; blank means decorative |
| `navigationLabel` | Short breadcrumb label; falls back to `title` |
| `navigationOrder` | Stored sibling order for future generated menus |

Published parent paths generate breadcrumbs automatically. The global primary
navigation remains controlled by `src/content/settings/site.md`; nested global
menus are intentionally deferred to Sprint 7.

### Owner workflow for Flexible Pages

Create and publish:

1. In Tina, open **Flexible Pages** and create a document.
2. Enter required content and a lowercase kebab-case **URL Path**.
3. Leave **Draft** enabled until the page is ready.
4. Clear **Draft**, save, wait for Cloudflare, and test the URL directly.

Nest a page by entering its full path, such as
`services/video-production`. A published Flexible Page at `services` is not
required for routing, but it supplies the parent breadcrumb.

Rename safely:

- Changing the title does not move the route.
- Changing `path` moves the route and makes the old URL return 404 unless a
  redirect is added.
- Search the repository for links to the old path before publishing the move.
- Reserved, malformed, and duplicate paths stop the production build instead
  of overwriting another page.

Delete safely:

- Use **Draft** for a reversible unpublish.
- Tina deletion removes only the selected document; descendants are not
  deleted automatically.
- After deployment, confirm the removed path displays the custom 404 page and
  that any child pages still have intentional routes and links.

### Owner workflow for Flexible Page blocks

1. Open a Flexible Page and find **Page Blocks**.
2. Add one of the six approved block types.
3. Complete the fields inside the new block, then save.
4. Drag blocks by their list handles to set the page order and save again.
5. Wait for Cloudflare and verify both desktop and phone layouts.

The block contract spans:

- `tina/config.ts` — templates and editor fields
- `src/lib/page-blocks.ts` — stored-data validation and shared TypeScript type
- `src/components/flexible/PageBlockRenderer.astro` — block rendering
- `src/pages/[...path].astro` — collection data supplied to the renderer
- Flexible Page `blocks` frontmatter — stored order and values
- `tina/tina-lock.json` — generated Tina schema

Do not add a template to only one of these layers. Keep block fields tolerant
in Astro so a newly inserted, partly completed block cannot take down the whole
site during editing. Tina may still mark the fields required to guide the
editor before saving finished content.

Child Page Tiles are explicit selections, not an automatic folder listing.
Use full Flexible Page paths without leading slashes. Missing and draft paths
are skipped safely. Reordering the paths changes tile order inside the block;
reordering the block moves the entire tile section.

The Rich Text block stores Markdown in frontmatter and is rendered with the
direct `marked` dependency. This is intentionally different from the legacy
Markdown body, which Astro renders through the content collection. Keep raw
layout HTML and inline CSS out of both locations.

## Changing the visuals

### Change the global color palette

Edit `src/styles/variables.css`.

The current shared variables are:

```css
--bg-primary
--bg-surface
--bg-elevated
--text-primary
--text-secondary
--accent
--border-color
```

Example—change the blue accent everywhere:

```css
--accent: #5FA8D3;
```

This is safer than replacing color values in individual components. Do not
rename a variable unless you also replace every `var(--name)` reference.

After changing colors, check text contrast, hover states, focus outlines,
buttons, links, and cards on both desktop and mobile.

### Change fonts or general typography

Edit:

- `src/styles/typography.css` for the Google Fonts import and heading/body rules
- `src/styles/variables.css` for `--font-ui` and `--font-editorial`

If a font family name changes, update both the import and its variable. A
variable that names an unavailable font will fall back to `sans-serif` or
`serif`, which can change wrapping and layout height.

### Change global spacing, width, radius, or shadows

Edit `src/styles/variables.css` for shared values such as:

```css
--content-width
--reading-width
--space-sm
--space-md
--space-lg
--space-xl
--radius-sm
--radius-md
--shadow-soft
```

Also inspect `Container.astro`. It currently has explicit default, reading, and
wide widths. Changing reading width affects articles, standard pages, Resume,
and entry detail pages together.

### Change one component only

Open the component and edit its `<style>` block. Astro scopes those styles to
that component by default.

Common targets:

| Visual element | File |
| --- | --- |
| Header and mobile menu | `src/components/ui/Navigation.astro` |
| Footer | `src/components/ui/Footer.astro` |
| Homepage hero | `src/components/ui/Hero.astro` |
| Buttons | `src/components/ui/Button.astro` |
| Homepage section headings | `src/components/ui/SectionTitle.astro` |
| Homepage Portfolio cards | `src/components/portfolio/PortfolioCard.astro` |
| Portfolio bento cards | `src/components/portfolio/PortfolioBentoCard.astro` |
| Journal cards | `src/components/journal/JournalCard.astro` |
| Homepage featured article | `src/components/journal/FeaturedArticle.astro` |
| Entry headers and body shell | `src/layouts/EntryLayout.astro` |
| About, Contact, and Resume header shell | `src/layouts/StandardPageLayout.astro` |
| Gallery and lightbox | `Gallery.astro`, `Lightbox.astro`, and `ImmichGallery.astro` |

When changing a component's HTML, check its `interface Props` at the top. If
you add, remove, or rename a prop, every place that calls the component may
also need updating. Find callers with VS Code's **Find All References** or:

```bash
rg "ComponentName" src
```

### Change a page layout

Use `src/pages/` when changing which sections appear, how collections are
queried, or how items are sorted. Use `src/layouts/` when the same presentation
is shared by multiple routes.

Examples:

- Change Homepage section order in `src/pages/index.astro`.
- Change Portfolio grid composition in `src/pages/portfolio/index.astro`.
- Change Journal archive composition in `src/pages/journal/index.astro`.
- Change every Content Entry detail page in `src/layouts/EntryLayout.astro`.

Avoid putting editable copy directly into `.astro` files. Add it to the
appropriate Markdown page and Tina schema instead.

### Responsive changes

Responsive rules live inside each component's `<style>` block and occasionally
in global styles. Search for existing media queries before adding another:

```bash
rg "@media" src
```

Check at least a narrow phone width, a tablet width, and a desktop width. Bento
tile sizing is particularly sensitive because the Portfolio grid and card span
rules must agree.

## Editing existing content without code

Use Tina for ordinary changes to:

- Homepage wording, buttons, preview headings, preview links, and limits
- Journal and Portfolio archive headings
- Site navigation and footer text
- About, Contact, and Resume content
- Content Entry metadata, body text, placement, media, and links

These values are stored under `src/content/`. Tina is only the editor; GitHub
Markdown remains the source of truth.

If a value is already exposed in Tina, do not add another field or hard-code a
second copy in Astro.

## Adding an editable Tina field

A normal field touches four authored locations and one generated file:

1. `tina/config.ts` — exposes the editor control.
2. `src/content.config.ts` — validates the stored value.
3. The relevant file under `src/content/` — stores the value.
4. The route, layout, or component — renders or uses the value.
5. `tina/tina-lock.json` — regenerated after the schema changes.

### Safe example: add an optional Client field to Content Entries

First, add the Tina field inside the `Content Entries` collection in
`tina/config.ts`:

```ts
{
    type: "string",
    name: "clientName",
    label: "Client / Organization",
},
```

Second, add matching Astro validation inside the `entries` schema in
`src/content.config.ts`:

```ts
clientName: z.string().optional(),
```

Third, add the optional prop to `EntryLayout.astro`:

```ts
interface Props {
  clientName?: string;
}

const {
  clientName,
} = Astro.props;
```

Then render it conditionally where desired:

```astro
{clientName && <p class="client-name">{clientName}</p>}
```

Finally, start Tina locally so it indexes the schema and regenerates the lock:

```bash
npm run dev
```

Wait for **TinaCMS Dev Server is active**, then stop it with `Ctrl+C`. Review
and commit the generated `tina/tina-lock.json` together with the authored
schema changes.

Once deployed, Tina will store an entered value in frontmatter like:

```yaml
clientName: Intermountain Health
```

### Add optional fields before making them required

Adding a required field immediately can break every existing Markdown file
that does not contain it. Use this safer sequence:

1. Add the field without `required: true` in Tina.
2. Use `.optional()` or a default in Astro validation.
3. Deploy the optional field.
4. Populate it on every existing document.
5. Only then make it required in both schemas if it truly must always exist.

Defaults are useful when the site can make a safe assumption:

```ts
showClient: z.boolean().default(false),
```

### Field names must match exactly

These are different fields:

```text
titleHref
titleURL
titleUrl
```

The Tina `name`, Astro schema key, Markdown frontmatter key, and render access
must use the same capitalization and spelling.

### Field type changes require extra care

Changing a string to a list, object, date, number, or boolean changes the YAML
shape. Update all existing Markdown values before expecting a successful build.

For option fields, these locations must agree:

- Tina `options`
- Astro `z.enum(...)`
- existing Markdown values
- any TypeScript union in a component or layout
- any CSS class or conditional behavior based on the value

Current examples include `placement`, `entryType`, `tileSize`, and
`headerStyle`.

## Removing an editable Tina field

Use this sequence:

1. Remove or make conditional any rendering that depends on the field.
2. Remove the value from existing Markdown files if it is no longer useful.
3. Remove the field from `tina/config.ts`.
4. Remove it from `src/content.config.ts` and any TypeScript prop interfaces.
5. Run Tina locally to regenerate `tina/tina-lock.json`.
6. Run the production checks and review all affected pages.

If the field affects filenames, slugs, collection placement, sorting, or
routes, treat the removal as a high-risk architecture change rather than a
small CMS cleanup.

## Changing an existing Tina feature

### Placement control

The custom Placement interface spans:

- `tina/components/PlacementField.tsx` — buttons and editor behavior
- `tina/config.ts` — field definition and allowed choices
- `src/content.config.ts` — allowed stored values
- Content Entry Markdown — current `placement` value
- Homepage, Journal, Portfolio, and Entry Layout queries — presentation logic

The values `portfolio`, `both`, and `journal` are code contracts. Changing a
label is relatively safe. Changing one of those stored values requires updating
every consumer.

Custom Tina components are React TSX. If JSX is used, keep a runtime import:

```ts
import React from "react";
```

Type-only imports do not create the runtime `React` value.

### Portfolio tile sizes

The tile-size feature spans:

- Tina options in `tina/config.ts`
- the `tileSize` enum in `src/content.config.ts`
- stored Content Entry values
- `PortfolioBentoCard.astro` class and span rules
- the grid in `src/pages/portfolio/index.astro`

Adding a new option only in Tina will allow the editor to write a value that
Astro rejects. Adding it only to the schema will not give Tina a control for it.

### Homepage editable sections

Homepage fields span:

- the `Homepage` collection in `tina/config.ts`
- the `pageType: "home"` schema in `src/content.config.ts`
- `src/content/pages/home.md`
- `src/pages/index.astro`
- the visual component receiving the value

The Featured Work and Journal Preview title links also pass through
`SectionTitle.astro`.

### Site settings, navigation, and footer

Editable values live in `src/content/settings/site.md` and the `Site Settings`
collection in Tina. Their presentation lives in `Navigation.astro`,
`Footer.astro`, and `BaseLayout.astro`.

Adding a navigation link is a content edit. Changing how navigation behaves on
mobile is a component-code edit.

## Routes, slugs, and links

Astro creates static pages during the build. There is no database handling
unknown routes at request time.

Content Entry detail URLs use the Markdown filename:

```text
src/content/entries/my-project.md
-> /archive/my-project/
```

Renaming a published file changes its URL and breaks old links unless a
redirect is added separately. Use lowercase kebab-case filenames for new
entries and avoid renaming published entries casually.

The unified `/archive/[slug]/` route is deliberately neutral so moving an entry
between Portfolio and Journal does not change its URL.

Journal topic chips are currently visual labels. Making them functional should
use static topic routes generated from Content Entry `primaryTopic` values; it
does not require a backend database.

## Images and media

Tina-managed local uploads are stored under `public/uploads/` and referenced
from content as:

```text
/uploads/example.jpg
```

Do not use a Windows filesystem path, a `localhost` URL, or a path beginning
with `public/` in content.

Critical cover and narrative images should remain locally owned. Immich is the
expanded live-gallery layer and should not be the only copy of essential
project media.

Changing gallery or lightbox behavior can affect keyboard controls, focus,
captions, mobile layout, and both Journal and Portfolio entries because the
same Entry Layout is shared.

## Package and dependency changes

Avoid updating packages merely because a newer version exists. Astro and Tina
version changes can alter generated schemas, build behavior, and integration
APIs.

When intentionally adding or changing a package:

1. Confirm Node still satisfies the `package.json` engine requirement.
2. Use `npm install package-name` rather than manually typing a version into
   `package.json`.
3. Commit both `package.json` and `package-lock.json`.
4. Run `npm run build` with Tina credentials or confirm the Cloudflare build.
5. Review generated Tina files and routes for unexpected changes.

Cloudflare currently installs from `package-lock.json` and uses Node
`22.22.0` or newer.

## Verification by change type

| Change made | Minimum verification |
| --- | --- |
| Tina content edit only | Save, wait for Cloudflare, review deployed page |
| CSS or `.astro` visual change | `npm run build:astro` and browser review |
| Astro content schema change | `npm run build:astro`, then review all documents in that collection |
| Tina schema change | Start `npm run dev`, confirm indexing, commit regenerated lock, then Cloudflare build |
| Route or collection query change | `npm run build:astro`, confirm route count and expected generated URLs |
| Package change | `npm install`, full build, and Cloudflare build |
| Custom Tina TSX change | `npx tsc --noEmit`, Tina editor test, and Cloudflare build |

Useful commands:

```bash
# Static site check; does not require TinaCloud credentials
npm run build:astro

# Strict TypeScript check
npx tsc --noEmit

# Full Tina and Astro production build; requires credentials
npm run build

# Show files changed in Git
git status --short

# Check for whitespace and patch formatting problems
git diff --check
```

## Common failures and what they usually mean

### `React is not defined`

A custom Tina `.tsx` component is rendering JSX without importing the React
runtime. Add `import React from "react";` and retest the hosted editor.

### Missing or invalid content error

The Markdown value and `src/content.config.ts` disagree, a required field is
missing, or an enum contains an unsupported value. Read the error for the
filename and field name first.

### Tina field does not appear

Common causes:

- the field was added to the wrong Tina collection
- Tina's local schema was not re-indexed
- `tina/tina-lock.json` was not regenerated or committed
- Cloudflare has not finished deploying the schema change
- the Tina field `name` does not match the intended content key

### Tina shows a field, but the page does not change

The value is probably being stored but not passed through the page to a layout
or component. Check the Markdown file after saving, then trace the value through
the route and component props.

### Astro builds locally but the full build asks for tokens

`npm run build:astro` checks the static site only. `npm run build` first runs
TinaCloud's build and requires `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN`.
Cloudflare has those production values configured.

### A collection suddenly does not exist

A route or component is probably still querying an old collection name. The
active Astro collections are `entries`, `pages`, and `settings`. Tina presents
six focused editing collections, but several of them map into the shared
`pages` directory.

### A visual change affects more pages than expected

You probably changed a global CSS rule, shared variable, layout, or component.
Use Git search to find every import or CSS variable reference before reverting.

## Changes that deserve extra caution

Pause and make a backup commit before changing:

- collection names or collection paths
- `placement`, `entryType`, or `tileSize` stored values
- `src/pages/archive/[...slug].astro`
- published Markdown filenames
- `astro.config.mjs`
- Tina branch, client, token, or build configuration
- package versions
- media-path conventions
- `BaseLayout.astro` metadata or shared shell behavior

These changes can affect every entry, every route, the CMS, or the Cloudflare
build at once.

## A good small-change commit

A good commit should answer one sentence cleanly, such as:

```text
Increase Journal card image height on desktop
```

Avoid combining a color redesign, Tina schema change, package update, and route
change in one commit. Focused commits are easier to understand and easier to
undo in GitHub Desktop.

Before pushing, confirm:

- only intended files changed
- no `.env` or token is included
- new Tina fields exist in both schemas
- existing Markdown still satisfies required fields
- the relevant build passes
- mobile and keyboard behavior still work where applicable
- links use site paths such as `/portfolio`, not local filesystem paths

## Sprint documentation checklist

Documentation is part of sprint completion, not a later cleanup task. At the
end of every sprint:

1. Add completed work, decisions, and verification to `PROJECT_LOG.md`.
2. Advance the active chunk and decision gates in `BUILD_ORDER.md`.
3. Update status, dependencies, or acceptance criteria in `Roadmap.md`.
4. Update this guide whenever routes, Tina controls, schemas, workflows,
   dependencies, or maintenance procedures changed.
5. Update `README.md`, `CONTENT_GUIDE.md`, `CONTENT_PORTABILITY.md`, or a
   feature-specific guide only when that document's subject changed.
6. Check `DOCUMENTATION.md` if documents were added, retired, or renamed.

A sprint is not complete until the relevant documentation matches the built and
deployed behavior. Small copy-only edits do not require a full roadmap rewrite,
but meaningful visual changes should still be recorded when they alter the
approved design direction.
