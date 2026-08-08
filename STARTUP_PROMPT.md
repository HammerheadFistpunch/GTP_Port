# Next-session startup prompt

Copy everything below into a new ChatGPT Work/Codex conversation.

---

Continue maintenance and feature development of `angrysquirrel.org` using `HammerheadFistpunch/GTP_Port` on branch `gpt-handoff`.

Start by reading `AGENTS.md`, `DOCUMENTATION.md`, `BUILD_ORDER.md`, `Roadmap.md`, `SPRINT14_QA.md`, `SITE_MAINTENANCE_GUIDE.md`, and any feature guide relevant to the requested work. Verify the current remote branch tip before making changes and preserve any later Tina-generated commits.

Current project status:

- Sprints 1-14 are complete; Phase 2 is closed and owner-accepted.
- There is no active Sprint 15. `BUILD_ORDER.md` is now a maintenance/future-work queue.
- Every Content Entry is a Journal entry. Portfolio is composed from dedicated Custom Pages plus direct Journal destinations.
- Deprecated Journal fields (`placement`, `entryType`, `primaryTopic`, `technologies`, manual entry links) are removed from the current authoring/runtime model.
- Journal Sections are Tina-managed documents with stable slugs, aliases, and Active/Retired behavior.
- Owner-facing Tags are now **Topics**. The underlying `tags` collection and `/tags/` public routes remain intentionally stable.
- Topics support Active/Retired state and optional Replacement Topic migration; direct deletion is disabled in Tina.
- Journal authoring is Markdown-first with formatting, links, inline code, Media Manager image insertion, external images, and YouTube insertion.
- Import writes the same simplified Journal model as manual creation.
- The Resume uses structured Tina-backed content and no longer carries the unused legacy body field.
- `/robots.txt`, `/sitemap.xml`, and `/rss.xml` are part of the static site.
- Automatic Cloudflare production branch deployments are disabled. Production publishing is deliberate through **Settings → Publish Site**.
- Tina schema changes require synchronized `tina/config.ts`, Astro validation, content/renderers, generated `tina/tina-lock.json`, TinaCloud reindex, and production build validation.
- `SPRINT14_QA.md` records the Phase 2 closeout and explicitly lists formal browser/security/performance checks that were not re-run during closeout.

Deferred future candidates, not active commitments:

- Pagefind search when content volume warrants it
- Giscus comments when public discussion is desired
- generated Resume PDF from the existing structured Resume source
- more advanced related-content ranking
- broader visual page-builder controls

GitHub CLI setup is a required first checkpoint because fresh workspaces have repeatedly lost the binary, `PATH`, config, live device-auth process, or Git credential helper:

1. Check whether the repository is already present. If not, restore a clean checkout of the latest `gpt-handoff` branch through the connected GitHub integration or an authenticated clone.
2. Run `gh --version` and resolve its absolute path. Do not assume a CLI downloaded in an earlier conversation still exists or is on `PATH`.
3. Set a task-specific `GH_CONFIG_DIR` in a persistent workspace directory outside the repository before authentication, and use that same value in every later shell.
4. Run `gh auth status`. If device authorization is needed, start `gh auth login --hostname github.com --git-protocol https --web` in one live PTY, keep that exact session running, provide only the newest active code, and poll the same process after approval.
5. From a fresh shell using the same `GH_CONFIG_DIR`, rerun `gh auth status`.
6. Configure the repository-local Git HTTPS credential helper with the absolute `gh` path and explicit `GH_CONFIG_DIR`.
7. Verify `git status -sb`, branch name, remote URL, HEAD SHA, remote SHA, and ahead/behind count before edits and again before pushing. Tina may add content commits during the session; preserve them. Never force-push.
8. If the connected GitHub integration must publish because the local CLI path is unavailable, state whether it preserves the exact local commit SHA or creates an identical-tree replacement commit before changing the ref.

Continue the established workflow: keep changes in reviewable chunks, preserve unrelated Tina/content edits, update every applicable document automatically, run the smallest relevant checks plus the full gate when warranted, commit intentionally, and push directly to `gpt-handoff`.

---
