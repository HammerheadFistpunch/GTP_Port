# Next-session startup prompt

Copy everything below into a new ChatGPT Work/Codex conversation.

---

Continue maintenance and feature development of `angrysquirrel.org` using `HammerheadFistpunch/GTP_Port` on branch `gpt-handoff`.

Mandatory GitHub startup gate — complete this before reading local project files or editing anything:

1. Confirm the connected GitHub app/connector is available and can read `HammerheadFistpunch/GTP_Port`. Confirm a supported write path is available before making changes. If the connector is unavailable, stop and restore the connection instead of working from a stale workspace.
2. Fetch the latest remote `gpt-handoff` tip and record its SHA. GitHub's remote branch is the source of truth; conversation history, uploaded copies, and leftover workspace files are only context.
3. If a local checkout exists, verify its remote and branch, run a fresh fetch, and fast-forward it to remote `gpt-handoff`. If it cannot fast-forward cleanly, inspect and preserve the local and remote changes rather than overwriting either. If no valid checkout exists, create/materialize one from the latest remote branch.
4. Re-read the repository instructions and planning documents from that synchronized tree. Preserve any newer Tina-generated content commits.
5. Immediately before publishing, fetch/verify the remote tip again. Publish only as a fast-forward child of that exact commit; never force-push. Re-read the branch after publishing and confirm the new SHA and expected changed files.

After the GitHub startup gate passes, read `AGENTS.md`, `DOCUMENTATION.md`, `BUILD_ORDER.md`, `Roadmap.md`, `SPRINT14_QA.md`, `SITE_MAINTENANCE_GUIDE.md`, and any feature guide relevant to the requested work from the synchronized repository tree.

Current project status:

- Sprints 1-16 are complete; Phase 2 is closed and Phase 3 is underway.
- Sprint 15 applied the Journal Markdown editor only to Standard Page and Custom Page body fields. Other page fields intentionally keep their existing controls.
- Sprint 16 is complete, deployed, and owner-accepted. Sprint 17's inventory and shared Immich picker are implemented across structured image fields, Markdown, and Import; the local Tina build and all 28 authoring tests pass. Hosted editor/saved-content owner acceptance is the remaining Sprint 17 gate. Sprint 18 covers gallery architecture/security.
- Every Content Entry is a Journal entry. Portfolio is composed from dedicated Custom Pages plus direct Journal destinations.
- Deprecated Journal fields (`placement`, `entryType`, `primaryTopic`, `technologies`, manual entry links) are removed from the current authoring/runtime model.
- Journal Sections are Tina-managed documents with stable slugs, aliases, and Active/Retired behavior.
- Owner-facing Tags are now **Topics**. The underlying `tags` collection and `/tags/` public routes remain intentionally stable.
- Topics support Active/Retired state and optional Replacement Topic migration; direct deletion is disabled in Tina.
- Journal authoring is Markdown-first with formatting, links, inline code, Immich/R2, Media Manager image insertion, external images, and YouTube insertion.
- Import writes the same simplified Journal model as manual creation and reuses the shared Markdown/Immich controls during review.
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

Resume Sprint 17 at hosted acceptance. Deliberately publish the implementation, verify the picker in one structured image field, Markdown insertion, and Import review, confirm only permanent `media.angrysquirrel.org` URLs are saved, and verify the rendered image. Then record owner acceptance, close Sprint 17, and activate Sprint 18.

Continue the established workflow: keep changes in reviewable chunks, preserve unrelated Tina/content edits, update every applicable document automatically, run the smallest relevant checks plus the full gate when warranted, commit intentionally, and push directly to `gpt-handoff`.

---
