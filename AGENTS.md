# Repository instructions

## Development

Use the repository scripts so Astro and TinaCMS run with the project's intended
configuration.

```bash
npm install
npm run dev
```

The Tina-aware development server exposes the local site and the editor at
`/admin/`. Do not start Astro directly when testing Tina schemas or editor
controls.

Use the smallest relevant verification set:

```bash
npm run build:astro
npx tsc --noEmit
npm run build
git diff --check
```

The full build requires the TinaCloud environment variables. Never commit
`.env` or a real `TINA_TOKEN`.

## Documentation

Read `DOCUMENTATION.md` for document ownership and source priority. Every
completed sprint must review and update, as applicable:

- `PROJECT_LOG.md`
- `BUILD_ORDER.md`
- `Roadmap.md`
- `SITE_MAINTENANCE_GUIDE.md`
- any content, portability, README, or feature-specific guide affected by the
  change

Preserve the site's existing typography and color system. The approved homepage
mockup guides layout, hierarchy, density, and spacing only.

## Reference documentation

- [Astro routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
