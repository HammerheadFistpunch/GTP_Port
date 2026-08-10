# Documentation Index

Last reviewed: 2026-08-09 after the Sprint 17 authoring UX follow-up

## Active project documents

- `TINA_AUDIT.md` - Sprint 8 field/consumer inventory and migration analysis
- `TINA_FEASIBILITY.md` - Sprint 8B Markdown, external-media, and publishing feasibility findings
- `RESUME_DESIGN.md` - Sprint 13 Resume purpose, source model, hierarchy, and maintenance decisions
- `SPRINT14_QA.md` - Phase 2 closeout evidence, owner verification, and explicitly un-run formal checks
- `MEDIA_BACKEND_GUIDE.md` - Immich/R2 architecture, Cloudflare setup, endpoint contract, security, and activation checks
- `SPRINT17_MEDIA_INVENTORY.md` - applicable Tina image fields, Markdown/Import paths, stored shapes, renderers, and shared picker contract

| Document | Purpose |
| --- | --- |
| `README.md` | Concise current status, architecture, setup, and workflows |
| `BUILD_ORDER.md` | Current Phase 3 sequence, next sprint, gates, and constraints |
| `Roadmap.md` | Completed Sprints 1-17, planned Sprint 18, and deferred candidates |
| `PROJECT_LOG.md` | Chronological decisions, completed work, and verification |
| `SITE_MAINTENANCE_GUIDE.md` | Owner guide to visual, Astro, Tina, schema, route, and dependency changes |
| `CONTENT_GUIDE.md` | Editable content locations and publishing behavior |
| `CONTENT_PORTABILITY.md` | Redesign and migration guardrails |
| `PUBLISHING_GUIDE.md` | Deliberate publishing setup, owner workflow, security, and recovery |
| `IMPORT_GUIDE.md` | Markdown/MDX import mapping, validation, draft workflow, and troubleshooting |
| `MEDIA_BACKEND_GUIDE.md` | Immich API, Tunnel/Access, R2, Pages binding, endpoint, and verification workflow |
| `SPRINT17_MEDIA_INVENTORY.md` | Sprint 17 field/renderer inventory and durable-media integration contract |
| `RESUME_DESIGN.md` | Resume-specific design intent and source ownership |
| `SPRINT14_QA.md` | Final Phase 2 migration/QA evidence and maintenance exceptions |

## Current architecture summary

Phase 2 is complete and Phase 3 is underway. The owner-facing model is now:

- all Content Entries are Journal entries
- Portfolio uses dedicated Custom Pages and direct Journal destinations
- Journal Sections are Tina-managed documents
- subject taxonomy is labeled **Topics** in Tina while preserving the underlying `tags` collection and `/tags/` public routes
- Topics are retired rather than directly deleted and may optionally point to a replacement
- Journal authoring is title/body-first with a compact icon toolbar, simplified mobile modes, and supporting metadata below the body
- Standard Page and Custom Page bodies use the same Markdown editor; other page fields retain their structured/plain-text controls
- Import writes the same simplified Journal model
- production deployment is deliberate through **Publish Site**; automatic production branch deployments are disabled
- the Sprint 16 Access-protected Immich-to-R2 backend and Sprint 17 shared structured-field/Markdown/Import picker are deployed and owner-accepted; direct album opening and responsive mobile picker/editor behavior are implemented; Sprint 18 gallery architecture/security is planned and paused

## Source hierarchy

When documents disagree, use this order:

1. Current `gpt-handoff` source and configuration
2. `BUILD_ORDER.md` for the current maintenance queue
3. `Roadmap.md` for completed scope and future candidates
4. `SPRINT14_QA.md` for Phase 2 closeout evidence
5. `README.md`, `SITE_MAINTENANCE_GUIDE.md`, and owner/content guides for current workflows
6. `PROJECT_LOG.md` for historical decisions and verification
7. Feature-specific design/implementation records such as `RESUME_DESIGN.md`
8. Files under `AI notes/` for design history

## Documentation maintenance

Every future sprint or meaningful maintenance chunk should review `PROJECT_LOG.md`, `BUILD_ORDER.md`, `Roadmap.md`, and `SITE_MAINTENANCE_GUIDE.md`. Update the README and content/publishing/import guides whenever their subject changes. Update this index whenever a document is added, retired, or renamed.

Historical design material under `AI notes/` may inform later work, but it does not override current source or current owner guides.
