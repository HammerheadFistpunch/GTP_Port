# GTP_Port

Astro source for AngrySquirrel.org: a dark, editorial-first personal website combining long-form publishing with a professional portfolio of software, photography, video, writing, engineering, and case-study work.

## Current status

Milestones 1 through 5 are complete. The site has a functional Git-backed content core, local TinaCMS editing, automatic Cloudflare Pages publishing, an accessible shared shell, compact mobile navigation, and a shared metadata foundation.

Current work begins with Milestone 6 page and component completion.

## Editing workflow

```text
Pull gpt-handoff
-> npm run dev
-> edit through local Tina
-> review the site
-> npm run build
-> commit and push in VS Code
-> Cloudflare Pages rebuilds
```

TinaCloud and a hosted production `/admin/` are intentionally excluded.

## Verification

Before committing, run:

```bash
npm run build
git diff --check
git status --short
```
