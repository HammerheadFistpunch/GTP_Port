# Next Steps — 2026-07-11

## Goal

Complete the subscription-free local TinaCMS setup and restore successful automatic Cloudflare Pages deployments.

## 1. Update `package.json`

Make these changes:

```json
"engines": {
  "node": ">=22.22.0"
}
```

```json
"scripts": {
  "dev": "tinacms dev -c \"astro dev\"",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro"
}
```

Remove the unused dependency:

```text
@astrojs/cloudflare
```

Recommended command:

```bash
npm uninstall @astrojs/cloudflare
```

## 2. Regenerate dependencies and test

```bash
npm install
npm run build
```

Expected result:

- no request for TinaCloud `clientId` or `token`
- Astro generates the site into `dist/`
- all expected routes build successfully

## 3. Clean Tina demo leftovers

Remove the initializer demo files that are not part of the real site:

```text
content/posts/hello-world.md
src/pages/tinacms-demo.astro
src/components/tina/PostBody.astro
src/components/tina/Starfield.astro
src/lib/tina/islands.ts
src/pages/tina-island/[name].ts
```

Also review and remove empty, unused placeholder components identified in the repository cleanup list.

## 4. Verify local Tina collections

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:4321/admin/
```

Save one test edit in each collection:

- Site Settings
- Homepage
- Archive Pages
- Standard Pages
- Journal Entries
- Portfolio Projects

Confirm the matching Markdown files change and the site renders each edit.

## 5. Commit and push

Before committing:

```bash
npm run build
```

Then use VS Code Source Control:

1. Review changed files.
2. Stage the intended changes.
3. Commit with a message such as `Finalize local Tina build workflow`.
4. Sync or push `gpt-handoff`.

## 6. Verify Cloudflare

Cloudflare Pages should use:

```text
Production branch: gpt-handoff
Build command: npm run build
Output directory: dist
Environment variable: NODE_VERSION = 22.22.0
```

Confirm the pushed commit produces a successful deployment.

## Stop condition

Do not begin design or feature work until both commands succeed:

```bash
npm run dev
npm run build
```

and Cloudflare completes the automatic deployment from `gpt-handoff`.
