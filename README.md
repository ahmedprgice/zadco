# ZADCO website

React, TypeScript and Vite website for ZADCO Oilfield Trading.

## Local development

Use Node.js 24 and pnpm 10.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The development server runs on port 8443.

## Build and verify

```sh
pnpm build
pnpm test:seo
```

The build generates static HTML for 33 pages, a 404 page, a sitemap and robots.txt in dist/.

## Deployment

The main branch is intended for the existing Vercel project zadco in ahmeds-projects-6847236c. Use the root directory and the checked-in vercel.json configuration.

The default configuration disables search indexing for previews. See SEO-LAUNCH.md and vercel.production.json for the separate public search launch configuration.
