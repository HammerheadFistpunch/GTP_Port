src/
├── components/
│   ├── blog/
│   │   ├── BlogCard.astro
│   │   ├── FeaturedArticle.astro
│   │   └── CategoryNav.astro
│   │
│   ├── portfolio/
│   │   ├── PortfolioCard.astro
│   │   ├── Gallery.astro
│   │   ├── Lightbox.astro
│   │   └── VideoEmbed.astro
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
│   └── PortfolioLayout.astro
│
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── contact.astro
│   ├── resume.astro
│   │
│   ├── portfolio/
│   │   ├── index.astro
│   │   ├── software/
│   │   ├── photography/
│   │   ├── video/
│   │   ├── writing/
│   │   └── case-studies/
│   │
│   └── blog/
│       ├── index.astro
│       ├── category/
│       ├── tag/
│       ├── archive/
│       └── [...slug].astro
│
├── content/
│   ├── blog/
│   ├── projects/
│   ├── resume/
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