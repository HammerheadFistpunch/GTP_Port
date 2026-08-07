# Next-session startup prompt

Copy everything below into a new ChatGPT Work/Codex conversation.

---

Continue development of `angrysquirrel.org` using
`HammerheadFistpunch/GTP_Port` on branch `gpt-handoff`.

Start by reading `AGENTS.md`, `DOCUMENTATION.md`, `BUILD_ORDER.md`,
`Roadmap.md`, `PROJECT_LOG.md`, and the relevant owner guides. Verify the
current remote branch tip before making changes; the known pre-wrap Sprint 12D
baseline was `4a88fefcf71dc5cd93206b48d3eb78a72d35ddad`, but the remote is the
source of truth and should now include the documentation-only session wrap.
Preserve any later Tina-generated commits.

Current project status:

- Sprint 12A-12D is complete, deployed, and owner-verified.
- The Markdown editor, sanitized live preview, playable privacy-enhanced YouTube
  preview, external HTTPS/Immich image workflow, and safe Markdown/MDX importer
  are working.
- All 11 existing Content Entries passed parse/serialize/reopen and body-policy
  checks; both verification entries are retained as drafts.
- The last full validation passed 12/12 authoring tests, TypeScript, Tina
  indexing/schema/admin compilation, and a 50-page Astro production build.
- Sprint 13 is next and must begin with a Resume content and design review. Read
  the current Resume source/model, present the review findings and a reviewable
  Sprint 13 scope, and wait for approval before implementation.
- Sprint 11 has an open operational follow-up: automatic Cloudflare production
  builds remain enabled. The protected Publish Site action works, but the
  no-automatic-build test, wrong-identity/unauthenticated rejection checks, and
  failed-build recovery exercise remain unfinished. Do not mark deliberate-only
  publishing complete until those checks pass.

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
   code, and poll the same session after I approve it. Do not let the process
   expire or start a replacement flow before confirming its exit status.
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
and push directly to `gpt-handoff`. Stop after presenting Sprint 13's Resume
review and proposed scope unless I approve implementation.

---
