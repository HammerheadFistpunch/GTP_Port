# GTP_Port

Astro source for AngrySquirrel.org: a dark, editorial-first personal website combining long-form publishing with a professional portfolio of software, photography, video, writing, engineering, and case-study work.

## Current status

The functional content architecture and local TinaCMS editing workflow are working. The immediate task is to repair the production build so Cloudflare Pages builds Astro directly without TinaCloud credentials.

The project intentionally remains subscription-free:

- Astro generates the static website.
- TinaCMS provides a local visual editor.
- Markdown in GitHub is the source of truth.
- Cloudflare Pages rebuilds after pushes.
- No hosted production CMS is required.

## Editing workflow

```text
Pull latest branch
→ npm run dev
→ edit through localhost/admin
→ npm run build
→ commit and push
→ Cloudflare deploys
```

Any machine with repository access, Node.js, and Git can use the same workflow.

## Planning documents

- `BUILD_ORDER.md` — canonical implementation order and acceptance criteria
- `PROJECT_LOG.md` — verified progress and decision history
- `Roadmap.md` — milestone sequence and exit conditions
- `NEXT_STEPS.md` — immediate handoff for the next work session
- `Audit.md` — historical repository and production-build audit

## Stack

- Astro 6
- static output
- GitHub-backed Markdown content
- TinaCMS local editor
- Cloudflare Pages deployment

## Development

```bash
npm install
npm run dev
```

Local Tina admin:

```text
http://localhost:4321/admin/
```

Production verification:

```bash
npm run build
```

The build must complete successfully before committing and pushing.
