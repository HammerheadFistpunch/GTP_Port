# Personal Website Architecture (v1)

## Vision

A single website that serves two purposes:

1. A professional portfolio showcasing software, photography, video, writing, and case studies.
2. An editorial-style blog inspired by classic Gawker/Jalopnik.

The site should prioritize creating content over maintaining code.

---

# Technology Stack

| Component | Choice |
|----------|--------|
| Framework | Astro |
| CMS | TinaCMS (Phase 2) |
| Repository | GitHub |
| Hosting | Cloudflare Pages |
| DNS | Cloudflare |
| Images | Self-hosted Immich |
| Comments | Giscus (preferred) or Disqus |
| Search | Pagefind |
| Analytics | Cloudflare Web Analytics |
| Resume | Generated from structured content |

---

# Site Structure

```
/
├── Home
├── Portfolio
│   ├── Software
│   ├── Photography
│   ├── Video
│   ├── Writing
│   └── Case Studies
│
├── Blog
│   ├── Technology
│   ├── Cars
│   ├── Photography
│   ├── Personal
│   └── Projects
│
├── Resume
├── About
└── Contact
```

---

# Design Philosophy

Professional, modern, minimal.

Landing page:
- Clean hero
- Large typography
- Plenty of whitespace
- Featured portfolio items
- Recent blog posts

Blog:
- Editorial layout
- Large feature images
- Category navigation
- Reading-focused typography

Portfolio:
- Project-centric
- Rich media
- Easy navigation
- Strong storytelling

---

# Core Components

- Navigation
- Hero
- Portfolio Card
- Blog Card
- Featured Article
- Gallery
- Lightbox
- Video Embed
- Resume Timeline
- Footer
- Search
- Pagination
- Contact Form

---

# Content Types

## Software Project

- Title
- Description
- Technologies
- GitHub Link
- Demo Link
- Screenshots
- Case Study

## Photography Gallery

- Title
- Description
- Immich Album ID
- Cover Image
- Tags

## Video

- Title
- Thumbnail
- Embed URL
- Description

## Writing

- Title
- Publication
- PDF
- External Link

## Blog Post

- Title
- Category
- Tags
- Hero Image
- Content

## Resume

Structured content only.

Generated into:
- Resume page
- Printable page
- Downloadable PDF

---

# Image Strategy

Immich is the source of truth.

Workflow:

Upload photos to Immich

↓

Create Album

↓

Store Album ID in CMS

↓

Astro generates gallery automatically

No duplicate uploads.
No duplicate storage.

---

# CMS Philosophy

The CMS edits content only.

It should never dictate:
- Design
- Layout
- Navigation
- Components

Those belong to Astro.

---

# Development Philosophy

- Static-first
- Dynamic only where necessary
- Git-backed content
- Fast deployment
- Minimal maintenance
- Long-term sustainability

---

# Project Roadmap

## Phase 1 — Foundation

- [ ] Create new GitHub repository
- [ ] Create new Astro project
- [ ] Configure Cloudflare Pages
- [ ] Connect custom domain
- [ ] Verify automatic deployments

---

## Phase 2 — Design System

- [ ] Define typography
- [ ] Define color palette
- [ ] Define spacing
- [ ] Build navigation
- [ ] Build footer
- [ ] Build homepage

---

## Phase 3 — Portfolio

- [ ] Software section
- [ ] Photography section
- [ ] Video section
- [ ] Writing section
- [ ] Case studies
- [ ] Resume page

---

## Phase 4 — Blog

- [ ] Editorial homepage
- [ ] Categories
- [ ] Tags
- [ ] Archive
- [ ] RSS
- [ ] Search

---

## Phase 5 — CMS

- [ ] Install TinaCMS
- [ ] Define collections
- [ ] Configure GitHub authentication (if needed)
- [ ] Test editing workflow

---

## Phase 6 — Integrations

- [ ] Immich integration
- [ ] Giscus comments
- [ ] Resume PDF generation
- [ ] Cloudflare Analytics
- [ ] SEO improvements

---

## Success Criteria

The finished website should allow new content to be added without modifying code.

Typical workflows:

- Publish a blog post in minutes.
- Add a software project through the CMS.
- Upload photos to Immich and have galleries update automatically.
- Update resume data once and regenerate every resume format.
- Deploy automatically through GitHub → Cloudflare Pages.

The website should remain fast, static, maintainable, and visually polished while requiring minimal ongoing technical work.