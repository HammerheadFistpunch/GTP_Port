# Sprint 17 Media Integration Inventory

Last reviewed: 2026-08-09 after authoring UX follow-up

**Status:** Complete, deployed, and owner-accepted.

Hosted acceptance confirmed the shared picker works in structured fields,
Markdown insertion, and Import review; durable content stores permanent
`media.angrysquirrel.org` URLs that render publicly through R2.

The follow-up adds direct album browsing/opening and full-screen mobile picker
behavior. It also retires Journal Additional Media from authoring in favor of
inline body images/YouTube; the public layout retains read compatibility for
legacy structured media.

## Shared authoring contract

All applicable owner-facing image controls use one flow:

1. browse/search private Immich images through the authenticated
   `/admin/api/media/assets` endpoint
2. preview through the protected `/admin/api/media/preview/:assetId` route
3. publish or reuse the selected asset through `/admin/api/media/publish`
4. insert only the returned permanent `web` URL on
   `https://media.angrysquirrel.org`

The editor never stores an Immich asset ID, protected preview URL, private
origin, API credential, or Cloudflare Access service credential. Existing
repository-managed `/uploads/...` sources and credential-free external HTTPS
sources remain supported.

## Structured image fields

| Tina location | Stored shape | Public consumer |
| --- | --- | --- |
| Main Homepage → Hero Image | `hero.image` HTTPS or `/uploads/...` string | `src/pages/index.astro`, `BaseLayout.astro` |
| Main Homepage → Portfolio destination image | `portfolioLinks.links[].image` string | `src/pages/index.astro` |
| Custom Page → Header Image | `headerImage` string | `FlexiblePageLayout.astro` |
| Custom Page → Social Sharing Image | `seoImage` string | `FlexiblePageLayout.astro` → `BaseLayout.astro` |
| Custom Page → Image block | `blocks[].src` string | `PageBlockRenderer.astro` |
| Journal → Cover Image | `coverImage` string | Journal cards, archives, homepage, and `EntryLayout.astro` |

These fields keep their existing source shape and use the shared
`ExternalImageField` control. Empty `media: []` frontmatter was removed from
existing entries; Astro validation/rendering remains backward-compatible with
any legacy non-empty structured media.

## Markdown insertion

Journal body, Standard Page body, and Custom Page legacy body all use
`MarkdownBodyField`. Immich selection inserts ordinary portable Markdown:

```md
![Alternative text](https://media.angrysquirrel.org/immich/.../web)
```

Managed Media Manager images, safe relative Markdown images, and external
HTTPS image insertion remain available.

## Import path

The Import review screen stores the same `coverImage` string and Markdown
`body` used by manual Journal authoring. It therefore reuses the shared
structured image picker for Cover Image and `MarkdownBodyField` for body image
insertion. Import continues to create a draft and never publishes the site.

## Intentionally deferred

The `immichGallery` live-share model and Custom Page Immich Gallery block are
not converted here. Their delivery architecture, share-token removal, and
security model belong to Sprint 18.
