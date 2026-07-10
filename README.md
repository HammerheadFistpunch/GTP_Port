README.md


# GTP_Port

Astro source for AngrySquirrel.org: a dark, editorial-first personal website
combining long-form publishing with a professional portfolio of software,
photography, video, writing, engineering, and case-study work.

## Current status

The repository and deployment foundation are working. The visual foundation and
homepage shell are partially implemented. The current milestone is **Functional
Core Completion**: repair Journal and Portfolio detail routing, complete the
content schemas and layouts, connect archives and homepage previews to Markdown,
and replace blank supporting pages.

Do not treat the project as polish-only yet. See the verified audit and ordered
tasks below.

## Planning documents

- `BUILD_ORDER.md` — canonical next implementation tasks and acceptance criteria
- `PROJECT_LOG.md` — verified progress and decision history
- `Roadmap.md` — milestone sequence and exit conditions
- `Audit.md` — evidence from the 2026-07-10 repository and production-build audit

## Design references

- `AI notes/Pat Rich website design_July 2026.md`
- `AI notes/mood board.png`
- `AI notes/structure.md`

## Stack direction

- Astro, static-first
- GitHub-backed Markdown content
- Cloudflare Pages deployment
- TinaCMS deferred until the content model and Markdown workflow are stable
- Pagefind, Giscus, Immich, resume generation, analytics, and launch-quality
  integrations scheduled after the functional core and design are complete

## Development

```text
npm ci
npm run dev
npm run build
```

The minimum completion gate for every implementation batch is a warning-free
production build plus verification that expected routes, links, and local assets
exist.

push to build