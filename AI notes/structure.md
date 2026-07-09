src/
├── components/
│
│   ├── blog/
│   │   ├── BlogCard.astro
│   │   ├── FeaturedArticle.astro
│   │   ├── CategoryNav.astro
│   │   ├── ArticleMeta.astro        ← add
│   │   └── RelatedArticles.astro    ← add
│   │
│   ├── portfolio/
│   │   ├── PortfolioCard.astro
│   │   ├── Gallery.astro
│   │   ├── Lightbox.astro
│   │   ├── VideoEmbed.astro
│   │   ├── ProjectMeta.astro        ← add
│   │   └── RelatedProjects.astro    ← add
│   │
│   ├── media/
│   │   ├── Image.astro              ← add
│   │   └── VideoPlayer.astro        ← add
│   │
│   ├── ui/
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Button.astro
│   │   ├── SectionTitle.astro
│   │   └── Container.astro
│   │
│   └── resume/
│       └── Timeline.astro
│
├── layouts/
│   ├── BaseLayout.astro
│   ├── BlogLayout.astro
│   ├── PortfolioLayout.astro
│   └── ResumeLayout.astro           ← add
│
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── contact.astro
│   ├── resume.astro
│
│   ├── portfolio/
│   │   ├── index.astro
│   │   ├── [...slug].astro           ← add
│   │
│   └── journal/
│       ├── index.astro
│       ├── category/
│       ├── tag/
│       ├── archive/
│       └── [...slug].astro
│
├── content/
│   ├── journal/
│   │
│   ├── projects/
│   │
│   ├── resume/
│   │
│   └── config.ts
│
├── styles/
│   ├── global.css
│   ├── variables.css
│   ├── typography.css
│   └── utilities.css
│
└── assets/
    ├── images/
    └── icons/