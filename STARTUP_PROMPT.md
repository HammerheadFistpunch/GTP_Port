# Next-session startup prompt

Copy everything below into a new ChatGPT Work/Codex conversation.

---

Continue development of `angrysquirrel.org` using
`HammerheadFistpunch/GTP_Port` on branch `gpt-handoff`.

Start by reading `AGENTS.md`, `DOCUMENTATION.md`, `BUILD_ORDER.md`,
`Roadmap.md`, `PROJECT_LOG.md`, `SPRINT14_QA.md`, `RESUME_DESIGN.md`, and the
relevant owner guides. Verify the current remote branch tip before making
changes and preserve any later Tina-generated commits.

Current project status:

- Sprints 1-13 are implemented and deployed.
- Sprint 12's Markdown editor, sanitized live preview, external HTTPS/Immich
  image workflow, and safe Markdown/MDX importer are deployed and verified.
- Sprint 13 rebuilt `/resume/` as a structured professional-background page.
  The deployed page is owner-approved and the superseded Resume renderers were
  removed.
- Sprint 14 is active. The source audit confirmed the retired Services proof
  pages, retired Portfolio category pages, and `Test-content.mdx` are gone while
  their intentional redirects remain.
- Sprint 14A added dependency-free `/robots.txt`, `/sitemap.xml`, and `/rss.xml`
  routes plus RSS autodiscovery in `BaseLayout.astro`. These endpoints still
  require deployed verification.
- `BUILD_ORDER.md` is now the concise Sprint 14 executable queue. `Roadmap.md`
  carries milestone/acceptance scope. `SPRINT14_QA.md` records actual evidence
  and distinguishes source inspection from hosted/local validation.
- The Tina Resume `Additional Resume Content` field remains a compatibility hold.
  Remove it only when `tina/config.ts` and `tina/tina-lock.json` can be
  regenerated and validated together.
- `placement` is not dead cleanup: it still has active consumers in Journal/tag
  filtering, Homepage/entry behavior, import tooling, and tests.
- Sprint 11 still has an operational follow-up: automatic Cloudflare production
  builds remain enabled. The protected Publish Site action works, but the
  no-automatic-build test, wrong-identity/unauthenticated rejection checks, and
  failed-build recovery exercise remain unfinished.

Next Sprint 14 work:

1. Verify the deployed retired-route redirects and the new robots/sitemap/RSS
   endpoints; record evidence in `SPRINT14_QA.md`.
2. From a networked checkout with Tina credentials, run the full local gate:
   `npm run test:authoring`, `npx tsc --noEmit`, `npm run build`,
   `git diff --check`, and `git status --short`.
3. Only from that validated checkout, decide whether to remove the unused Resume
   body field and regenerate the Tina lock/reindex TinaCloud in the same change.
4. Complete the hosted Tina checks carried from Sprints 4-10.
5. Complete the Sprint 11 Cloudflare automatic-build cutoff, authorization
   negative tests, and failed-build recovery exercise.
6. Run final internal-link, metadata, keyboard/accessibility, responsive,
   cross-browser, and Lighthouse QA.
7. Reconcile `PROJECT_LOG.md` and `SITE_MAINTENANCE_GUIDE.md`; the README,
   documentation index, Build Order, Roadmap, Resume design record, and Sprint 14
   QA record already reflect the current source state.

GitHub CLI setup is a required first checkpoint because fresh workspaces have
repeatedly lost the binary, `PATH`, config, live device-auth process, or Git
credential helper:

1. Check whether the repository is already present. If not, restore a clean
   checkout of the latest `gpt-handoff` branch through the connected GitHub
   integration or an authenticated clone.
2. Run `gh --version` and resolve its absolute path. Do not assume a CLI
   downloaded in an earlier conversation still exists or is on `PATH`.
3. Set a task-specific `GH_CONFIG_DIR` in a persistent workspace directory
   outside the repository before authentication, and use that same value in
   every later shell.
4. Run `gh auth status`. If device authorization is needed, start
   `gh auth login --hostname github.com --git-protocol https --web` in a live
   PTY, keep that exact terminal session running, provide only the newest active
   code, and poll the same session after approval. Do not let the process expire
   or start a replacement flow before confirming its exit status.
5. From a fresh shell using the same `GH_CONFIG_DIR`, rerun `gh auth status`.
   Browser approval alone does not prove the token was written durably.
6. Configure the repository-local Git HTTPS credential helper with the absolute
   `gh` path and explicit `GH_CONFIG_DIR`; do not rely on
   `!gh auth git-credential` finding `gh` through a later shell's `PATH`.
7. Verify `git status -sb`, the branch name, remote URL, HEAD SHA, remote SHA,
   and ahead/behind count before edits and again before pushing. Tina may add
   content commits during the session; preserve them. Never force-push.
8. If the connected GitHub integration must publish because the exact local CLI
   path is unavailable, state whether it will preserve the exact local commit
   SHA or create an identical-tree replacement commit before changing the ref.

Continue the established workflow: keep changes in reviewable chunks, preserve
unrelated Tina/content edits, update every applicable document automatically,
run the smallest relevant checks plus the full sprint gate, commit intentionally,
and push directly to `gpt-handoff`. Do not mark a hosted or local validation
check complete from source inspection alone.

---
