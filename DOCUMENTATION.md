# Documentation Index

Last reviewed: 2026-08-07 during Sprint 14 migration and QA

## Active project documents

- `TINA_AUDIT.md` - Sprint 8 field/consumer inventory, disposition map, stored-data findings, and migration gates
- `TINA_FEASIBILITY.md` - Sprint 8B Markdown, external-media, and deliberate-publishing feasibility findings
- `RESUME_DESIGN.md` - Sprint 13 Resume purpose, source model, public hierarchy, content rules, PDF decision, acceptance results, and Sprint 14 compatibility hold
- `SPRINT14_QA.md` - Sprint 14 source-audit findings, crawl/feed work, hosted-check evidence, and final validation record

| Document | Purpose |
| --- | --- |
| `README.md` | Concise current status, architecture, setup, and workflows |
| `BUILD_ORDER.md` | Current executable Sprint 14 queue and completion gates |
| `Roadmap.md` | Full sprint scope, dependencies, and acceptance criteria |
| `PROJECT_LOG.md` | Chronological decisions, completed work, and verification |
| `STARTUP_PROMPT.md` | Copy-ready next-session handoff, baseline checks, and GitHub CLI safeguards |
| `SITE_MAINTENANCE_GUIDE.md` | Owner guide to visual, Astro, Tina, schema, route, and dependency changes |
| `CONTENT_GUIDE.md` | Editable content locations and publishing behavior |
| `CONTENT_PORTABILITY.md` | Redesign and migration guardrails |
| `PUBLISHING_GUIDE.md` | Deliberate publishing setup, owner workflow, security, and recovery |
| `IMPORT_GUIDE.md` | Markdown/MDX import mapping, validation, draft workflow, and troubleshooting |
| `RESUME_DESIGN.md` | Resume-specific design intent, source ownership, content rules, acceptance results, and deferred schema cleanup |
| `SPRINT14_QA.md` | Final Phase 2 migration/QA evidence and outstanding hosted/local checks |

## Project instructions

| Document | Purpose |
| --- | --- |
| `AGENTS.md` | Repository-specific development and documentation requirements |
| `.env.example` | Safe template for required TinaCloud and branch variables |

## Source hierarchy

When documents disagree, use this order:

1. Current `gpt-handoff` source and configuration
2. `BUILD_ORDER.md` for the active chunk
3. `Roadmap.md` for planned scope and acceptance criteria
4. `SPRINT14_QA.md` for current Sprint 14 findings and verification evidence
5. `README.md`, `SITE_MAINTENANCE_GUIDE.md`, and the content guides for current workflows
6. `PROJECT_LOG.md` for historical decisions and verification
7. Feature-specific design/implementation records such as `RESUME_DESIGN.md`
8. Files under `AI notes/` for design history

## Sprint 14 documentation state

`BUILD_ORDER.md` has been reconciled to a concise Sprint 14-only execution queue rather than duplicating historical sprint detail. `SPRINT14_QA.md` records what has actually been verified from source versus what still requires deployed Tina/Cloudflare/browser/local-build evidence.

The remaining large-document reconciliation is intentionally part of Sprint 14 closeout: `Roadmap.md`, `PROJECT_LOG.md`, and `SITE_MAINTENANCE_GUIDE.md` must match the deployed Phase 2 system before Sprint 14 is marked complete.

The legacy Tina Resume body field may be removed only when `tina/config.ts` and `tina/tina-lock.json` can be regenerated and validated together.

## Documentation maintenance

Every completed sprint must review `PROJECT_LOG.md`, `BUILD_ORDER.md`, `Roadmap.md`, and `SITE_MAINTENANCE_GUIDE.md`. Update the README and content or portability guides when their subject changes. Update this index whenever a document is added, retired, or renamed.

Historical design material under `AI notes/` may inform later work, but it does not override current source, the active build order, or the roadmap.
