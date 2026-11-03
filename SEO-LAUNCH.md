# SEO Build And Launch

## What Is Ready

- Public pages and 28 equipment sourcing pages are pre-rendered with visible content.
- Every page has a distinct title, description, canonical URL and social metadata.
- Organization, website, page and breadcrumb structured data uses confirmed company information.
- Equipment pages describe sourcing categories, not available stock. No prices, ratings, addresses or product offers have been invented.
- The build creates a sitemap and robots.txt. Filter/search/prefilled URLs are noindex and canonicalize to their clean page.
- Unknown URLs have a pre-rendered 404 page instead of displaying the homepage.

## Preview Mode

`pnpm run build` produces a non-indexable preview. The default Vercel configuration also sends a noindex response header. Keep this profile for client previews.

## Production Mode

The company profile identifies `https://www.zadco.ae` as the intended website. Confirm that this is the actual public domain before launch. Override `SITE_URL` at build time if it changes; the same origin is used by static and client metadata.

`pnpm run build:production` generates indexable HTML, an allow-crawl robots.txt and the sitemap. Use `vercel.production.json` as the Vercel local configuration when deploying the approved production site; it runs the production build, removes the preview-only response header and redirects legacy product aliases. Do not deploy production output under the preview configuration because its noindex header still blocks indexing.

Both configurations serve generated HTML files through clean URLs. Do not restore the old catch-all rewrite to index.html: it would serve homepage metadata for other pages and turn missing URLs into soft 404s. Other hosts must map extensionless URLs to the corresponding HTML files and serve `404.html` with HTTP 404 for unknown paths. The Vite preview middleware mirrors this routing for local verification.

## Verification

1. Run `pnpm run build` then `pnpm run test:seo` for preview checks.
2. Run `pnpm run build:production` then `pnpm run test:seo` for production checks.
3. Check the deployed HTML and response headers for every main route, a product page, sitemap.xml, robots.txt and an unknown URL. Confirm there is no production X-Robots-Tag: noindex header.
4. Verify domain ownership in Google Search Console, submit the sitemap and inspect representative URLs. Validate structured data using Google's tools.
5. Confirm phone/address details before publishing them. Replace remaining illustrative/placeholder images with approved company imagery.

No deployment, Search Console submission or ranking guarantee is included in these code changes.

Reference: [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
