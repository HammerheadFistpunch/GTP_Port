# AngrySquirrel.org Project Log

_Last Updated: 2026-07-09_

---

# Current Status

**Phase:** Homepage Assembly

**Current Goal:**
Build the first complete version of the AngrySquirrel.org homepage using reusable Astro components.

---

# Completed

## Project Foundation

- [x] Project concept defined
- [x] Website architecture planned
- [x] Astro project initialized
- [x] GitHub repository created
- [x] Cloudflare Pages deployment completed
- [x] Domain planned through Cloudflare

---

## Design System

- [x] Dark theme established
- [x] Color palette created
- [x] Typography system created
- [x] Global CSS created
- [x] Utility classes created

Design system:

- Background: `#121417`
- Surface: `#1B1F24`
- Elevated Surface: `#252A31`
- Text: `#F2F4F5`
- Secondary Text: `#A8B0B8`
- Accent: Steel Blue `#4682B4`

Fonts:

- UI: Lato
- Editorial: Newsreader

---

## Layout System

Completed:

- [x] BaseLayout.astro
- [x] Navigation.astro
- [x] Footer.astro

---

## UI Components

Completed:

- [x] Hero.astro
- [x] Button.astro
- [x] Container.astro
- [x] SectionTitle.astro

---

## Content Components

Completed:

- [x] PortfolioCard.astro
- [x] JournalCard.astro
- [x] FeaturedArticle.astro

---

# Current Work

## Homepage Assembly

Building:

- [ ] Homepage hero refinement
- [ ] Featured Work section
- [ ] Journal feature section
- [ ] Recent articles section
- [ ] About section
- [ ] Final homepage spacing/layout polish

Current file:

```
src/pages/index.astro
```

---

# Upcoming

## Media System

- [ ] Image asset structure
- [ ] Placeholder images
- [ ] Gallery component
- [ ] VideoEmbed component
- [ ] Lightbox component

## Content System

- [ ] Astro Content Collections
- [ ] Project schema
- [ ] Journal schema
- [ ] Resume schema

## CMS

- [ ] TinaCMS integration

## Publishing Features

- [ ] Pagefind search
- [ ] Giscus comments
- [ ] Cloudflare Analytics
- [ ] SEO optimization

---

# Notes

The project is now moving from architecture into visual development.

The goal is to avoid page-specific code wherever possible. New content should eventually be created through Markdown/content collections rather than manually editing pages.