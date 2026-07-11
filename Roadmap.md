# GTP_Port Roadmap

Last updated: 2026-07-11
Working branch: `gpt-handoff`

## Vision

Build AngrySquirrel.org as a fast, dark, editorial-first personal site combining long-form publishing with a professional portfolio of software, photography, video, writing, engineering, and case-study work.

The system remains:

- static-first
- Git-backed
- subscription-free
- content-focused
- editable without routine template changes
- designed and routed by Astro
- locally managed through TinaCMS
- deployed through GitHub and Cloudflare Pages

## Milestone 1 — Foundation

Status: **Complete**

- Astro project
- GitHub repository
- Cloudflare Pages connection
- static build pipeline
- content collections
- shared source organization

## Milestone 2 — Functional content core

Status: **Complete**

- Journal and Portfolio detail routes
- rendered Markdown bodies
- expanded content schemas
- dedicated detail layouts
- linked archive pages
- collection-driven homepage
- supporting pages
- editable site settings and page content
- valid static route set

## Milestone 3 — TinaCMS local integration

Status: **Complete**

Complete:

- Tina CLI and Astro integration installed
- Astro aligned to version 6.4.6
- static output preserved
- Tina admin running locally
- existing Markdown mapped into seven Tina collections
- homepage edit verified end to end
- local multi-machine workflow defined

Verified after the integration:

- production build runs Astro directly
- clean nine-page static build
- focused Resume collection added
- interrupted placeholder components restored or removed

Exit condition: any machine with the repository can pull, run Tina locally, edit content, build successfully, and push changes.

## Milestone 4 — GitHub and Cloudflare publishing

Status: **Complete**

- Cloudflare watches `gpt-handoff`
- Git pushes trigger deployments
- set Cloudflare Node version to `22.22.0`
- change production build to `astro build`
- remove TinaCloud credential requirements
- successful automatic deployment confirmed on 2026-07-11

Exit condition: a pushed content or code commit produces a successful Cloudflare Pages deployment without TinaCloud.

## Milestone 5 — Accessibility and shared shell completion

Status: **Complete**

- skip link
- visible focus states
- current-page navigation state
- deliberate keyboard-accessible mobile navigation
- reduced-motion handling
- explicit SVG and ICO favicon links
- canonical URL support
- Open Graph and social-sharing metadata foundation
- page descriptions verified across shared layouts
- keyboard review completed
- color contrast reviewed and steel-blue accent raised to a passing ratio

## Milestone 6 — Page and component completion

Status: **In progress**

- Journal filters or category routes
- related articles - complete
- project filters
- galleries and lightbox - complete
- inline narrative image lightbox - complete
- video embeds - complete for project-level media
- inline video blocks within project narrative content
- reusable media components - complete
- related projects - complete
- resume timeline and structured editor - complete
- resume print refinement - pending

## Milestone 7 — Design completion

Status: **Not started**

- homepage hierarchy and rhythm
- Journal archive polish
- Portfolio archive polish
- article reading experience
- case-study presentation
- responsive and cross-browser review

## Milestone 8 — Real content

Status: **Not started**

- replace placeholders
- publish representative Journal entries
- publish portfolio projects and case studies
- add photography, video, and writing work
- complete biography, resume, and contact information

## Milestone 9 — Launch quality

Status: **Not started**

- canonical URLs
- Open Graph metadata
- sitemap and robots.txt
- RSS
- image optimization
- Lighthouse and performance work
- Pagefind
- Cloudflare Web Analytics
- custom-domain launch checks

## Later integrations

- Giscus
- Immich
- inline narrative video blocks
- resume PDF generation
- advanced related-content features

## Explicitly excluded

- TinaCloud dependency
- subscription-based CMS publishing
- hosted production `/admin/`
