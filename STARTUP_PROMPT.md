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

The connected GitHub app is the default repository and publishing path. Its account-level authorization persists across fresh workspaces; do not block ordinary publishing on a missing `gh` binary or an ephemeral CLI login:

1. Check whether the repository is already present. If not, restore a clean checkout of the latest `gpt-handoff` branch through the connected GitHub app or an authenticated clone.
2. Verify that the GitHub app can read `HammerheadFistpunch/GTP_Port` and has write access before making changes.
3. Verify `git status -sb`, branch name, remote URL, local HEAD SHA, remote `gpt-handoff` SHA, and ahead/behind count before edits and again immediately before publishing. Tina may add content commits during the session; preserve them. Never force-push.
4. Use the GitHub app's Git data operations to publish: create blobs for changed files, create a tree based on the verified remote tree, create one commit whose parent is the verified remote tip, then fast-forward `refs/heads/gpt-handoff` to that commit.
5. If local commits are being consolidated into a GitHub-created commit, compare the complete resulting tree/diff before updating the branch. State beforehand that the canonical GitHub commit will have a different SHA even when its tree is identical to the local work.
6. Re-read the remote branch after the ref update and confirm its new SHA and expected changed files.
7. Use `gh` only when a requested operation is not supported by the connected GitHub app. If CLI fallback is genuinely necessary, then check `gh --version`, use a task-specific `GH_CONFIG_DIR` outside the repository, complete one live `gh auth login` session if needed, and configure the repository-local HTTPS credential helper with the resolved `gh` path and that same config directory.

Continue the established workflow: keep changes in reviewable chunks, preserve unrelated Tina/content edits, update every applicable document automatically, run the smallest relevant checks plus the full gate when warranted, commit intentionally, and push directly to `gpt-handoff`.

---
