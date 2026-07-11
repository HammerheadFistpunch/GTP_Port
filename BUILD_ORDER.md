# GTP_Port Build Order

Last updated: 2026-07-10  
Working branch: `gpt-handoff`

## Current phase

> **Local TinaCMS Verification + Cloudflare Build Repair**

The Astro content architecture and local Tina editing path are working. The project will remain subscription-free: TinaCMS will be used as a local editor, GitHub will synchronize content, and Cloudflare Pages will build the static Astro site after each push.

## Verified complete

- Static Astro architecture
- Cloudflare Pages connected to `gpt-handoff`
- Home, Journal, Portfolio, About, Resume, and Contact routes
- Journal and Portfolio detail routes
- Collection-driven homepage, archives, and detail pages
- Editable Markdown under `src/content/`
- Site settings and page copy moved out of Astro templates
- TinaCMS local development server
- Tina admin available locally at `/admin/index.html`
- Homepage Markdown edit verified through Tina and Astro
- Six Tina collections configured
- Static output preserved in `astro.config.mjs`
- Multi-machine workflow defined through Git pull, edit, commit, and push

## Architecture decision

TinaCloud will not be used.

Final publishing workflow:

```text
Clone or pull repository
→ npm run dev
→ edit through local Tina admin
→ review and commit changes
→ push to GitHub
→ Cloudflare Pages rebuilds the static site
```

The deployed website will not provide a public `/admin/` editing interface.

## Immediate next tasks

### Task 1 — Repair the production build script

Change `package.json` so production builds run Astro directly:

```json
"build": "astro build"
```

Keep local development as:

```json
"dev": "tinacms dev -c \"astro dev\""
```

Also:

- update the Node engine to `>=22.22.0`
- remove the unused `@astrojs/cloudflare` package
- regenerate `package-lock.json`

### Task 2 — Run a clean local build

Run:

```bash
npm install
npm run build
```

Verify:

- the build does not request TinaCloud credentials
- all expected routes generate
- no internal links break
- content collections validate
- output is written to `dist/`

### Task 3 — Clean Tina initializer leftovers

Review and remove unused demo files and routes, including:

- `content/posts/hello-world.md`
- `src/pages/tinacms-demo.astro`
- `src/components/tina/`
- `src/lib/tina/islands.ts`
- `src/pages/tina-island/`

Also remove empty placeholder components that are not imported.

Do not remove:

- `tina/config.ts`
- `@tinacms/astro`
- `@tinacms/cli`
- `tinacms`
- the local Tina development script

### Task 4 — Verify Cloudflare deployment

Cloudflare settings:

| Setting | Value |
| --- | --- |
| Production branch | `gpt-handoff` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node environment variable | `NODE_VERSION=22.22.0` |

Commit and push the repaired build configuration. Confirm Cloudflare completes the deployment.

### Task 5 — Verify all six Tina collections

Open and save one item in each collection:

- Site Settings
- Homepage
- Archive Pages
- Standard Pages
- Journal Entries
- Portfolio Projects

Confirm each save updates the expected Markdown file and renders correctly.

### Task 6 — Resume functional-core work

After deployment is stable:

- navigation accessibility
- current-page states
- mobile navigation
- focus and reduced-motion styles
- favicon and metadata cleanup
- final functional-core audit

## Deferred

- Pagefind
- Giscus
- Immich integration
- gallery and lightbox
- related content
- resume PDF generation
- final visual polish
