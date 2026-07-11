# GTP_Port Roadmap

Last updated: 2026-07-10  
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

Status: **Nearly complete**

Complete:

- Tina CLI and Astro integration installed
- Astro aligned to version 6.4.6
- static output preserved
- Tina admin running locally
- existing Markdown mapped into six Tina collections
- homepage edit verified end to end
- local multi-machine workflow defined

Remaining:

- verify every collection
- remove initializer demo leftovers
- repair the production build script
- run a clean static build
- commit the completed local integration

Exit condition: any machine with the repository can pull, run Tina locally, edit content, build successfully, and push changes.

## Milestone 4 — GitHub and Cloudflare publishing

Status: **In progress**

- Cloudflare watches `gpt-handoff`
- Git pushes trigger deployments
- set Cloudflare Node version to `22.22.0`
- change production build to `astro build`
- remove TinaCloud credential requirements
- confirm a successful automatic deployment

Exit condition: a pushed content or code commit produces a successful Cloudflare Pages deployment without TinaCloud.

## Milestone 5 — Accessibility and shared shell completion

Status: **Next after deployment repair**

- skip link
- visible focus states
- current-page navigation state
- deliberate mobile navigation
- reduced-motion handling
- favicon and metadata cleanup
- keyboard and contrast review

## Milestone 6 — Page and component completion

Status: **Not started**

- Journal filters or category routes
- related articles
- project filters
- galleries and lightbox
- video embeds
- reusable media components
- resume timeline and print refinement

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
- resume PDF generation
- advanced related-content features

## Explicitly excluded

- TinaCloud dependency
- subscription-based CMS publishing
- hosted production `/admin/`
